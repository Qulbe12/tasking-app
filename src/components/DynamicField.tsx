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
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Number:
      return (
        <NumberInput
          withAsterisk={field.required}
          label={field.label}
          value={parseInt(value || "")}
          onChange={(e) => onChange && onChange(`${e}`)}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Checkbox:
      return (
        <Checkbox
          label={field.label}
          value={value}
          checked={value}
          onChange={(e) => onChange && onChange(e.target.checked)}
          {...form?.getInputProps(field.key, { type: "checkbox" })}
        />
      );
    case FieldType.Date:
      return (
        <DatePicker
          withAsterisk={field.required}
          placeholder="Pick date"
          label={field.label}
          onChange={(e) => {
            if (!e) return;
            onChange && onChange(e);
          }}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Multiselect:
      return (
        <MultiSelect
          data={field.options}
          label={field.label}
          placeholder="Pick values"
          withAsterisk={field.required}
          onChange={(e) => onChange && onChange(e)}
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
          label={field.label}
          placeholder="Pick one"
          data={field.options}
          {...form?.getInputProps(field.key)}
        />
      );
    default:
      return <TextInput withAsterisk={field.required} label={field.label} />;
  }
};

export default DynamicField;
