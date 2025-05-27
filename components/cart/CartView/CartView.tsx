import { useCartItems } from "@common/hooks";
import { getCartV2 } from "@common/hooks/z-hooks";
import { useStore } from "@common/state";
import { Product, RelatedProducts } from "@common/types/product";
import { CartEmptyView } from "@components/cart";
import { RelatedProductsComponent } from "@components/common/RelatedProducts";
import {
  Caption3,
  H4,
  H5,
  H6,
  P,
  Subtitle
} from "@components/typography";
import { Accordion, Button, Container, Input, Loading } from "@components/ui";
import { API_URL } from "@framework/const";
import { debounce } from "@utils/common";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItemViewV2 } from "..";

interface Props {
  setloading: any;
  cart: any;
  setTotalQuantity: any;
  setCartCount: any;
  product: any;
  count: number;
}

const CartView: FunctionComponent<Props> = ({}) => {
  // const {
  //   cartItem,
  //   cartItem: { product, quantity },
  // }: any = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { GrandTotal, productQuant, gandTotalonDecrement } = useStore();

  const {
    cart,
    address,
    cartCount,
    cartItems,
    address: shippingAddress,
    addToCart,
    removeFromCart,
    applyCoupon,
    setShippingMethodOnCart,
    applyCouponLoading,
    removeCouponLoading,
  } = useCartItems();

  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponCode, setCouponCode] = useState(
    cart.appliedCoupons?.join(", ") || ""
  );
  const [toggleProduct, setToggleProduct] = useState("");
  const [city, setCity] = useState("");
  const [coupon, setCoupon] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<RelatedProducts[]>([]);
  const { cartItemsV8, loading, error }: any = getCartV2(toggleProduct);
  const [totalQuantity, setTotalQuantity] = useState<number | undefined>(
    undefined
  );
  const [ReItems, setReItems] = useState<any | undefined>(undefined);
  const [load, setLoading] = useState(loading);

  async function getCartAgain(
    cartId: string,
    productId: string
  ): Promise<number | undefined> {
    try {
      var queryGet = `
      query Cart($cartId: String!) {
        cart(cart_id: $cartId) {
          items {
            quantity
            id
            product {
              id
              url_key
              name
              sku
              image {
                url
                label
              }
            }
          }
        }
      }
    `;

      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, variables: { cartId } }),
        headers: {
          "Content-Type": "application/json",
          Store: "ar",
        },
      });

      const data = await res.json();
      const totalQuantity = data?.data?.cart?.total_quantity;
      return totalQuantity;
    } catch (e) {
      console.log("ERROR 500");
      console.log("Exception", e);
      return undefined;
    }
  }
  async function fetchCartItems(cartId: string): Promise<any | undefined> {
    try {
      const queryGet = `
      query Cart($cartId: String!) {
        cart(cart_id: $cartId) {
            items {
                quantity
                id
                product {
                    id
                    url_key
                    name
                    sku
                    image {
                        url
                        label
                    }
                    price_range {
                        maximum_price {
                            regular_price {
                                currency
                                value
                            }
                            final_price {
                                currency
                                value
                            }
                        }
                    }
                  }
              }
          }
      }      `;

      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, variables: { cartId } }),
        headers: {
          "Content-Type": "application/json",
          Store: "ar",
        },
      });

      const data = await res.json();
      const items = data?.data?.cart?.items;
      return items;
    } catch (e) {
      console.log("ERROR 500");
      console.log("Exception", e);
      return undefined;
    }
  }

  useEffect(() => {
    if (!couponCode) {
      // removeCoupon();
    } else {
      applyCoupon(couponCode);
    }
  }, [couponCode]);

  useEffect(() => {
    if (!cart.appliedCoupons) return;
    cart.appliedCoupons[0].code !== undefined ? (
      setAppliedCoupon(cart.appliedCoupons[0].code)
    ) : (
      <></>
    );
  }, [cart.appliedCoupons]);

  const handleShippingMethodUpdate = useCallback(
    (carrierCode: string, methodCode: string) => {
      if (!methodCode || !carrierCode) return;
      setShippingMethodOnCart({
        methodCode,
        carrierCode,
      });
    },
    [setShippingMethodOnCart]
  );

  const updateCouponCode = useCallback(
    debounce<string, void>((e) => setCouponCode(e), 1000),
    [debounce, setCouponCode]
  );

  useEffect(() => {
    const address = cart.shippingAddresses?.length
      ? cart.shippingAddresses[0]
      : null;

    if (!address) return;
    setCity(address.city || "");
  }, [cart.shippingAddresses]);

  useEffect(() => {
    cartItems.map((x) => {
      if (
        x.product.related_products &&
        x.product.related_products?.length > 0 &&
        relatedProducts.length == 0
      ) {
        setRelatedProducts(x.product.related_products);
      }
    });
  }, [cartItems]);

  const shippingCost = useMemo(
    () => shippingAddress?.selectedShippingMethod?.amount || null,
    [shippingAddress]
  );

  const handleItemIncrement = useCallback(
    (product: Product) => {
      addToCart({ product, quantity: 1 });
    },
    [addToCart]
  );

  const handleItemDecrement = useCallback(
    (product: Product) => {
      addToCart({ product, quantity: -1 });
    },
    [addToCart]
  );

  const handleItemDelete = useCallback(
    (product: Product) => {
      removeFromCart({ product });
    },
    [removeFromCart]
  );

  // useEffect(() => {
  //   const fetchUpdatedCartData = async () => {
  //     try {
  //       if (cart?.id) {
  //         const fetchedTotalQuantity = await getCartAgain(cart?.id, product);
  //         if (fetchedTotalQuantity !== undefined) {
  //           setTotalQuantity(fetchedTotalQuantity);
  //         } else {
  //           console.error("Failed to fetch total quantity.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching updated cart data:", error);
  //     }
  //   };
  //   fetchUpdatedCartData();
  // }, [totalQuantity]);

  // useEffect(() => {
  //   const fetchCartItemsV8 = async () => {
  //     try {
  //       const { cartItemsV8, loading, error }: any = getCartV2(toggleProduct);
  //     } catch (error) {
  //       console.error("Error fetching cart items:", error);
  //     }
  //   };

  //   fetchCartItemsV8();
  // }, [totalQuantity, toggleProduct]);
  return (
    <div>
      {!loading && cartItemsV8.cart?.items?.length ? (
        <>
          <div className="flex flex-wrap gap-7 pb-28 justify-center">
            {/* cart items list */}
            {/* list header */}
            {!loading && cartItemsV8 && !error ? (
              <>
                <div className="w-full flex mt-6 justify-start">
                  <div className="flex gap-1">
                    <div className="text-darkgrey">{t("cart:totalItems")}</div>
                    <div className="text-black">
                      {cartItemsV8.cart.items.length}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {/* end list header */}

            <div>
              {!loading && cartItemsV8 && !error ? (
                <div className="flex-1">
                  {/* cartItemsV8.cart.items */}

                  {cartItemsV8.cart.items.map((item: any) => (
                    <CartItemViewV2
                      products={cartItemsV8?.cart?.items}
                      key={item.product.id}
                      cartItem={item}
                      itemID={item.id}
                      onDelete={(itemID: any) => {
                        setToggleProduct(itemID);
                      }}
                      onIncrement={handleItemIncrement}
                      onDecrement={handleItemDecrement}
                      // onDelete={handleItemDelete}
                      loading={false}
                    />
                  ))}
                </div>
              ) : error ? (
                <>
                  {/* {showPopup ? openModal(<LoginForm onLoginComplete={closeModal} />): null} */}
                </>
              ) : (
                <div>
                  <Loading className="w-full" />
                </div>
              )}
            </div>

            {/* cart summary */}
            {!loading && cartItemsV8 && !error ? (
              <div className="w-full md:w-4/12">
                <div className="bg-light p-3 rounded-md">
                  <H4 className="mx-2 mt-4">{t("cart:summary")}</H4>
                  <Accordion
                    innerClassName="border-light-blue"
                    label={
                      <Subtitle className="text-black">
                        {t("cart:applyDiscount")}
                      </Subtitle>
                    }
                  >
                    {applyCouponLoading || removeCouponLoading ? (
                      <div className="flex justify-center items-center">
                        <Loading />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="grid grid-flow-row-dense grid-cols-5">
                      <div className="col-span-4">
                        <Input
                          style={{
                            color: Boolean(appliedCoupon)
                              ? "lightgray"
                              : "black",
                          }}
                          label={t("cart:discountCode")}
                          id="discountCode"
                          type="text"
                          name="discountCode"
                          placeholder="XXXXXX"
                          disabled={Boolean(appliedCoupon)}
                          onValueChange={(e) => {
                            setCoupon(e.value);
                            setInputValue(e.value);
                          }}
                          value={inputValue}
                          borderColor="border-light-blue"
                          containerClass="mt-3"
                          defaultValue={
                            cart.appliedCoupons?.length
                              ? cart.appliedCoupons[0].code
                              : ""
                          }
                        />
                      </div>
                      <div className="mt-9">
                        <button
                          className="w-full bg-light-blue rounded-l-sm flex justify-around items-center"
                          style={{ height: 52 }}
                          onClick={() => {
                            Boolean(appliedCoupon) ? (
                              setAppliedCoupon("")
                            ) : (
                              <></>
                            );
                            Boolean(appliedCoupon)
                              ? setCouponCode("")
                              : setCouponCode(coupon);
                            Boolean(appliedCoupon) ? setInputValue("") : <></>;
                          }}
                        >
                          {Boolean(appliedCoupon)
                            ? t("cart:remove")
                            : t("cart:apply")}
                        </button>
                      </div>
                    </div>
                  </Accordion>
                  <div className="p-1 flex flex-col gap-4 py-4">
                    {/* <div className="flex justify-between"> */}
                    {/* <H6>{t("cart:subtotal")}</H6> */}
                    {/* <P>
                        {cartItemsV8.cart.prices.grand_total.value.toFixed(2)}{" "}
                        {cartItemsV8.cart.prices?.subtotal_excluding_tax
                          ?.currency || "SAR"}
                      </P> */}
                    {/* </div> */}
                    <div>
                      <Caption3 className="text-darkgrey mt-1">
                        {t("cart:availabilityPhrase")}
                      </Caption3>
                    </div>

                    {/* <div className="flex justify-between">
                      <H6>{t("cart:vatTax")}</H6>
                      <P>
                        0.00
                        {(
                            (cartItemsV8.cart.prices?.grand_total?.value || 0) -
                            (cartItemsV8.cart.prices?.subtotal_excluding_tax?.value || 0)
                          ).toFixed(2)}{" "}
                          {cartItemsV8.cart.prices?.subtotal_excluding_tax?.currency || "SAR"}
                      </P>
                    </div> */}

                    {cart.prices?.discount?.amount?.value ? (
                      <div className="flex justify-between">
                        <H6>{t("cart:discount")}</H6>
                        <P>
                          {cart.prices?.discount?.amount?.value.toFixed(2)}{" "}
                          {cart.prices?.discount?.amount?.currencyCode || "SAR"}
                        </P>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex justify-between p-1 py-3">
                    <H5>{t("cart:orderTotal")}</H5>
                    <H5 className="flex gap-2">
                      <H5>{GrandTotal}</H5>
                      {cartItemsV8.cart.prices?.subtotal_excluding_tax
                        ?.currency || "SAR"}
                    </H5>
                  </div>
                  <div className="flex justify-between p-1 py-3">
                    <H5>{t("cart:order")}</H5>
                    <H5 className="flex gap-1">
                      <H5>{GrandTotal}</H5>
                      {cartItemsV8.cart.prices?.subtotal_excluding_tax
                        ?.currency || "SAR"}
                      <H5>{t("cart:includingShipping")}</H5>
                    </H5>
                  </div>
                  {/* Here is V1 */}
                  {/* <div className="flex justify-between p-1 py-3">
                    <H5>{t("cart:shippingCost")}</H5>
                    <H5 className="flex gap-2">
                      <H5>
                        {address?.availableShippingMethods?.[1]
                          ? address?.availableShippingMethods?.[1].amount?.value.toFixed(
                              2
                            )
                          : address?.availableShippingMethods?.[0].amount?.value.toFixed(
                              2
                            )}{" "}
                        {"SAR"}
                      </H5>
                    </H5>
                  </div> */}
                  {/* <div className="flex justify-between p-1 py-3">
                    <H5>{t("cart:GrandTotal")}</H5>
                    <H5 className="flex gap-2">
                      <H5>
                        {`${(
                          GrandTotal +
                          Number(
                            address?.availableShippingMethods?.[1]
                              ? address?.availableShippingMethods?.[1].amount
                                  ?.value
                              : address?.availableShippingMethods?.[0].amount
                                  ?.value
                          )
                        ).toFixed(2)} SAR`}
                      </H5>
                    </H5>
                  </div> */}
                  <Subtitle className="text-darkgrey flex">
                    {t("cart:vatInclusive")}
                  </Subtitle>
                  <Button
                    className="w-full p-4 mt-8"
                    style={{ backgroundColor: "#1D4ED8" }}
                    onClick={() => {
                      router.push("/checkout");
                    }}
                  >
                    {t("cart:checkout")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <Container className="my-16">
            {relatedProducts.length > 0 && (
              <RelatedProductsComponent related_products={relatedProducts} />
            )}
          </Container>
        </>
      ) : !loading && !cartItemsV8.cart?.items.length ? (
        <CartEmptyView cartItems={[]} />
      ) : loading ? (
        <div>
          <Loading className="w-full" />
        </div>
      ) : null}
    </div>
  );
};

export default CartView;
