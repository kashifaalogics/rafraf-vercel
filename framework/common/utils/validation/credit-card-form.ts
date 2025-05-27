import {useState, useEffect} from 'react'
import {
    isValidCreditCardNumber,
    isValidCvv,
    isValidMonth,
    isValidYear,
  } from "@common/utils/validation";
  
interface Props {
    name: string;
    cardNumber: string;
    cvv: string;
    month: string;
    year: string;
}

const CreditCardFormValidation = ({name, cardNumber, cvv, month, year}: Props) => {
    const [validCreditCardForm, setValidCreditCardForm] = useState(false)

    useEffect(() => {
        setValidCreditCardForm(
          Boolean(name) &&
            Boolean(cardNumber) &&
            isValidCreditCardNumber(cardNumber) &&
            Boolean(cvv) &&
            isValidCvv(cvv) &&
            Boolean(month) &&
            isValidMonth(month) &&
            Boolean(year) &&
            isValidYear(year)
        );
      }, [name, cardNumber, cvv, month, year]);

      return validCreditCardForm
    
}

export default CreditCardFormValidation