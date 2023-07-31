/* eslint-disable camelcase */
import { Button, Grid, Group, Input } from "@mantine/core";
import { IMaskInput } from "react-imask";
import React, { useState } from "react";
import ICreatePaymentMethod from "../interfaces/stripe/ICreatePaymentMethod";
import { addPaymentMethod } from "../redux/api/stripeApi";
import { useAppDispatch, useAppSelector } from "../redux/store";

type PaymentInformationFormProps = {
  onCancelClick?: () => void;
  afterComplete?: () => void;
};

const PaymentInformationForm = ({ onCancelClick, afterComplete }: PaymentInformationFormProps) => {
  const dispatch = useAppDispatch();

  const {
    loaders: { addingPaymentMethod },
  } = useAppSelector((state) => state.stripe);
  const [form, setForm] = useState<any>({
    cvc: "",
    expDate: "",
    number: "",
  });

  const handleFormSubmit = async () => {
    const preppedForm: ICreatePaymentMethod = {
      cvc: form.cvc,
      exp_month: parseInt(form.expDate.split("/")[0]),
      exp_year: parseInt(form.expDate.split("/")[1]),
      number: form.number.replace(/[^0-9]+/gi, ""),
    };

    await dispatch(addPaymentMethod(preppedForm));

    afterComplete && afterComplete();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}
    >
      <Grid>
        <Grid.Col span={12}>
          <Input.Wrapper id="cardNumber" label="Card Number" required>
            <Input
              component={IMaskInput}
              mask="0000-0000-0000-0000"
              id="cardNumber"
              placeholder="0000-0000-0000-0000"
              value={form.number}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setForm({ ...form, number: e.target.value });
              }}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Input.Wrapper id="expDate" label="Card Expiration Date" required>
            <Input
              component={IMaskInput}
              mask="00/0000"
              id="expDate"
              placeholder="MM/YYYY"
              value={form.expDate}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setForm({ ...form, expDate: e.target.value });
              }}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Input.Wrapper id="cvvCode" label="CVV Code" required>
            <Input
              component={IMaskInput}
              mask="000"
              id="cvvCode"
              placeholder="123"
              value={form.cvc}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setForm({ ...form, cvc: e.target.value });
              }}
            />
          </Input.Wrapper>
        </Grid.Col>
      </Grid>

      <Group my="md" position="right">
        {onCancelClick && <Button onClick={() => onCancelClick()}>Cancel</Button>}
        <Button loading={addingPaymentMethod} type="submit">
          Add Card
        </Button>
      </Group>
    </form>
  );
};

export default PaymentInformationForm;
