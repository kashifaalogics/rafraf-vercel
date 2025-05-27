type Props = {
    router: string;
}

function getSource({ router }: Props) {
    if (router.includes("search")){
        return "search"
    }
    else if (router === '/'){
        return "homepage"
    }
    else if (router.includes("cars")){
        return "car_selection"
    }
    else if (router.includes("product")){
        return "product_view"
    }
    else if (router.includes("parts")){
        return "categories"
    }

    return ""
}

export default getSource