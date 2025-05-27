import { useRouter } from "next/router";
import { Link } from "@components/ui";
import { FunctionComponent } from "react";
import { A } from "@components/typography";

interface Props {}

const LocaleNav: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  
  return (
    <div className="flex mx-6">
      <Link prefetch={false} href={router.asPath} locale="en">
        <A
          className={`mx-3 ${
            router.locale === "en" ? "text-black" : "text-darkgrey"
          }`}
        >
          En
        </A>
      </Link>
      <div className="bg-grey block" style={{ width: "2px" }}></div>
      <Link prefetch={false} href={router.asPath} locale="ar">
        <A
          className={`mx-3 ${
            router.locale === "ar" ? "text-black" : "text-darkgrey"
          }`}
        >
          Ar
        </A>
      </Link>
    </div>
  );
};

export default LocaleNav;
