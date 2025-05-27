import staticCategoriesAr from "@assets/data/staticCategoriesAr.json";
import staticCategoriesEn from "@assets/data/staticCategoriesEn.json";


type Props = {
    locale: string;
}

function getStaticCategories({ locale }: Props) {
    if (locale === 'ar'){
        return staticCategoriesAr
    }
  return staticCategoriesEn
}

export default getStaticCategories