import { FunctionComponent } from "react";
import { Loading } from "@components/ui";

interface Props {
  getCartLoading: boolean;
}

const CartLoadingView: FunctionComponent<Props> = ({ getCartLoading }) => {
  return (
    <div>
      {getCartLoading ? (
        <div className="flex justify-center items-center">
          <Loading color="blue" size={120} className="my-44" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CartLoadingView;
