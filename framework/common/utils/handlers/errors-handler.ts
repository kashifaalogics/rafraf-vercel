import errorsAr from "@assets/error-messages/ar.json";
import errorsEn from "@assets/error-messages/en.json";
import toast from "react-hot-toast";
import { colors } from "theme/themeColors.config";

export type GraphqlError = {
  path: string[];
  message: string;
};

const errorsMsgs: any = {
  ar: errorsAr as any,
  en: errorsEn as any,
};

export const handleError = (errors: GraphqlError[], locale?: string) => {
  errors?.forEach((e) => {
    let message: string;
    try {
      let finalLocale = locale || "";
      if (!locale) {
        finalLocale = window.location.pathname.includes("ar") ? "ar" : "en";
      }
      message = errorsMsgs[finalLocale][e.path[0]];
    } catch (exp) {
      message = e?.message;
    }
    toast(message || "خطأ", {
      style: { backgroundColor: colors.red, color: colors.white },
      position: "bottom-center",
    });
  });
  throw new Error("error");
};
