import {
  useRef,
  useState,
  Children,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  ForwardRefRenderFunction,
} from "react";
import cn from "classnames";

interface Props {
  children: ReactNode | ReactNode[];
}

const Tabs: ForwardRefRenderFunction<Props> = ({ children }, ref) => {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    setActiveTab: (index: number) => setActiveTab(index),
    children,
    scrollIntoView: () =>
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center"
      }),
  }));

  return (
    <div ref={containerRef}>
      <div className="flex gap-6 flex-nowrap overflow-x-auto">
        {Children.map<any, any>(children, (c) => (
          <div
            className={cn(
              "shadow-lg rounded rounded-b-none w-60 p-4 hover:bg-white text-center text-lg font-bold cursor-pointer transition-all",
              activeTab === c.props.index
                ? "bg-white text-blue"
                : "bg-grey text-darkgrey"
            )}
            onClick={() => setActiveTab(c.props.index)}
          >
            {c.props.title}
          </div>
        ))}
      </div>
      <>
        {Children.map<any, any>(children, (c) => {
          if (activeTab === c.props.index) {
            return <>{c}</>;
          } else {
            return <></>;
          }
        })}
      </>
    </div>
  );
};

export default forwardRef<Props, Props>(Tabs);
