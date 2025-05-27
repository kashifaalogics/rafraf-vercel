export const isValidEmail = (email: string) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const isValidPassword = (password: string) => {
  return /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password);
};

export const isValidPhone = (phone: string) => {
  // https://gist.github.com/homaily/8672499
  return /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(phone);
};

export { default as isValidCreditCardNumber } from "./creditcard/creditcard-number";

export const isValidMonth = (month: string) => {
  return /^([0-9]{2})$/.test(month) && parseInt(month) >= 1 && parseInt(month) <= 12;
}

export const isValidYear = (year: string) => {
  const currentYear = new Date().getFullYear();
  const providedYear = parseInt(year);

  // Ensure the year is a valid two-digit number
  if (isNaN(providedYear) || year.length !== 2) {
    return false;
  }

  // Check if the provided year is greater than or equal to the current year
  return providedYear >= currentYear % 100;
};

export const isValidCvv = (cvv: string) => {
  return /^([0-9]{3,4})$/.test(cvv);
}

export {default as CreditCardFormValidation} from "./credit-card-form"
export {default as ApplePayAvalible} from "./apple-pay-avalible"