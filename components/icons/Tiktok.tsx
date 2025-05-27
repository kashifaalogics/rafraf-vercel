const Tiktok = ({ color = "#3C425A", ...props }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.7241 10V22.1379C19.7241 24.2709 17.995 26 15.8621 26C13.7291 26 12 24.2709 12 22.1379C12 20.005 13.7291 18.2759 15.8621 18.2759M24.6897 16.069C21.9473 16.069 19.7241 13.8458 19.7241 11.1034"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="17.5" stroke={color} />
    </svg>
  );
};

export default Tiktok;
