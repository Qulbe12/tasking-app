import { Checkbox, MultiSelect, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { FieldType, IField } from "hexa-sdk";
import { DatePicker } from "@mantine/dates";
import React from "react";
import { UseFormReturnType } from "@mantine/form";

type DynamicFieldProps = {
  field: IField;
  form?: UseFormReturnType<any>;
};

const DynamicField = ({ field, form }: DynamicFieldProps) => {
  switch (field.type) {
    case FieldType.Text:
      return (
        <TextInput
          withAsterisk={field.required}
          label={field.label}
          {...form?.getInputProps(field.label)}
        />
      );
    case FieldType.Checkbox:
      return (
        <Checkbox label={field.label} {...form?.getInputProps(field.label, { type: "checkbox" })} />
      );
    case FieldType.Date:
      return (
        <DatePicker
          withAsterisk={field.required}
          placeholder="Pick date"
          label={field.label}
          {...form?.getInputProps(field.label)}
        />
      );
    case FieldType.Multiselect:
      return (
        <MultiSelect
          data={field.options}
          label={field.label}
          placeholder="Pick values"
          withAsterisk={field.required}
          {...form?.getInputProps(field.label)}
        />
      );
    case FieldType.Number:
      return (
        <NumberInput
          withAsterisk={field.required}
          label={field.label}
          {...form?.getInputProps(field.label)}
        />
      );
    case FieldType.Radio:
      return (
        <Radio.Group
          name={field.key}
          label={field.label}
          withAsterisk={field.required}
          {...form?.getInputProps(field.label)}
        >
          {field.options.map((o, i) => {
            return <Radio key={o + i} value={o} label={o} />;
          })}
        </Radio.Group>
      );
    case FieldType.Select:
      return (
        <Select
          {...form?.getInputProps(field.label)}
          label="Your favorite framework/library"
          placeholder="Pick one"
          data={field.options}
        />
      );
    default:
      return <TextInput withAsterisk={field.required} label={field.label} />;
  }
};

export default DynamicField;
