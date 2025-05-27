import toast from "react-hot-toast";
import { colors } from "theme/themeColors.config";

export const rafrafToast = (message: string) =>
  toast(message, {
    position: "bottom-center",
    style: { backgroundColor: colors.blue, color: colors.white },
  });
