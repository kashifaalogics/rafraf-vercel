const Instagram = ({ color = "#3C425A", ...props }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 13.4286H23.1429M14.5714 10H21.4286C23.9533 10 26 12.0467 26 14.5714V21.4286C26 23.9533 23.9533 26 21.4286 26H14.5714C12.0467 26 10 23.9533 10 21.4286V14.5714C10 12.0467 12.0467 10 14.5714 10ZM18 21.4286C16.1065 21.4286 14.5714 19.8935 14.5714 18C14.5714 16.1065 16.1065 14.5714 18 14.5714C19.8935 14.5714 21.4286 16.1065 21.4286 18C21.4286 19.8935 19.8935 21.4286 18 21.4286Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="17.5" stroke={color} />
    </svg>
  );
};

export default Instagram;
