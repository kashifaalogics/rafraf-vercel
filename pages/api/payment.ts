import { MOYASAR_CALLBACK_URL } from "@framework/const";
import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const magentoCallUrl = MOYASAR_CALLBACK_URL + "?" + new URLSearchParams(req.query as any).toString();
    // console.log("----")
    // console.log("magentoCallUrl:", magentoCallUrl)
    // console.log("----")

    const response = await fetch(magentoCallUrl);
    const html = await response.text();
    // console.log("----")
    // console.log("html:", html)
    // console.log("----")

    const $ = cheerio.load(html);
    const url = $("#theUrl").text();

    console.log("debug payment 1:", url)

    if (url !== "") {
        res.redirect(url);
    }
    else {
        let start = html.indexOf("window.location.href")
        let end = html.indexOf('&" ;', start)
        const fullUrl = html.slice(start, end)
    
        start = fullUrl.indexOf("?finished")
        end = fullUrl.length
        let redircetUrl = fullUrl.slice(start, end)
        redircetUrl = "https://rafraf.com/ar/checkout/result".concat(redircetUrl)
    
        console.log("----")
        console.log("redircetUrl 2:", redircetUrl)
        console.log("----")
    
        res.redirect(redircetUrl);
    }

}
