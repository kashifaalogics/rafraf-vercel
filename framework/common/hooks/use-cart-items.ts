import { Dispatch, RootState } from "@common/store";
import { Cart, CartItem } from "@common/types/cart";
import { Product } from "@common/types/product";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApiConfig, useAuth } from ".";
import { singletonHook } from "react-singleton-hook";
import { Country, CountryState } from "@common/types/coutries";
import { Address } from "@common/types/address";
import { ShippingAddress } from "@common/types/shipping";
import toast from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import { colors } from "theme/themeColors.config";
import { useStore } from "@common/state";

type CartItemWithLoading = CartItem & { loading: boolean };

export interface UseCartItemsResult {
  cartItems: CartItemWithLoading[];
  cartCount: number;
  cart: Cart;
  getCartLoading: boolean;
  address: ShippingAddress | null;

  addToCart: ({
    product,
    quantity,
  }: {
    product: Product;
    quantity?: number | undefined;
  }) => Promise<void>;

  removeFromCart: ({ product }: { product: Product }) => Promise<void>;

  countries: Country[];
  countryStates: CountryState[];
  getCountries: () => Promise<void>;
  getCountryStates: (countryCode: string) => Promise<void>;
  getCountriesLoading: boolean;
  getCountryStatesLoading: boolean;

  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;

  setShippingAddressOnCart: (address: Address) => Promise<void>;
  setShippingMethodOnCart: ({
    carrierCode,
    methodCode,
  }: {
    carrierCode: string;
    methodCode: string;
  }) => Promise<void>;
  setPaymentMethodOnCart: (paymentMethod: string) => Promise<void>;
  setGuestEmailOnCart: (email: string) => Promise<void>;

  applyCouponLoading: boolean;
  removeCouponLoading: boolean;
  setShippingAddressesOnCartLoading: boolean;
  setShippingMethodOnCartLoading: boolean;
  setPaymentMethodOnCartLoading: boolean;
  setGuestEmailOnCartLoading: boolean;
}

const initialResult: UseCartItemsResult = {
  cartItems: [],
  cartCount: 0,
  cart: {},
  address: {},
  getCartLoading: false,
  addToCart: async (args) => {},
  removeFromCart: async (args) => {},
  countries: [],
  countryStates: [],
  getCountries: async () => {},
  getCountryStates: async (args) => {},
  getCountriesLoading: false,
  getCountryStatesLoading: false,
  applyCoupon: async (args) => {},
  removeCoupon: async () => {},
  setShippingAddressOnCart: async (args) => {},
  setShippingMethodOnCart: async (args) => {},
  setPaymentMethodOnCart: async (args) => {},
  setGuestEmailOnCart: async (args) => {},
  applyCouponLoading: false,
  removeCouponLoading: false,
  setShippingAddressesOnCartLoading: false,
  setShippingMethodOnCartLoading: false,
  setPaymentMethodOnCartLoading: false,
  setGuestEmailOnCartLoading: false,
};

const useCartItems = (): UseCartItemsResult => {
  const router = useRouter();
  const { t } = useTranslation();
  const cartCountV2 = useStore((state) => state.cartCount)
  const setCartCount = useStore((state) => state.setCartCount)
  const setToggleCartCall = useStore((state) => state.setToggleCartCall)
  const { cart, cartItemsSkusLoading, cartId, countries, states } = useSelector(
    (state: RootState) => state.cart
  );
  const {
    getCart: getCartLoading,
    getCustomerCart: getCustomerCartLoading,
    getCountries: getCountriesLoading,
    getCountryStates: getCountryStatesLoading,
    applyCoupon: applyCouponLoading,
    setShippingAddress: setShippingAddressesOnCartLoading,
    setShippingMethod: setShippingMethodOnCartLoading,
    setPaymentMethod: setPaymentMethodOnCartLoading,
    setGuestEmail: setGuestEmailOnCartLoading,
    removeCoupon: removeCouponLoading,
  } = useSelector((state: RootState) => state.loading.effects.cart);
  const dispatch = useDispatch<Dispatch>();
  const apiConfig = useApiConfig();
  const { loggedIn, token } = useAuth();
  const {
    cart: {
      addToCartAndSave,
      removeFromCartAndSave,
      getCart,
      getCustomerCart,
      getCountries,
      getCountryStates,
      setShippingAddress: setShippingAddressesOnCart,
      applyCoupon,
      setShippingMethod: setShippingMethodOnCart,
      setPaymentMethod: setPaymentMethodOnCart,
      setGuestEmail: setGuestEmailOnCart,
      removeCoupon,
    },
  } = dispatch;

  const cartCount = useMemo<number>(
    () => cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
    [cart.items]
  );

  const cartItemsWithLoading = useMemo<CartItemWithLoading[]>(
    () =>
      cart.items?.map((i) => ({
        ...i,
        loading: cartItemsSkusLoading.map((s) => s.sku).includes(i.product.sku),
      })) || [],
    [cart.items, cartItemsSkusLoading]
  );

  const address = useMemo(() => {
    if (!cart.shippingAddresses?.length) return null;
    const address = cart.shippingAddresses[0];

    return address;
  }, [cart.shippingAddresses]);

  return {
    cartItems: cartItemsWithLoading,
    cartCount,
    cart,
    address,
    getCartLoading,
    addToCart: async ({
      product,
      quantity = 1,
    }: {
      product: Product;
      quantity?: number;
    }) => {
      try {
        toast(t("common/cart:addingToCart"), {
          position: "bottom-center",
          style: { backgroundColor: '#1D4ED8' , color: colors.white },
        });
        const res = await addToCartAndSave({ apiConfig, product, quantity });
        setCartCount(cartCountV2 + quantity)
        toast(t("common/cart:addedToCart"), {
          position: "bottom-center",
          style: { backgroundColor: '#1D4ED8', color: colors.white },
        });
        setToggleCartCall()
        // deleteCarCount(cartCountV2 - quantity)
        // toast(t("common/cart:deleteFromCart"), {
        //   position: "bottom-center",
        //   style: { backgroundColor: '#1D4ED8', color: colors.white },
        // })
        return res;
      } catch (e) {}
    },  

    removeFromCart: ({ product }: { product: Product }) =>
      removeFromCartAndSave({ apiConfig, product }),

    countries,
    countryStates: states,
    getCountries: () => getCountries(apiConfig),
    getCountryStates: (countryCode: string) =>
      getCountryStates({ apiConfig, countryCode }),
    getCountriesLoading,
    getCountryStatesLoading,

    setShippingAddressOnCart: (address: Address) =>
      setShippingAddressesOnCart({ apiConfig, address }),
    applyCoupon: (couponCode: string) => applyCoupon({ apiConfig, couponCode }),
    removeCoupon: () => removeCoupon(apiConfig),
    setShippingMethodOnCart: ({
      carrierCode,
      methodCode,
    }: {
      carrierCode: string;
      methodCode: string;
    }) => setShippingMethodOnCart({ apiConfig, carrierCode, methodCode }),
    setPaymentMethodOnCart: (paymentMethod: string) =>
      setPaymentMethodOnCart({ apiConfig, paymentMethod }),
    setGuestEmailOnCart: (email: string) =>
      setGuestEmailOnCart({ apiConfig, email }),

    applyCouponLoading,
    removeCouponLoading,
    setShippingAddressesOnCartLoading,
    setShippingMethodOnCartLoading,
    setPaymentMethodOnCartLoading,
    setGuestEmailOnCartLoading,
  };
};

export default singletonHook(initialResult, useCartItems);
