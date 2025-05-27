type Props = {
    behaviour: string;
    source: string;
}

function getAnalyticsId({ behaviour, source }: Props) {

    const id = behaviour + source
    switch(id){
        case "add_to_cartsearch":
            return 27
        case "add_to_cartcategories":
            return 29
        case "add_to_cartcar_selection":
            return 28
        case "add_to_carthomepage":
            return 26
        case "add_to_cartproduct_view":
            return 30
    
        case "buy_nowsearch":
            return 32
        case "buy_nowcategories":
            return 34
        case "buy_nowcar_selection":
            return 33
        case "buy_nowhomepage":
            return 31
        case "buy_nowproduct_view":
            return 35
    
        case "on_productsearch":
            return 37
        case "on_productcategories":
            return 39
        case "on_productcar_selection":
            return 38
        case "on_producthomepage":
            return 36         
        case "on_productproduct_view":
            return 40
    
        case "on_cartnavbar":
            return 46

        case "whatsappnavbar":
            return 41
        case "whatsapphomepage":
            return 42
        case "whatsappproduct_view":
            return 43
    
        case "on_categorynavbar":
            return 45
        case "on_categoryhomepage":
            return 44

        case "paycheckout":
            return 48

        case "saveinfocheckout":
            return 49

        case "searchquerynavbar":
            return 47

        case "car_selectionhomepage":
            return 50

        case "dropdownsearchnavbar":
            return 52
        case "onmakerhomepage":
            return 54

        case "viewedproductproduct_view":
            return 56
        case "viewedproductlistingcategories":
            return 57
        case "viewedproductlistingcar_selection":
            return 58
        case "pageviewhomepage":
            return 59
                                                      
    }

    return 0
}

export default getAnalyticsId