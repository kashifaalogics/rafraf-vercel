const Facebook = ({ color = "#3C425A", ...props }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.7998 31.7998V12.5998C17.7998 9.94884 19.9488 7.7998 22.5998 7.7998H23.7998M11.7998 17.3998H23.7998"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="17.5" stroke={color} />
    </svg>
  );
};

export default Facebook;
