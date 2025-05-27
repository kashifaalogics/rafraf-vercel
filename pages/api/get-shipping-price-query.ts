import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const cart = req.query.cart
    const city = req.query.city

    const url = `https://api.rafraf.com/ar/rest/ar/V1/guest-carts/${cart}/estimate-shipping-methods`

    const response = await fetch(url, {
        headers: {
            "content-type": "application/json"
        },
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
  });

    const data = await response.json()
    res.status(200).json({ response: data })
}