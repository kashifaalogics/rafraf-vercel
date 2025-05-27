import Cookies from "js-cookie";
import { MAGENTO_CART_COOKIE } from "@framework/const";

const getCartId = () => Cookies.get(MAGENTO_CART_COOKIE);

export default getCartId;
