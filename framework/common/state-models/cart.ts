import { Dispatch, RootState } from "@common/store";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { Cart, CartItem } from "@common/types/cart";
import { ApiConfig } from "@common/types/api";
import { Product } from "@common/types/product";
import {
  addItemsToCart,
  applyCoupon,
  createCart,
  getCart,
  getCountries,
  getCustomerCart,
  getStates,
  removeItemFromCart,
  setPaymentMethodOnCart,
  setShippingAddressOnCart,
  setShippingMethodOnCart,
  updateCartItems,
} from "@framework/cart";
import { getSavedState, MapToSavable, saveState } from "@common/state-utils";
import { Country, CountryState } from "@common/types/coutries";
import { Address } from "@common/types/address";
import { handleError, handleSuccess } from "@common/utils/handlers";
import setGuestEmailOnCart from "@framework/cart/set-guest-email-on-cart";
import { removeCoupon } from "@framework/cart";

export interface AddToCartPayload {
  apiConfig: ApiConfig;
  product: Product;
  quantity?: number;
}

type SkuLoading = {
  sku: string;
  timestamp: number;
};

export interface CartState {
  cart: Cart;
  cartItemsSkusLoading: SkuLoading[];
  cartId: string;
  countries: Country[];
  states: CountryState[];
  selectedCountry: string;
  selectedCountryState: string;
}

const defaultState: CartState = {
  cart: {},
  cartItemsSkusLoading: [],
  cartId: "",
  countries: [],
  states: [],
  selectedCountry: "",
  selectedCountryState: "",
};

const mapToSaveble: MapToSavable<CartState> = (state: CartState) => ({
  cart: state.cart,
  cartId: state.cartId,
  cartItemsSkusLoading: defaultState.cartItemsSkusLoading,
  countries: state.countries,
  states: state.states,
  selectedCountry: state.selectedCountry,
  selectedCountryState: state.selectedCountryState,
});

const saveCartState = saveState<CartState>(
  "CART_STATE",
  defaultState,
  mapToSaveble
);

const getSavedCartState = getSavedState<CartState>("CART_STATE");

const initailState = getSavedCartState() || defaultState;

