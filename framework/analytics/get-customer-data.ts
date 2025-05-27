
function getCustomerData() {
    const cart = JSON.parse(localStorage.getItem("CART_STATE") || "cart_not_found")
    const customerState = JSON.parse(localStorage.getItem("CUSTOMER_STATE") || "customer_not_found")
    const platform = JSON.parse(sessionStorage.getItem("tt_appInfo") || "").platform

    let cart_id = "";
    let email = ''
    let name = ''

    if (cart !== "cart_not_found" || cart !== undefined) {
        cart_id = cart?.cartId;
    }
    else {
        cart_id = "cart_not_found";
    }

    
    if (customerState !== "customer_not_found" || customerState !== null){
        name = `${customerState.customer?.firstname || "name not"} ${customerState.customer?.lastname || "found"}`
        email = customerState.customer?.email || "email not found";
    }
    else {
        email = "email_not_found"
        name = "name_not_found"
    }
    return [cart_id, email, name, platform]
}

export default getCustomerData