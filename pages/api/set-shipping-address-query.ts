import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const cart = req.query.cart
    const city = req.query.city

    const url = `https://api.rafraf.com/ar/rest/ar/V1/carts/mine/shipping-information`

    const response = await fetch(url, {
        headers: {
            "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "addressInformation": {
                "shipping_address": {
                    "customerAddressId": "3272",
                    "countryId": "SA",
                    "regionCode": null,
                    "region": null,
                    "customerId": "4625",
                    "street": [
                        "aaa"
                    ],
                    "company": null,
                    "telephone": "0555555555",
                    "fax": null,
                    "postcode": "null",
                    "city": "Jeddah",
                    "firstname": "aaa",
                    "lastname": "aaa",
                    "middlename": null,
                    "prefix": null,
                    "suffix": null,
                    "vatId": null,
                    "customAttributes": []
                },
                "billing_address": {
                    "customerAddressId": "2867",
                    "countryId": "SA",
                    "regionCode": null,
                    "region": null,
                    "customerId": "4625",
                    "street": [
                        "Jeddah"
                    ],
                    "company": null,
                    "telephone": "0532450689",
                    "fax": null,
                    "postcode": null,
                    "city": "Jeddah",
                    "firstname": "Abdulghani",
                    "lastname": "Harran",
                    "middlename": null,
                    "prefix": null,
                    "suffix": null,
                    "vatId": null,
                    "customAttributes": []
                },
                "shipping_method_code": "flatrate",
                "shipping_carrier_code": "flatrate"
            }
        })
  });

    const data = await response.json()
    res.status(200).json({ response: data })
}