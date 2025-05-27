import { ApiConfig } from "@common/types/api";
import { createEmptyCartMutation } from "@framework/utils/graphql/cart";

type CreateCartResponse = {
  createEmptyCart: string;
};

const createCart = async (
  apiConfig: ApiConfig,
): Promise<string> => {
  try {
    const cart = await apiConfig.fetch<CreateCartResponse>({
      query: createEmptyCartMutation,
      token: apiConfig.token,
    });
    return cart.data.createEmptyCart;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return ''
  }

};

export default createCart;
