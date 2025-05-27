import React from "react";

function Verified({ className }: any) {
  return (
    <div className={className}>
      <svg
        width="19"
        height="18"
        viewBox="0 0 11 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.47503 10C8.4988 10 10.9501 7.76142 10.9501 5C10.9501 2.23858 8.4988 0 5.47503 0C2.45125 0 0 2.23858 0 5C0 7.76142 2.45125 10 5.47503 10Z"
          fill="#38AE04"
        />
        <path
          d="M3.99406 7.26984C3.91701 7.26984 3.84011 7.24335 3.78084 7.19049L2.32109 5.88579C2.20088 5.77816 2.19866 5.60195 2.31637 5.49204C2.43436 5.38226 2.62717 5.38023 2.74752 5.48773L4.00113 6.60799L8.24948 3.05467C8.37371 2.95097 8.56639 2.95871 8.68021 3.07191C8.79376 3.18537 8.78543 3.36158 8.66105 3.46527L4.20005 7.1967C4.14161 7.24551 4.0679 7.26984 3.99406 7.26984Z"
          stroke="white"
          strokeWidth="0.66"
        />
      </svg>
    </div>
  );
}

export default Verified;
