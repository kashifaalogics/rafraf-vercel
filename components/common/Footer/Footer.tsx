import { Button, Container } from "@components/ui";
import { FunctionComponent } from "react";
import { Link } from "@components/ui";
import {
  Email,
  Facebook,
  Instagram,
  LiveChat,
  Phone,
  Twitter,
  Youtube,
} from "@components/icons";
import NextLink from "next/link";
import { Image } from "@components/ui";
import NeImage from "next/image";
import { A, H4, Label, P } from "@components/typography";
import useTranslation from "next-translate/useTranslation";
import Tiktok from "@components/icons/Tiktok";
import LinkedIn from "@components/icons/LinkedIn";
import Snapchat from "@components/icons/Snapchat";
import { Category } from "@common/types/category";
import { WHATSAPP_LINK } from "@framework/const";
import { useRouter } from "next/router";

const aramexImage = "/images/brands/aramex.svg";
const masterCardImage = "/images/brands/master-card.svg";
const applePayImage = "/images/brands/apple-pay.svg";
const madaImage = "/images/brands/mada.svg";
const moyassarImage = "/images/brands/moyassar.svg";
const visaImage = "/images/brands/visa.svg";
const appleStoreImage = "/images/app-stores/apple.svg";
const playStoreImage = "/images/app-stores/google.svg";

interface Props {
  categories: Category[];
}

