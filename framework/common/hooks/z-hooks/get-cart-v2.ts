import { useEffect, useState } from 'react'
import { API_URL } from '@framework/const'
import { handleSuccess } from "@common/utils/handlers";
import { useApiConfig, useEffectV2 } from ".."; 
import { Dispatch } from "@common/store";
import { useDispatch } from "react-redux";
import { removeItemFromCartMutation } from '@framework/utils/graphql';
import { useStore } from '@common/state';


function getCart(itemID?: any) {
    
    const [data, setData] = useState() as any
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    
    const apiConfig = useApiConfig();
    const dispatch = useDispatch<Dispatch>();

    const {
        setCartCount,
        setGrandTotal,
        toggleCartCall
      } = useStore();


    useEffect(() => {
        callGetCart()
    }, [toggleCartCall])

    useEffectV2(() => {
        console.log("cart mounted")
        if(!data || !data.cart) return

        const token = localStorage.getItem("TOKEN") || ""
        const cartID = localStorage.getItem("CART_ID") || ""

        const something = {cart: {
            ...data.cart,
            items: []
        }}
        
        

        callRemoveItem(token, cartID, itemID)
        
    }, [itemID])

    const callRemoveItem = async (token: string, cartID: string, itemID: number) => {
        const removeRes = await removeItemQuery(token, cartID, itemID)

        setLoading(true)
        const cartRes = await getCartRequest(token, cartID)
        const cartData = await cartRes.json()

        const sumAmountArray = cartData.data.cart.items.map((item: any) => item.quantity)
        const sumAmount = sumAmountArray.reduce((partialSum: any, a: any) => partialSum + a, 0);
        setGrandTotal(cartData.data.cart.prices.subtotal_including_tax.value)
        setCartCount(sumAmount)
        setData(cartData.data)
        setLoading(false)
    }

    const callGetCart = async () => {

        const prevCartID = JSON.parse(localStorage.getItem("CART_STATE") || `{"cartId": ""}`).cartId
        const token = localStorage.getItem("TOKEN")
        const stateCartID = localStorage.getItem("CART_ID")
    
        setLoading(true)

        let cartId = ""
        if(stateCartID) {
            cartId = stateCartID
        } else {
            localStorage.setItem("CART_ID", prevCartID)
            cartId = prevCartID
        }

        const res = await getCartRequest(token || "", cartId)

        const data = await res.json()
        if(data.errors) {
            if(
                data.errors[0].message.includes("Could not find a cart with ID") ||
                data.errors[0].message.includes("The current user cannot perform operations on cart")
            ) {
                console.log("data.errors:", data.errors)
                handleSuccess("sessionExpired", apiConfig.locale);
                dispatch.customer.resetCustomer()
                dispatch.cart.reset()
                localStorage.removeItem("CART_ID")
                localStorage.removeItem("TOKEN")
                window.location.href = `/${apiConfig.locale}/cart?modal=login`
            }

            // raise toast

            setError(true)
        }
        
        setGrandTotal(data.data?.cart?.prices.subtotal_including_tax.value)
        setData(data.data)
        
        // POST
        // setData

        setLoading(false)
    }

    return {
        cartItemsV8: data,
        loading: loading,
        error: error,
    }
}

export default getCart


const getCartRequest = (token: string, cartID: string) => {
    const requestBody = {
        query: `query Cart($cartId: String!) { 
            cart(cart_id: $cartId) { 
                items { 
                    quantity 
                    id 
                    product { 
                        id 
                        url_key 
                        name 
                        sku 
                        image { 
                            url 
                            label 
                        } 
                        price_range { 
                            maximum_price { 
                                regular_price { 
                                    currency 
                                    value 
                                } 
                                final_price { 
                                    currency 
                                    value 
                                } 
                            } 
                        } 
                        ... on ConfigurableProduct { 
                            variants { 
                                attributes { 
                                    code 
                                    uid 
                                    value_index 
                                    label 
                                } 
                            } 
                        } 
                    } 
                } 
                available_payment_methods { 
                    title 
                    code 
                } 
                prices { 
                    grand_total { 
                        currency 
                        value 
                    } 
                    subtotal_including_tax { 
                        currency 
                        value 
                    } 
                    subtotal_excluding_tax { 
                        currency 
                        value 
                    } 
                } 
                total_quantity 
            } 
        }`,
        variables: {
            cartId: cartID
        }
    };

    return fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : ""
        }
    });
}

const removeItemQuery = (token: string, cartID: string, itemID: number) => {
    return fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({
            query: removeItemFromCartMutation,
            variables: {
                cartItemId: itemID,
                cartId: cartID
            }
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}`: ""
        }
    })
}

const getCartQuery = `
query Cart($cartId: String!) {
    cart(cart_id: $cartId) {
        items {
            quantity
            id
            product {
                id
                url_key
                name
                sku
                image {
                    url
                    label
                }
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            currency
                            value
                        }
                    }
                }
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            code
                            uid
                            value_index
                            label
                        }
                    }
                }
            }
    
        }
        available_payment_methods {
            title
            code
        }
        prices {
            grand_total {
                currency
                value
            }
            subtotal_excluding_tax {
                currency
                value
            }
        }
        total_quantity
    }
}

`