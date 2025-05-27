import Cookies from "js-cookie";
import { MAGENTO_CART_COOKIE } from "@framework/const";

const storeCartId = (cartId: string) =>
  Cookies.set(MAGENTO_CART_COOKIE, cartId);

export default storeCartId;
