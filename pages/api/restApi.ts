import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = JSON.parse(req.body).token
    const response = await fetch("https://api.rafraf.com/rest/V1/orders/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    const data = await response.json()
    res.status(200).json({ response: data })
}