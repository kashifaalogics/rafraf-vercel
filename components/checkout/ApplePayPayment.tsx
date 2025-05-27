import { useState } from "react";
import { ApplePayAvalible } from "@common/utils/validation";
import { useCartItems, useApiConfig } from "@common/hooks";
import useTranslation from "next-translate/useTranslation";
import { MOYASAR_KEY } from "@framework/const";
import { useUI } from "@components/ui/constext";
import { SelectShippingMethod } from ".";
import { createOrder, createApplepayOrder } from "@framework/orders";
import { useRouter } from "next/router";
  
interface Props {
    loggedIn: boolean;
    validShippingForm: boolean;
    city: string;
    firstname: string;
    lastname: string;
    street: string;
    telephone: string;
    guestEmail: string;
}

function ApplePayPayment({loggedIn, validShippingForm, city, firstname, lastname, street, telephone, guestEmail}: Props) {

  const apiConfig = useApiConfig();
  const applePayAvailable = ApplePayAvalible()

  const { openModal } = useUI();
  const { t } = useTranslation();
  const { locale, ...router } = useRouter();
  const { cart, address, setShippingAddressOnCart, setGuestEmailOnCart} = useCartItems();

  const [requiredFeilds, setRequiredFeilds] = useState(false);
    // Send the purchase event to Google Analytics 4
 


  return (
    <div>
        {applePayAvailable? <></> : <div className="font-bold" style={{	color: "rgb(239 68 68)"}}>{t("checkout:apple_pay_error")}</div>}
        {requiredFeilds && <div className="font-bold" style={{	color: "rgb(239 68 68)"}}>{t("checkout:required_fields")}</div>}
        <button
            // create-apple-pay-payment
            onClick={ () => {
            if (!validShippingForm) {
                setRequiredFeilds(true)
                return
            };
            setRequiredFeilds(false)
            if(!applePayAvailable) return
            
            const amount = cart.prices?.grandTotal?.value;
            const request = {
                currencyCode: 'SAR',
                countryCode: 'SA',
                supportedCountries: ['SA'],
                total: { label: "Rafraf Co", amount: amount },
                supportedNetworks: ['masterCard', 'visa', 'mada'],
                merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit']
            };
            
            const session = new window.ApplePaySession(6, request);
            
            session.onvalidatemerchant = (event: any) => {
            
            let merchantBackendUrl = 'https://api.moyasar.com/v1/applepay/initiate';
                let body = {
                    "validation_url": event.validationURL,
                    "display_name": "rafraf.com",
                    "domain_name": "rafraf.com",
                    "publishable_api_key": "pk_live_gaX1rKSpFrQMYH2pMWTLnZVxirwjCj9TbRx8p9VK"
                };
                
                fetch(merchantBackendUrl, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' },
                },)
                .then(response => response.json())
                .then(merchantSession => session.completeMerchantValidation(merchantSession))
                .catch(error => console.log(error)); // We need to handle the error instead of just logging it to console.

            };

            session.onpaymentauthorized = (event: any) => {
            const appleToken = event.payment.token;
            const key = Buffer.from(MOYASAR_KEY).toString("base64");
            const SaveUserInfo = async () => {
                const promises = [];
                const p1 = setShippingAddressOnCart({
                city,
                country_code: "SA",
                firstname,
                lastname,
                street,
                telephone,
                });
                promises.push(p1);
                if (!loggedIn) {
                const p2 = setGuestEmailOnCart(guestEmail);
                promises.push(p2);
                }
                const _ = await Promise.all(promises);
            
                if (!address?.selectedShippingMethod) {
                openModal(<SelectShippingMethod />);
                }                          
            }
            SaveUserInfo()

            const cartId = cart.id;

            if (!cartId || !amount) {
                session.completePayment({
                status: window.ApplePaySession.STATUS_FAILURE,
                errors: [
                    "Cart id not found"
                ]
            });
                return
            };
            
            let body = {
                amount: Math.floor(amount * 100),
                description: 'Rafraf Store',
                publishable_api_key: 'pk_live_gaX1rKSpFrQMYH2pMWTLnZVxirwjCj9TbRx8p9VK',
                source: {
                    type: 'applepay',
                    token: appleToken
                }
            };
            
            fetch('https://api.moyasar.com/v1/payments', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 
                'Content-Type': 'application/json',
                Authorization: `Basic ${key}`
                },
            })
            .then(response => response.json())
            .then ( async (payment) => {
                if (!payment.id) {
                    // handle validation or API authorization error
                }
        
                if (payment.status != 'paid') {
                    session.completePayment({
                        status: window.ApplePaySession.STATUS_FAILURE,
                        errors: [
                            payment.source.message
                        ]
                    });
        
                    return;
                }

                // Will save payment to your backend and complete your business logic with OrderID
                const cartId = cart.id;
                const orderNumber = await createOrder(apiConfig, {"cart_id": cartId})
                const paymentId = payment.id
                const res = await createApplepayOrder(apiConfig, {"paymentid": paymentId, "orderid": orderNumber})

                session.completePayment({
                    status: window.ApplePaySession.STATUS_SUCCESS
                });
                if (res != "failed") {
                    gtag("event", "purchase", 
                    {
                      transaction_id: router.query.orderId,
                      value: cart.prices?.grandTotal?.value.toFixed(2),
                      tax:  ((cart.prices?.subtotalIncludingTax?.value || 0) - (cart.prices?.subtotalExcludingTax?.value || 0)).toFixed(2),
                      shipping: address?.selectedShippingMethod?.amount?.value.toFixed(0),
                      currency: "SAR",
                      item_id: cart.items?.[0].product.id,
                      coupon: cart.appliedCoupons,
                      items: [
                        {
                          item_id: cart.items?.[0].product.sku,
                          item_name: cart.items?.[0].product.name,
                          value: cart.prices?.grandTotal?.value.toFixed(2),
                          tax:  ((cart.prices?.subtotalIncludingTax?.value || 0) - (cart.prices?.subtotalExcludingTax?.value || 0)).toFixed(2),
                          shipping: address?.selectedShippingMethod?.amount?.value.toFixed(2),
                          currency: "SAR",
                          coupon: cart.appliedCoupons,
                          price: cart.prices?.grandTotal?.value.toFixed(0),
                          quantity: 1
                        }]
                    }
                  
                );
                
                const url = `https://rafraf.com/ar/checkout/result?finished=true&status=paid&message=APPROVED&incrementOrderID=${orderNumber}`
                router.push(url)
                }
            })
            .catch(error => {
                session.completePayment({
                    status: window.ApplePaySession.STATUS_FAILURE,
                    errors: [
                        error.toString()
                    ]
                });
            });
        };
            
            session.begin();
            }}
            className={`col-span-3 w-full py-4 bg-black rounded flex justify-center items-center border-2 border-black text-white ${applePayAvailable? "" : "cursor-not-allowed"}`}
            type="submit"
        >
            <span className="font-bold">Pay</span>
            <img src="../images/brands/white-apple-pay.png" width={20} alt="" />
        </button>
    </div>
  )
}

export default ApplePayPayment