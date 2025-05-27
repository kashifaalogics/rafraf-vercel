import React, { HTMLAttributes } from "react";

interface PlayButtonProps extends HTMLAttributes<HTMLDivElement> {}

const PlayButton: React.FC<PlayButtonProps> = ({ style, ...rest }) => {
  return (
    <div
      style={{
        position: "relative",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        ...style,
      }}
      {...rest}
    >
      <svg
        width="100"
        height="100"
        viewBox="-10 -10 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
        @keyframes ping {
          70%, 100% {
            transform: scale(9);
            opacity: -2 ;
          }
        }

        .animate-ping-once {
          animation: ping 1s forwards;
        }
      `}
        </style>

        <path
          opacity="0.4"
          d="M40.2423 73.933C58.6518 73.933 73.5756 59.0092 73.5756 40.5997C73.5756 22.1902 58.6518 7.26636 40.2423 7.26636C21.8328 7.26636 6.90894 22.1902 6.90894 40.5997C6.90894 59.0092 21.8328 73.933 40.2423 73.933Z"
          fill="white"
        />
        <path
          d="M30.5754 40.5996V35.6662C30.5754 29.2996 35.0754 26.7329 40.5754 29.8996L44.8421 32.3662L49.1088 34.8329C54.6088 37.9996 54.6088 43.1996 49.1088 46.3662L44.8421 48.8329L40.5754 51.2996C35.0754 54.4662 30.5754 51.8662 30.5754 45.5329V40.5996Z"
          fill="white"
        />
        <path
          opacity="0.4"
          d="M40.2423 73.933C58.6518 73.933 73.5756 59.0092 73.5756 40.5997C73.5756 22.1902 58.6518 7.26636 40.2423 7.26636C21.8328 7.26636 6.90894 22.1902 6.90894 40.5997C6.90894 59.0092 21.8328 73.933 40.2423 73.933Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default PlayButton;
