import { Checkbox, MultiSelect, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { FieldType, IField } from "hexa-sdk/dist/app.api";
import { DatePicker } from "@mantine/dates";
import React from "react";
import { UseFormReturnType } from "@mantine/form";

type DynamicFieldProps = {
  field: IField;
  form?: UseFormReturnType<any>;
  value?: string;
  onChange?: (e: string | boolean | Date | string[]) => void;
};

const DynamicField = ({ field, form, value, onChange }: DynamicFieldProps) => {
  switch (field.type) {
    case FieldType.Text:
      return (
        <TextInput
          withAsterisk={field.required}
          label={field.label}
          {...form?.getInputProps(field.key)}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      );
    case FieldType.Checkbox:
      return (
        <Checkbox
          label={field.label}
          {...form?.getInputProps(field.key, { type: "checkbox" })}
          value={value}
          checked={value}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
      );
    case FieldType.Date:
      return (
        <DatePicker
          withAsterisk={field.required}
          placeholder="Pick date"
          label={field.label}
          {...form?.getInputProps(field.key)}
          onChange={(e) => {
            if (!e) return;
            onChange && onChange(e);
          }}
        />
      );
    case FieldType.Multiselect:
      return (
        <MultiSelect
          data={field.options}
          label={field.label}
          placeholder="Pick values"
          withAsterisk={field.required}
          {...form?.getInputProps(field.key)}
          onChange={(e) => onChange && onChange(e)}
        />
      );
    case FieldType.Number:
      return (
        <NumberInput
          withAsterisk={field.required}
          label={field.label}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Radio:
      return (
        <Radio.Group
          name={field.key}
          label={field.label}
          withAsterisk={field.required}
          {...form?.getInputProps(field.key)}
        >
          {field.options.map((o, i) => {
            return <Radio key={o + i} value={o} label={o} />;
          })}
        </Radio.Group>
      );
    case FieldType.Select:
      return (
        <Select
          {...form?.getInputProps(field.key)}
          label={field.label}
          placeholder="Pick one"
          data={field.options}
        />
      );
    default:
      return <TextInput withAsterisk={field.required} label={field.label} />;
  }
};

export default DynamicField;
