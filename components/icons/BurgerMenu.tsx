const BurgerMenu = ({ color = "#121212", ...props }) => {
  return (
    <svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.41016 9.44141H22.5866M1.41016 1.94141H22.5866M1.41016 16.9414H22.5866"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BurgerMenu;
