interface ICreatePaymentMethod {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}

export default ICreatePaymentMethod;
