import { FunctionComponent } from "react";

interface AnimationProps {
  name?: string;
  speed?: string;
}

const withAnimation =
  <P extends unknown>(
    Component: FunctionComponent<P>,
    { name = "fadeIn", speed = "" }: AnimationProps = {}
  ): FunctionComponent<P> =>
  (props) => {
    return (
      <div className={`animate__animated animate__${name}`}>
        <Component {...props} />
      </div>
    );
  };

export default withAnimation;
