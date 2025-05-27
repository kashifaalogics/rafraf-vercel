import { getAnalyticsId, getCookieData, getCustomerData } from "framework/analytics";


async function recordAPI(r: any) {
    console.log(r)
    try {
        const action_id = getAnalyticsId({behaviour: r.behaviour, source: r.source})
  
        const [userId, sessionId, sessionIndex] = getCookieData()
        const [cart_id, email, name, platform] = getCustomerData()
    
  
        // Insert Product
        if (r.product !== '' && r.product) {
          console.log("product:", r.product)
        try {
          const res = await fetch(`https://pythondata.rafraf.com/i_p`, {
            method: "POST",
            body: JSON.stringify({
              sid: sessionId,
              sindex: sessionIndex,
              a: action_id,
              sku: r.product,
              ts: Date.now(),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        catch (error) {
          // console.log(error)
        }
      }
        // Insert Session
        try {
          const res = await fetch(`https://pythondata.rafraf.com/i_s`, {
            method: "POST",
            body: JSON.stringify({
              uid: userId,
              sid: sessionId,
              sindex: sessionIndex,
              a: action_id,
              ts: Date.now(),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        catch (error) {
          // console.log(error)
        }
  
        // Insert User
        try {
          const res = await fetch(`https://pythondata.rafraf.com/i_u`, {
            method: "POST",
            body: JSON.stringify({
              uid: userId,
              cid: cart_id,
              e: email,
              n: name,
              plt: platform
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        catch (error) {
          // console.log(error)
        }
          
      }
      catch (e) {
        // console.log(e)
      }
  
}

export default recordAPI