import { Checkbox, MultiSelect, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { FieldType, IField } from "hexa-sdk";
import { DatePicker } from "@mantine/dates";
import React from "react";

type DynamicFieldProps = {
  field: IField;
};

const DynamicField = ({ field }: DynamicFieldProps) => {
  switch (field.type) {
    case FieldType.Text:
      return <TextInput withAsterisk={field.required} label={field.label} />;
    case FieldType.Checkbox:
      return <Checkbox label={field.label} />;
    case FieldType.Date:
      return (
        <DatePicker withAsterisk={field.required} placeholder="Pick date" label={field.label} />
      );
    case FieldType.Multiselect:
      return (
        <MultiSelect
          data={field.options}
          label={field.label}
          placeholder="Pick values"
          withAsterisk={field.required}
        />
      );
    case FieldType.Number:
      return <NumberInput withAsterisk={field.required} label={field.label} />;
    case FieldType.Radio:
      return (
        <Radio.Group name={field.key} label={field.label} withAsterisk={field.required}>
          {field.options.map((o, i) => {
            return <Radio key={o + i} value={o} label={o} />;
          })}
        </Radio.Group>
      );
    case FieldType.Select:
      return (
        <Select
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
