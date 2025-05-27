import {
    BASE_URL,
    MOYASAR_API,
    MOYASAR_CALLBACK_URL,
    MOYASAR_KEY,
}   from "@framework/const";

const getCallbackUrlPath = ({
loggedIn,
token,
cartId,
locale = "ar",
}: {
loggedIn: boolean;
token: string;
cartId: string;
locale?: string;
}) => {
const common = `platform=web&callback=${BASE_URL}/${locale}/checkout/result`;
if (loggedIn) {
    return `?CartID=${cartId}&token=${token}&${common}`;
} else {
    return `?quoteID=${cartId}&${common}`;
}
};


const createPaymentApplePay = async ({
amount,
loggedIn,
token = "",
cartId,
}: any) => {
    const callbackUrlPath =
        `${BASE_URL}/api/payment` +
        getCallbackUrlPath({
        loggedIn,
        token,
        cartId,
        });
    const key = Buffer.from(MOYASAR_KEY).toString("base64");

    const request = {
        currencyCode: 'SAR',
        countryCode: 'SA',
        supportedCountries: ['SA'],
        total: { label: "Rafraf autoparts", amount: amount },
        supportedNetworks: ['masterCard', 'visa', 'mada'],
        merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit']
    };

    const session = new window.ApplePaySession(6, request);

    session.onvalidatemerchant = (event: any) => {
        const merchantBackendUrl = 'https://api.moyasar.com/v1/applepay/initiate';
        const body = {
            "validation_url": event.validationURL,
            "display_name": "rafraf.com",
            "domain_name": "rafraf.com",
            "publishable_api_key": MOYASAR_KEY
        };
        const headers = {
            'Content-Type': 'application/json'
        }

        const validatePayment = async () => {
            try {
                const response = await fetch(merchantBackendUrl ,{
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: headers
                })
        
                const data = await response.json()
                session.completeMerchantValidation(data)
            }
            catch(error) {
                console.error(error)
            }
        }
        validatePayment();
    };

    session.onpaymentauthorized = (event: any) => {
        const token = event.payment.token;
        const key = Buffer.from(MOYASAR_KEY).toString("base64");

        const getCallbackUrlPath = ({
            loggedIn,
            token,
            cartId,
            locale = "ar",
        }: {
            loggedIn: boolean;
            token: string;
            cartId: string;
            locale?: string;
        }) => {
            const common = `platform=web&callback=${BASE_URL}/${locale}/checkout/result`;
            if (loggedIn) {
            return `?CartID=${cartId}&token=${token}&${common}`;
            } else {
            return `?quoteID=${cartId}&${common}`;
            }
        };

        const callbackUrlPath =
        `${BASE_URL}/api/payment` +
        getCallbackUrlPath({
        loggedIn,
        token,
        cartId,
        });
        const body = {
        'amount': amount, // 100 Halalas == 1.00 SAR
        'description': 'Rafraf Store',
        'publishable_api_key': MOYASAR_KEY,
        'callback_url': `${callbackUrlPath}`,
        'source': {
            'type': 'applepay',
            'token': token
        }
        };
        const headers = {
            "Content-Type": 'application/json',
            "Authorization": `Basic ${key}`
        }
    
        const authorizPayment = async () => {
            try {
                const response = await fetch(`${MOYASAR_API}/payments`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body)
                })
    
                const payment = await response.json();
    
                if (payment.status != 'paid' || !payment.id) {
                    session.completePayment({
                        status: window.ApplePaySession.STATUS_FAILURE,
                        errors: [
                            payment.source.message
                        ]
                    });
                    return payment.transaction_url || payment.source.transaction_url;
                }
    
                if (payment.status === "paid") {
                    session.completePayment({
                        status: window.ApplePaySession.STATUS_SUCCESS
                    });
                    return payment.transaction_url || payment.source.transaction_url;
                }
            }
            
            catch(error) {
                session.completePayment({
                    status: window.ApplePaySession.STATUS_FAILURE,
                    errors: [
                        error
                    ]
                });
                return "";
            }
        }
        authorizPayment()
    };
    
    session.begin();
    return ""
};

export default createPaymentApplePay;