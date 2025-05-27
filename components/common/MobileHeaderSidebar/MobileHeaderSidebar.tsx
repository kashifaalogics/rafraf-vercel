import { Category } from "@common/types/category";
import { Cross } from "@components/icons";
import { Subtitle } from "@components/typography";
import { Accordion, Link } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { FunctionComponent } from "react";
import { LocaleNav, Usernav } from "..";
import SecondayMobileBurger from "assets/data/SecondaryNav.json";
import { useRouter } from "next/router";
import CarSelected from "@components/ui/CarSelected/CarSelected";

interface Props {
  categories: Category[] | any;
}

const MobileHeaderSidebar: FunctionComponent<Props> = ({ categories }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { closeSidebar } = useUI();
  return (
    <div
      className="w-full flex flex-col bg-white animate__animated animate__fadeInDown"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="flex justify-between items-center border-b-2">
        <div className="cursor-pointer p-4" onClick={closeSidebar}>
          <Cross />
        </div>
        <div>
          <LocaleNav />
        </div>
      </div>
      <CarSelected />
      <div>
        <Usernav platform="mobile" />
      </div>
      <Accordion label={t("common/navbar:allCategoriesTitle")}>
        {SecondayMobileBurger.map((c, i) => (
          <div key={i} className="p-5 cursor-pointer hover:bg-add-blue-op-20">
            <a
              href={router.locale === "ar" ? c.idar : c.iden}
              rel="noopener noreferrer"
            >
              <Subtitle>
                {router.locale === "ar" ? c.nameArabic : c.nameEng}
              </Subtitle>
            </a>
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default MobileHeaderSidebar;
