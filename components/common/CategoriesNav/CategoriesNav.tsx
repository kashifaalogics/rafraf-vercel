import { FunctionComponent, useRef } from "react";
import { Link } from "@components/ui";
import { Button, Container, HScrollable } from "@components/ui";
import { Subtitle } from "@components/typography";
import { Arrow } from "@components/icons";
import { colors } from "../../../theme/themeColors.config";
import useTranslation from "next-translate/useTranslation";
import useLangDirection from "@utils/language/useLangDirection";
import { Category } from "@common/types/category";
import { useSearchEngine } from "@common/hooks";
import { useRouter } from "next/router";
import Cat from "assets/data/SecondaryNav.json";

interface Props {
  categories: Category[] | any;
}
const CategoriesNav: FunctionComponent<Props> = ({ categories }) => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const scrollRef = useRef<HTMLUListElement>(null);
  const { recordAPI } = useSearchEngine();
  const router = useRouter();

  return (
    <nav
      className={`bg-blue-800 hidden mt-6 ${
        router.asPath === "/checkout" ? "hidden" : "md:block"
      }`}
      style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)" }}
    >
      <Container>
        <div className="flex bg-blue-800">
          <HScrollable className="h-12" ref={scrollRef}>
            {Cat.map((c, i) => (
              
              <li
                key={i}
                className="text-white h-full flex justify-center items-center px-9 hover:bg-white hover:text-black cursor-pointer"
                // onClick={() => recordAPI({behaviour: "on_category", source: "navbar"})}
              >
                <a href={router.locale === "ar" ? c.idar : c.iden}  rel="noopener noreferrer">
                  <Subtitle>
                    {router.locale === "ar" ? c.nameArabic : c.nameEng || c.iden}
                  </Subtitle>
                </a>
              </li>
            ))}
          </HScrollable>
        <Button
            style={{ marginLeft: "3px" }}
            className="shadow-none px-2 bg-blue-800"
            onClick={() => {
              if (!scrollRef?.current) return;
              const scrollAmount = 200 * (dir.rtl ? 1 : -1);
              scrollRef.current.scrollLeft += scrollAmount;
            }}
          >
            <Arrow
              color={colors.white}
              direction={dir.rtl ? "right" : "left"}
            />
          </Button>

          <Button
            className="shadow-none px-2 bg-blue-800"
            onClick={() => {
              if (!scrollRef?.current) return;
              const scrollAmount = 200 * (dir.rtl ? -1 : 1);
              scrollRef.current.scrollLeft += scrollAmount;
            }}
          >
            <Arrow
              color={colors.white}
              direction={dir.rtl ? "left" : "right"}
            />
          </Button>
        </div>
      </Container>
    </nav>
  );
};

export default CategoriesNav;
