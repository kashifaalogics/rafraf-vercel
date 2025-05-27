import { useRouter } from "next/router";

const useLangDirection = () => {
  const router = useRouter();

  return {
    rtl: router.locale === "ar",
    ltr: router.locale !== "ar",
  };
};

export default useLangDirection;
