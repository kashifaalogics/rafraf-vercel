import {
  BASE_URL,
  MOYASAR_API,
  MOYASAR_CALLBACK_URL,
  MOYASAR_KEY,
} from "@framework/const";

interface Payment {
  amount: number;
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
  loggedIn: boolean;
  token?: string;
  cartId: string;
}

interface PaymentResponse {
  amount: number;
  amount_format: string;
  callback_url: string;
  captured: number;
  captured_at: string | null;
  captured_format: string;
  created_at: string;
  currency: string;
  description: string | null;
  fee: number;
  fee_format: string;
  id: string;
  invoice_id: string | null;
  ip: string | null;
  metadata: string | null;
  refunded: number;
  refunded_at: string | null;
  refunded_format: string;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    transaction_url: string;
  };
  company: string;
  gateway_id: string;
  message: string | null;
  name: string;
  number: string;
  reference_number: string | null;
  transaction_url: string;
  type: string;
  status: string;
  updated_at: string;
  voided_at: string | null;
}

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

const createPaymentCreditCard = async ({
  amount,
  month,
  cvc,
  name,
  number,
  year,
  loggedIn,
  token = "",
  cartId,
}: Payment): Promise<string> => {
  const callbackUrlPath =
    `${BASE_URL}/api/payment` +
    getCallbackUrlPath({
      loggedIn,
      token,
      cartId,
    });
  const key = Buffer.from(MOYASAR_KEY).toString("base64");

  const response = await fetch(`${MOYASAR_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${key}`,
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({
      amount: Math.floor(amount * 100),
      callback_url: `${callbackUrlPath}`,
      source: {
        type: "creditcard",
        name: name.toLocaleUpperCase(),
        number,
        cvc,
        month,
        year,
      },
    }),
  });

  const data: PaymentResponse = await response.json();
  console.log("data:", data)
  return data.transaction_url || data.source.transaction_url;
};

export default createPaymentCreditCard;
