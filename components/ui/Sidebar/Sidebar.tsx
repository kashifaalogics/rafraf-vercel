import { FunctionComponent, useEffect, useRef } from "react";
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";
import { TOP_Z_INDEX } from "..";


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FunctionComponent<Props> = ({ children, isOpen, onClose }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (ref.current) {
      if (isOpen) {
        disableBodyScroll(ref.current);
      } else {
        enableBodyScroll(ref.current);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 overflow-hidden h-full"
          style={{ zIndex: TOP_Z_INDEX + 1}}
        >
          <div ref={ref} className="absolute inset-0 overflow-hidden">
            <div
              onClick={onClose}
              className="absolute inset-0 bg-black-op-30"
              style={{ backdropFilter: "blur(10px)" }}
            />
            <div className="relative w-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
