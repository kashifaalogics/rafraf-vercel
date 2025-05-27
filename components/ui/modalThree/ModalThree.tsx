import { Cross } from "@components/icons";
import { FunctionComponent } from "react";
import { colors } from "theme/themeColors.config";
import { TOP_Z_INDEX } from "..";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalThree: FunctionComponent<Props> = ({ open, onClose, children }) => {
  if (!open) {
    return null;
  }

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div
        className="fixed w-screen h-screen top-0 right-0 bg-white-op-30 flex items-center justify-center animate__animated animate__fadeIn animate__faster overflow-y-auto"
        style={{
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
          zIndex: TOP_Z_INDEX - 3,
        }}
        onClick={onClose}
      >
        <div
          className="rounded-lg relative p-11 max-h-full overflow-y-auto animate__animated animate__zoomIn animate__faster mt-36  bg-white-op-10 "
          onClick={stopPropagation}
        >
          <div
            className="absolute top-7 right-6 cursor-pointer"
            onClick={onClose}
          >
            <Cross className='absolute top-8 mt-8 rounded ' color={colors.darkgrey} />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalThree;
