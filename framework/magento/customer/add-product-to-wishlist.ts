import { ApiConfig } from "@common/types/api";
// import { Wishlist } from "@common/types/wishlist";
import { Wishlist as MagentoWishlist } from "@framework/schema";
import { normalizeWishlist } from "@framework/utils";
import { addProductToWishlistMutation } from "@framework/utils/graphql/customer";
import { $CombinedState } from "redux";

interface AddProductToWishlistResult {
  addProductsToWishlist: {
    wishlist: MagentoWishlist;
  };
}

const addProductToWishlist = async ({
  apiConfig,
  sku,
}: {
  apiConfig: ApiConfig;
  sku: string;
}) => {
  try {
    const data = await apiConfig.fetch<AddProductToWishlistResult>({
      query: addProductToWishlistMutation,
      token: apiConfig.token,
      locale: apiConfig.locale,
      variables: { sku },
    });
    return normalizeWishlist(data.data.addProductsToWishlist.wishlist);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default addProductToWishlist;
