import { API_URL } from "@framework/const";
import { addItemsToCartMutation as query } from "@framework/utils/graphql";
import useStore from '@common/state/use-store'

interface Props {
  setLoading: any;
  cart: any;
  setTotalQuantity: any;
  setCartCount: any;
  product: any;
  count: number;
  setGrandTotal: any;
}

async function addProductToCart({setLoading, cart, setTotalQuantity, setCartCount, setGrandTotal, product, count}: Props) {

  const token = localStorage.getItem("TOKEN")
  ? localStorage.getItem("TOKEN")
  : JSON.parse(localStorage.getItem("CUSTOMER_STATE") || "{}").token;
  setLoading(true); 
  try {
    const res = await fetch(`${API_URL}/graphql`, {
      method: "POST",
      body: JSON.stringify({
        query: query,
        variables: {
          cartId: cart.id,
          cartItems: [
            {
              entered_options: [
                {
                  uid: "176",
                  value:
                    product.variants[0].attributes[0].value_index.toString(),
                },
              ],
              sku: product.sku,
              quantity: count,
              selected_options: [product.variants[0].attributes[0].uid],
            },
          ],
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const price = data.data.addProductsToCart.cart.prices.grand_total.value;

    setGrandTotal(price);


    const cartItems = data.data.addProductsToCart.cart.items;
    const total_quantity = data.data.addProductsToCart.cart.total_quantity;

    setCartCount(total_quantity);
    const selectedItem = cartItems.filter(
      (item: any) => item.product.sku === product.sku
    )[0];

    setTotalQuantity(selectedItem.quantity);

    setLoading(false);
    if (data.errors) {
      if (
        data.errors[0].message.includes(
          "The current user cannot perform operations on cart"
        )
      ) {
        // handle unauthorized/expired cart
      }
    }
    return data;
  } catch (e) {
    setLoading(false);
    console.log(e);
  }
}

export default addProductToCart