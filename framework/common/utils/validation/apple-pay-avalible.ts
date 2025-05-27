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

const ApplePayAvalible = () => {
    const [applePayAvailable, setApplePayAvailable] = useState(false)

    useEffect(() => {
        if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
          setApplePayAvailable(true)
        }
        else {
          setApplePayAvailable(false)
    
        }
      }, [])
    
      return applePayAvailable
    
}

export default ApplePayAvalible