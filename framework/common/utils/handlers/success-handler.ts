import successAr from "@assets/success-messages/ar.json";
import successEn from "@assets/success-messages/en.json";
import toast from "react-hot-toast";
import { colors } from "theme/themeColors.config";

const messages: any = {
  ar: successAr,
  en: successEn,
};

const events = ["login", "logout", "couponApplied", "couponRemoved", "couponeIsntValid", "sessionExpired"];

export const handleSuccess = (message: string, locale?: string) => {
  let finalMessage = "";
  if (events.includes(message)) {
    try {
      let finalLocale = locale || "";
      if (!locale) {
        finalLocale = window.location.pathname.includes("ar") ? "ar" : "en";
      }
      finalMessage = messages[finalLocale][message];
    } catch (e) {
      finalMessage = message;
    }
  }
  toast(finalMessage, {
    position: "bottom-center",
    style: { backgroundColor: colors["add-blue"], color: colors.white },
  });
};
