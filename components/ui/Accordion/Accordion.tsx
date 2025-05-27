import { FunctionComponent, useState, ReactNode, HTMLProps } from "react";
import cn from "classnames";
import { Arrow } from "@components/icons";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: ReactNode;
  innerClassName?: string;
  open?: boolean;
}

const Accordion: FunctionComponent<Props> = ({ label, children, innerClassName = "", open: isOpen = false, ...rest }) => {
  const [open, setOpen] = useState<boolean>(isOpen);
  return (
    <div {...rest}>
      <div
        className={cn("flex justify-between items-center p-6 rounded-md border-b-2 cursor-pointer hover:bg-light-blue-op-20 transition-all rounded-b-none", innerClassName)}
        onClick={() => setOpen(!open)}
      >
        {label}
        <Arrow direction={open ? "up" : "down"} className="transition-all" />
      </div>
      <div
        className={cn(
          open ? "scale-y-100 max-h-full m-2" : "scale-y-0 max-h-0 m-0",
          "transition-all transform origin-top"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
