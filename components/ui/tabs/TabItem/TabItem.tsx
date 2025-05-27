import { FunctionComponent } from "react";

interface Props {
  title: string;
  index: number;
}

const TabItem: FunctionComponent<Props> = ({ title, children }) => {
  return <div className="bg-white w-full shadow-lg p-11">{children}</div>;
};

export default TabItem;
