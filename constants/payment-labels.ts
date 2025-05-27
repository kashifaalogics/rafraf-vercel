export default function PaymentLabels(dir: boolean, label:string) {
  if (dir) {
    // Arabic content
    if (label === "moyasar_credit_card")
      return "مدى, فيزا, ماستر كارد"

    else if (label === "moyasar_apple_pay")
      return "آبل باي"

    else if (label == "cashondelivery")
      return "الدفع عند الإستلام"

    else if(label == "checkmo")
    return "تقسيط"

  }
  else {
    if (label === "moyasar_credit_card")
      return "Credit Card: Mada, Visa, MasterCard"

    else if (label === "moyasar_apple_pay")
      return "Apple pay"

    else if (label == "cashondelivery")
      return "Cash On Delivery"

      else if(label == "checkmo")
      return "Installment"
  }

  return "تقسيط"
}