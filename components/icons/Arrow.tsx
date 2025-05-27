import cn from "classnames";

const directionToTailwindClass = {
  left: "rotate-90",
  right: "-rotate-90",
  up: "rotate-180",
  down: "rotate-0",
};

const Arrow = ({
  color = "#121212",
  direction = "down" as keyof typeof directionToTailwindClass,
  className = "",
  ...props
}) => {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transform", directionToTailwindClass[direction], className)}
    >
      <g clipPath="url(#clip0_912_25434)">
        <path
          d="M15 4L8 11L1 4"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_912_25434">
          <rect
            width="16"
            height="15"
            fill="white"
            transform="translate(16 15) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Arrow;