export const cart = createModel<RootModel>()({
  state: initailState,

  reducers: {
    reset(state: CartState) {
      state = defaultState;
      saveCartState(defaultState);
    },

    setCartId(state: CartState, payload: string) {
      state.cartId = payload;
      saveCartState(state);
    },

    setCart(state: CartState, payload: Cart) {
      state.cart = payload;
      saveCartState(state);
    },

    setCartItems(state: CartState, payload: CartItem[]) {
      state.cart.items = payload;
      saveCartState(state);
    },

    addToCart(state: CartState, cartItem: CartItem) {
      if (!state.cart.items) {
        state.cart.items = [];
      }
      const index = state.cart.items.findIndex(
        (c) => c.product.id === cartItem.product.id
      );
      if (index < 0) {
        state.cart.items.push(cartItem);
      } else {
        state.cart.items[index].quantity += cartItem.quantity;
        if (state.cart.items[index].quantity < 1) {
          state.cart.items = state.cart.items.filter(
            (c) => c.product.id !== state.cart.items![index].product.id
          );
        }
      }
      saveCartState(state);
    },

    setCartItemId(
      state: CartState,
      { product, id }: { product: Product; id: string }
    ) {
      if (!state.cart.items?.length) return;
      const index = state.cart.items.findIndex(
        (i) => i.product.id === product.id
      );
      if (index < 0) return;
      state.cart.items[index].id = id;
      saveCartState(state);
    },

    removeFromCart(state: CartState, product: Product) {
      state.cart.items =
        state.cart.items?.filter((c) => c.product.id !== product.id) || [];
      saveCartState(state);
    },

    addToSkusLoading(state: CartState, sku: SkuLoading) {
      state.cartItemsSkusLoading.push(sku);
    },

    removeFromSkusLoading(state: CartState, sku: SkuLoading) {
      state.cartItemsSkusLoading = state.cartItemsSkusLoading.filter(
        (s) => sku.sku !== s.sku && s.timestamp !== sku.timestamp
      );
    },

    setCountries(state: CartState, countries: Country[]) {
      state.countries = countries;
      saveCartState(state);
    },

    setCountryStates(state: CartState, states: CountryState[]) {
      state.states = states;
      saveCartState(state);
    },

    setSelectedCountry(state: CartState, countryCode: string) {
      state.selectedCountry = countryCode;
      saveCartState(state);
    },

    setSelectedCountryState(state: CartState, countryStateCode: string) {
      state.selectedCountryState = countryStateCode;
      saveCartState(state);
    },
  },

  effects: (dispatch: Dispatch) => {
    const { cart } = dispatch;

    const effects = {
      async getCart(apiConfig: ApiConfig, ...args: any[]) {
        const [state] = args as [RootState];
        const cartResponse = await getCart(apiConfig, {
          cartId: state.cart.cartId || state.cart.cart.id || "",
        });
        cart.setCart(cartResponse);
      },

      async getCustomerCart(apiConfig: ApiConfig) {
        const cartResponse = await getCustomerCart(apiConfig);
        cart.setCart(cartResponse);
      },

      async addToCartAndSave(payload: AddToCartPayload, ...args: any[]) {
        const { apiConfig, product, quantity = 1 } = payload;
        const [state] = args as [RootState];

        if (!product.sku) return;
        
        let productWithVendor = product
        if(!product.variants.length) {
          const defaultVariant =  [
            {
                "attributes": [
                    {
                        "code": "vendor_store",
                        "value": "864858",
                        "label": "Rafraf",
                        "uid": "Y29uZmlndXJhYmxlLzE3Ni84NjQ4NTg="
                    }
                ]
            }
          ]
          productWithVendor = {...product, variants: defaultVariant}
        }

        const cartItem: CartItem = {
          id: state.cart.cart.items?.find(
            (i2) => i2.product.sku === product.sku
          )?.id,
          product: productWithVendor,
          quantity:
            (state.cart.cart.items?.find((i2) => i2.product.sku === product.sku)
              ?.quantity || 0) + quantity,
        };

        // optimistic UI update
        cart.addToCart({ product, quantity });

        // loading state for a praticular cart item
        const skuLoading: SkuLoading = {
          sku: product.sku,
          timestamp: Date.now(),
        };
        cart.addToSkusLoading(skuLoading);

        // determine which api to call depending of value of quantity
        let cartUpdater: typeof addItemsToCart | typeof updateCartItems;
        let passedCartItem: CartItem = { ...cartItem };
        if (quantity > 0) {
          cartUpdater = addItemsToCart;
          passedCartItem.quantity = quantity;
        } else {
          cartUpdater = updateCartItems;
        }

        try {
          let passedCartId: string =
            state.cart.cartId || state.cart.cart.id || "";
          if (!state.cart.cart.id && !state.cart.cartId) {
            const emptyCartId = await createCart(apiConfig);
            cart.setCartId(emptyCartId);
            localStorage.setItem("CART_ID", emptyCartId)
            passedCartId = emptyCartId;
          }
          const res = await cartUpdater(apiConfig, {
            cartId: passedCartId,
            cartItems: [passedCartItem],
          });
          
          console.log(2)
          let addedCartItem: CartItem | undefined;

          if (quantity > 0) {
            addedCartItem = res.items?.find(
              (i) =>
                i.product.sku === product.sku &&
                i.quantity === cartItem.quantity
            );
          console.log(3)

          } else {
            if (cartItem.quantity < 1) {
              addedCartItem = { ...passedCartItem };
            } else {
              addedCartItem = res.items?.find(
                (i) =>
                  i.product.sku === product.sku &&
                  i.quantity === cartItem.quantity
              );
            }
          }

          if (!addedCartItem || !addedCartItem.id) {
            throw new Error("item has not added to cart");
          }

          cart.setCartItemId({ product, id: addedCartItem.id });

          const updatedCart = await getCart(apiConfig, {
            cartId: passedCartId,
          });
          cart.setCart(updatedCart);
        } catch (e) {
          console.log(e)
          cart.addToCart({ product, quantity: quantity * -1 });

          // Setting the old items in the cart
          let prevItems: any = state.cart.cart.items
          prevItems = [...prevItems, passedCartItem]


          // Creaing new empty cart to transfer prev itmes to it
          let passedCartId: string = state.cart.cartId || state.cart.cart.id || ""; 
          if (state.cart.cart.id || state.cart.cartId) {
            const emptyCartId = await createCart(apiConfig);
            cart.setCartId(emptyCartId);
            localStorage.setItem("CART_ID", emptyCartId)
            passedCartId = emptyCartId;
          }

          // Set the prev items to the new cart
          const res = await cartUpdater(apiConfig, {
            cartId: passedCartId,
            cartItems: prevItems,
          });

          let addedCartItem: CartItem | undefined;

          if (quantity > 0) {
            addedCartItem = res.items?.find(
              (i) =>
                i.product.sku === product.sku &&
                i.quantity === cartItem.quantity
            );
          } else {
            if (cartItem.quantity < 1) {
              addedCartItem = { ...passedCartItem };
            } else {
              addedCartItem = res.items?.find(
                (i) =>
                  i.product.sku === product.sku &&
                  i.quantity === cartItem.quantity
              );
            }
          }

          if (!addedCartItem || !addedCartItem.id) {
            throw new Error("item has not added to cart");
          }

          cart.setCartItemId({ product, id: addedCartItem.id });

          const updatedCart = await getCart(apiConfig, {
            cartId: passedCartId,
          });
          cart.setCart(updatedCart);
          localStorage.setItem("CART_ID", updatedCart.id || "")
  
        } finally {
          cart.removeFromSkusLoading(skuLoading);
        }
      },

      async removeFromCartAndSave(
        { apiConfig, product }: AddToCartPayload,
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        const toBeRemoved = state.cart.cart.items?.find(
          (item) => item.product.id === product.id
        );
        if (!toBeRemoved) return;

        const skuLoading: SkuLoading = {
          sku: product.sku,
          timestamp: Date.now(),
        };

        cart.removeFromCart(product);
        cart.addToSkusLoading(skuLoading);
        try {
          // remove from cart
          const res = await removeItemFromCart(apiConfig, {
            cartId: state.cart.cartId,
            cartItemId: Number(toBeRemoved.id || 0),
          });

          if (res.items?.map((ci) => ci.id).includes(toBeRemoved.id)) {
            throw new Error("item has not been removed");
          }

          const updatedCart = await getCart(apiConfig, {
            cartId: state.cart.cartId,
          });
          cart.setCart(updatedCart);
        } catch (e) {
          cart.addToCart(toBeRemoved);
        } finally {
          cart.removeFromSkusLoading(skuLoading);
        }
      },

      async getCountries(apiConfig: ApiConfig) {
        const countries = await getCountries(apiConfig);
        cart.setCountries(countries);
      },

      async getCountryStates({
        apiConfig,
        countryCode,
      }: {
        apiConfig: ApiConfig;
        countryCode: string;
      }) {
        const countryStates = await getStates(apiConfig, { countryCode });
        cart.setCountryStates(countryStates);
      },

      async applyCoupon(
        {
          apiConfig,
          couponCode,
        }: {
          apiConfig: ApiConfig;
          couponCode: string;
        },
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        try {
          const cartResponse = await applyCoupon(apiConfig, {
            code: couponCode,
            cartId: state.cart.cartId,
          }) as any;

          if (cartResponse !== null && JSON.stringify(cartResponse) !== "{}") {
            cart.setCart(cartResponse);
            handleSuccess("couponApplied");
          }
          else {
            handleSuccess("couponeIsntValid");
          }
        } catch (e) {
          // handleError(e as any);
          handleSuccess("couponeIsntValid");
          const cartResponse = await removeCoupon(apiConfig, {
            cartId: state.cart.cartId,
          });
          cart.setCart(cartResponse);
        }
      },

      async removeCoupon(apiConfig: ApiConfig, ...args: any[]) {
        const [state] = args as [RootState];
        try {
          const cartResponse = await removeCoupon(apiConfig, {
            cartId: state.cart.cartId,
          });
          cart.setCart(cartResponse);
          // handleSuccess("couponRemoved");
        } catch (e) {
          handleError(e as any);
        }
      },

      // fix
      async setShippingAddress(
        { apiConfig, address }: { apiConfig: ApiConfig; address: Address },
        ...args: any[]
      ) {
        console.log("apiConfig:", apiConfig)
        const [state] = args as [RootState];
        const cartResponse = await setShippingAddressOnCart(apiConfig, {
          cartId: state.cart.cartId,
          address,
        });
        console.log("cartResponse:", cartResponse)
        cart.setCart(cartResponse);
      },

      async setShippingMethod(
        {
          apiConfig,
          carrierCode,
          methodCode,
        }: {
          apiConfig: ApiConfig;
          carrierCode: string;
          methodCode: string;
        },
        ...args: any[]
      ) {
        const [state] = args as [RootState];

        const cartResponse = await setShippingMethodOnCart(apiConfig, {
          cartId: state.cart.cartId,
          carrierCode,
          methodCode,
        });
        cart.setCart(cartResponse);
      },

      async setPaymentMethod(
        {
          apiConfig,
          paymentMethod,
        }: {
          apiConfig: ApiConfig;
          paymentMethod: string;
        },
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        const cartResponse = await setPaymentMethodOnCart(apiConfig, {
          paymentMethod,
          cartId: state.cart.cartId,
        });
        cart.setCart(cartResponse);
      },

      async setGuestEmail(
        { apiConfig, email }: { apiConfig: ApiConfig; email: string },
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        const cartResponse = await setGuestEmailOnCart(apiConfig, {
          email,
          cartId: state.cart.cartId,
        });
      },
    };

    return effects;
  },
});
