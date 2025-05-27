import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { getCustomerCartQuery } from "@framework/utils/graphql/cart";
import { useStore } from "@common/state";


type GetCustomerCartResponse = {
  customerCart: MagentoCart;
};

const getCustomerCart = async (apiConfig: ApiConfig): Promise<Cart> => {
  
  if (!apiConfig.token)
    throw new Error("getting customer cart requires logging in");

    try {
      const cart = await apiConfig.fetch<GetCustomerCartResponse>({
        query: getCustomerCartQuery,
        token: apiConfig.token,
      });
      localStorage.setItem("CART_ID", cart.data.customerCart.id)
      return normalizeCart(cart.data.customerCart);
    }
    catch(e) {
      console.log('cart error')
      console.log(e)

      return {}
    }

};

export default getCustomerCart;
