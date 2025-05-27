const LinkedIn = ({ color = "#3C425A" }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2307 13.6923V26M16.1538 26V19.8462M16.1538 19.8462C16.1538 17.1272 18.3579 14.9231 21.0769 14.9231C23.7958 14.9231 25.9999 17.1272 25.9999 19.8462V26M16.1538 19.8462V13.6923M10.9998 10H11.2307"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="17.5" stroke={color} />
    </svg>
  );
};

export default LinkedIn;
