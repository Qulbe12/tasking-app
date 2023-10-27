import React from "react";
import {
  Checkbox,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { FieldType, IField } from "../interfaces/documents/IField";

type DynamicFieldProps = {
  field: IField;
  form?: UseFormReturnType<any>;
  width?: number;
};

const DynamicField: React.FC<DynamicFieldProps> = ({ field, form, width }) => {
  switch (field.type) {
    case FieldType.Text:
      return (
        <TextInput
          withAsterisk={field.required}
          label={field.label}
          w={width ? `${width}%` : "100%"}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Textarea:
      return (
        <Textarea
          withAsterisk={field.required}
          label={field.label}
          w={width ? `${width}%` : "100%"}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Number:
      return (
        <NumberInput
          withAsterisk={field.required}
          label={field.label}
          w={width ? `${width}%` : "100%"}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Checkbox:
      return (
        <Checkbox
          label={field.label}
          w={width ? `${width}%` : "100%"}
          {...form?.getInputProps(field.key, { type: "checkbox" })}
        />
      );
    case FieldType.Date:
      return (
        <DatePicker
          withAsterisk={field.required}
          placeholder="Pick date"
          w={width ? `${width}%` : "100%"}
          label={field.label}
          {...form?.getInputProps(field.key)}
        />
      );
    case FieldType.Multiselect:
      return (
        <MultiSelect
          data={field.options}
          label={field.label}
          w={width ? `${width}%` : "100%"}
          placeholder="Pick values"
          withAsterisk={field.required}
          {...form?.getInputProps(field.key)}
        />
      );

    case FieldType.Radio:
      return (
        <Radio.Group
          name={field.key}
          label={field.label}
          w={width ? `${width}%` : "100%"}
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
          withAsterisk={field.required}
          label={field.label}
          placeholder="Pick one"
          w={width ? `${width}%` : "100%"}
          data={field.options}
          {...form?.getInputProps(field.key)}
        />
      );
    default:
      return (
        <TextInput
          withAsterisk={field.required}
          label={field.label}
          w={width ? `${width}%` : "100%"}
        />
      );
  }
};

export default DynamicField;
