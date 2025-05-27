import { Cross } from "@components/icons";
import { FunctionComponent } from "react";
import { colors } from "theme/themeColors.config";
import { TOP_Z_INDEX } from "..";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalToo: FunctionComponent<Props> = ({ open, onClose, children }) => {
  if (!open) {
    return null;
  }

  return (
    <div>
      <div
        className="fixed w-screen h-screen top-0 right-0 bg-black-op-30 flex items-center justify-center animate__animated animate__fadeIn animate__faster"
        style={{
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
          zIndex: TOP_Z_INDEX + 2,
        }}
        onClick={onClose}
        >
        <div
          className="bg-white rounded-lg relative p-11 animate__animated animate__zoomIn animate__faster"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            width: "50%",
            height: "50%", 
          }}

        >
          <div
            className="absolute top-7 right-6 cursor-pointer"
            onClick={onClose}
          >

            
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalToo;