export const Footer: FunctionComponent<Props> = ({ categories }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isCheckoutPage = router.pathname === "/checkout";

  return (
    <footer
      style={{
        position: isCheckoutPage ? "fixed" : "relative",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      {/* footer content */}
      <div className={`bg-light py-12 ${isCheckoutPage ? "hidden" : ""}`}>
        <Container>
          <div className="flex gap-8 md:gap-16 flex-col md:flex-row items-center md:items-start">
            {/* About Us Section */}
            <div style={{ maxWidth: "390px" }}>
              <H4 className="text-black py-6 flex justify-center md:justify-start">
                {t("common/footer:aboutUsSection.title")}
              </H4>
              <P className="subtitle text-blue text-center">
                {t("common/footer:aboutUsSection.text")}
              </P>
              <NextLink href="/السجل-التجاري.pdf" passHref>
                <A
                  className="subtitle text-blue block mb-4 font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("common/footer:informationSection.downloadContract")}
                </A>
              </NextLink>

              <div className="flex flex-col justify-center items-center mt-4">
                <div className="w-full max-w-xl mt-6">
                  <Label className="block mb-2">
                    {t("common/footer:aboutUsSection.subscribeLabel")}
                  </Label>
                  <div className="grid grid-cols-10 gap-2">
                    <input
                      className="col-span-7 p-1 rounded-md border-darkgrey h-11"
                      placeholder="legend@example.com"
                      type="email"
                      name=""
                      id=""
                    />
                    <Button
                      className="col-span-3 shadow-none"
                      style={{ backgroundColor: "#1D4ED8" }}
                    >
                      {t("common/footer:aboutUsSection.subscribeAction")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <NeImage
                    src={visaImage}
                    alt="visa"
                    loading="lazy"
                    quality={20}
                    width="1024"
                    height="314"
                  />
                </div>
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <NeImage
                    src={masterCardImage}
                    alt="master card"
                    loading="lazy"
                    width="1024"
                    height="314"
                  />
                </div>
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <NeImage
                    src={applePayImage}
                    alt="apple pay"
                    loading="lazy"
                    width="1024"
                    height="314"
                  />
                </div>
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <NeImage
                    src={aramexImage}
                    alt="aramex"
                    loading="lazy"
                    width="1024"
                    height="314"
                  />
                </div>
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <NeImage
                    src={madaImage}
                    alt="mada"
                    loading="lazy"
                    width="1024"
                    height="314"
                  />
                </div>
                <div className="relative h-8 w-16 p-1 bg-blue-grey rounded flex justify-center items-center shadow">
                  <A target="_blank" href="https://maroof.sa/74275">
                    <NeImage
                      src={moyassarImage}
                      alt="maroof"
                      loading="lazy"
                      width="1024"
                      height="314"
                    />
                  </A>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
              <H4 className="text-black py-6">
                {t("common/footer:informationSection.title")}
              </H4>
              <Link prefetch={false} href="/aboutus">
                <A className="subtitle text-blue block mb-4">
                  {t("common/footer:informationSection.whoWeAre")}
                </A>
              </Link>
              <Link prefetch={false} href="/blog">
                <A className="subtitle text-blue block mb-4">
                  {t("common/footer:informationSection.blog")}
                </A>
              </Link>
              <Link prefetch={false} href="/shipping">
                <A className="subtitle text-blue block mb-4">
                  {t("common/footer:informationSection.shipping&Payment")}
                </A>
              </Link>
              <Link prefetch={false} href="/warrenty">
                <A className="subtitle text-blue block mb-4">
                  {t("common/footer:informationSection.warrenty&Returns")}
                </A>
              </Link>
              <Link prefetch={false} href="/privacy-policy">
                <A className="subtitle text-blue block mb-4">
                  {t("common/footer:informationSection.privacyPolicy")}
                </A>
              </Link>
            </div>

            {/* Categories Section */}
            <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
              <H4 className="text-black py-6">
                {t("common/footer:categoriesSection.title")}
              </H4>
              {categories?.map((c, i) => (
                <Link
                  prefetch={false}
                  key={i}
                  href={`/parts/${c.id}`}
                  rel="canonical"
                >
                  <A className="subtitle text-blue block">{c.name}</A>
                </Link>
              )) || ""}
            </div>

            {/* Contacts Section */}
            <div className="flex-1">
              <H4 className="text-black py-6 flex items-start justify-center md:items-start md:justify-start">
                {t("common/footer:contactsSection.title")}
              </H4>
              <div className="flex items-start justify-center md:items-start md:justify-start">
                <Email />
                <A
                  target="_blank"
                  href="mailto: info@rafraf.com"
                  className="subtitle text-blue block mb-4 mx-2"
                >
                  info@rafraf.com
                </A>
              </div>

              <div className="flex items-start justify-center md:items-start md:justify-start">
                <Phone />
                <A
                  target="_blank"
                  href="tel: +966536722255"
                  className="subtitle text-blue block mb-4 mx-2"
                  dir="ltr"
                >
                  (واتساب فقط) +966 53 672 2255
                </A>
              </div>

              <div className="flex flex-wrap overflow-x-hidden w-56 mx-auto items-start justify-center md:items-start md:justify-start">
                <A
                  target="_blank"
                  href="https://www.facebook.com/Rafrafsaudi/"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-blue-op-30"
                >
                  <Facebook />
                </A>
                <A
                  target="_blank"
                  href="https://www.youtube.com/channel/UCDoN5wHMsWCeKijnlhnzHxA"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-red-op-30"
                >
                  <Youtube />
                </A>
                <A
                  target="_blank"
                  href="https://www.instagram.com/rafrafsa"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-yellow-op-30"
                >
                  <Instagram />
                </A>
                <A
                  target="_blank"
                  href="https://twitter.com/RafrafSA"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-add-blue-op-30"
                >
                  <Twitter />
                </A>

                <A
                  target="_blank"
                  href="https://www.tiktok.com/@rafrafsa"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-darkgrey-op-30"
                >
                  <Tiktok />
                </A>

                <A
                  target="_blank"
                  href="https://www.linkedin.com/company/rafrafsa/about/"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-blue-op-30"
                >
                  <LinkedIn />
                </A>

                <A
                  target="_blank"
                  href="https://www.snapchat.com/add/rafraf.sa"
                  className="transition rounded-full subtitle text-blue block mb-4 mx-2 hover:bg-yellow-op-30"
                >
                  <Snapchat />
                </A>
              </div>

              <div className="flex items-start justify-center md:items-start md:justify-start">
                <A
                  target="_blank"
                  href="https://apps.apple.com/sa/app/rafraf-for-cars-parts/id1504242621#?platform=iphone"
                >
                  <div className="relative h-10 w-32">
                    <Image src={appleStoreImage} alt="apple app store" />
                  </div>
                </A>
                <A
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.rafraf.store&hl=ar"
                >
                  <div className="relative h-10 w-32">
                    <Image src={playStoreImage} alt="google play store" />
                  </div>
                </A>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* copy rights */}
      <div className="bg-light-blue py-2 text-center text-blue px-3">
        {t("common/footer:copyRight", { date: new Date().getFullYear() })}
      </div>
    </footer>
  );
};

export default Footer;
