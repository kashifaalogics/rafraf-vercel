const AmexCardnumber = (cardNumber: string) => {
  var cardno = /^(?:3[47][0-9]{13})$/;
  return cardno.test(cardNumber);
};

const VisaCardnumber = (cardNumber: string) => {
  var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  return cardno.test(cardNumber);
};

const MasterCardnumber = (cardNumber: string) => {
  var cardno = /^(?:5[1-5][0-9]{14})$/;
  return cardno.test(cardNumber);
};

const DiscoverCardnumber = (cardNumber: string) => {
  var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  return cardno.test(cardNumber);
};

const DinerClubCardnumber = (cardNumber: string) => {
  var cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
  return cardno.test(cardNumber);
};

const JCBCardnumber = (cardNumber: string) => {
  return /^(?:(?:2131|1800|35\d{3})\d{11})$/.test(cardNumber);
};

const isValidCreditCardNumber = (cardNumber: string) => {
  var cardType = null;
  if (VisaCardnumber(cardNumber)) {
    cardType = "visa";
  } else if (MasterCardnumber(cardNumber)) {
    cardType = "mastercard";
  } else if (AmexCardnumber(cardNumber)) {
    cardType = "americanexpress";
  } else if (DiscoverCardnumber(cardNumber)) {
    cardType = "discover";
  } else if (DinerClubCardnumber(cardNumber)) {
    cardType = "dinerclub";
  } else if (JCBCardnumber(cardNumber)) {
    cardType = "jcb";
  }  

  return Boolean(cardType);
};

export default isValidCreditCardNumber;
