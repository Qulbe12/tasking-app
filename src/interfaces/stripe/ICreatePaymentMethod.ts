interface ICreatePaymentMethod {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
}

export default ICreatePaymentMethod;
