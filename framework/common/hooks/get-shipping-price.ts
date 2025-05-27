import { useState, useEffect } from 'react'

interface Props {
    city: string,
    cart: any
}


function getShippingPrice({city, cart}: Props) {

    const [data, setData] = useState([])

    const [title, setTitle] = useState("")
    const [price, setPrice] = useState(0)
    const [loading, setLoading] = useState(false)

    async function callShippingPrice() {
        
        if(!cart || !cart.length) return

        setLoading(true)
        const URL = `/api/get-shipping-price-query?cart=${cart}&city=${city}`
        const res = await fetch(URL, {
            method: "POST",
            body: JSON.stringify({
                address: {
                    street: [],
                    city: city,
                    region: "",
                    country_id: "SA",
                    postcode: null,
                    firstname: "",
                    lastname: "",
                    telephone: ""
                }
            })
    
        })
        const data = await res.json() 
        const info = data.response[0]
        setLoading(false)

        if(data.response) {
            setData(data.response)
        }

        if(info) {
            setTitle(info.method_title + " " + info.carrier_title)
            setPrice(info.amount)
        }
    }
    // method_title
    
    useEffect(() => {
        callShippingPrice()
    }, [city, cart])
    
  
    return {
        data: data,
        price: price,
        title: title,
        loading: loading
    }
}

export default getShippingPrice