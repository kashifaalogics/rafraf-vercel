import { useAuth } from "@common/hooks";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { H2, H6 } from "@components/typography";
import { Button, Input } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";

interface Props {}

const ResetPasswordForm: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const router = useRouter();




  return (
    <>
    <div className="wishlist_head mb-8">
      <H2>My Wish List </H2>
    </div>
    <div className="wishlist_noItemFound text-center bg-gray-300 py-3">
      <h6 className="text-sm font-bold">YOU HAVE NO ITEMS IN YOUR WISH LIST.</h6>
    </div>

    </>
  );
};

export default ResetPasswordForm;
