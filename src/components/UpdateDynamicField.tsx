import { Checkbox, MultiSelect, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { FieldType, IField } from "hexa-sdk/dist/app.api";
import { DatePicker } from "@mantine/dates";
import React from "react";

type UpdateDynamicFieldProps = {
  field: IField;
  value?: string;
  onChange?: (e: string | boolean | Date | string[]) => void;
};

const UpdateDynamicField = ({ field, value, onChange }: UpdateDynamicFieldProps) => {
  switch (field.type) {
    case FieldType.Text:
      return (
        <TextInput
          withAsterisk={field.required}
          label={field.label}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      );
    case FieldType.Number:
      return (
        <NumberInput
          withAsterisk={field.required}
          label={field.label}
          value={parseInt(value || "")}
          onChange={(e) => onChange && onChange(`${e}`)}
        />
      );
    case FieldType.Checkbox:
      return (
        <Checkbox
          label={field.label}
          checked={value === "true" ? true : false}
          onChange={(e) => onChange && onChange(e.target.checked ? "true" : "false")}
        />
      );
    case FieldType.Date:
      return (
        <DatePicker
          withAsterisk={field.required}
          placeholder="Pick date"
          label={field.label}
          value={new Date(value || "")}
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
          value={value?.split(",")}
          placeholder="Pick values"
          withAsterisk={field.required}
          onChange={(e) => onChange && onChange(e.join())}
        />
      );

    case FieldType.Radio:
      return (
        <Radio.Group
          name={field.key}
          label={field.label}
          withAsterisk={field.required}
          value={value}
          onChange={(e) => onChange && onChange(e)}
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
          value={value}
          onChange={(e) => onChange && onChange(e || "")}
        />
      );
    default:
      return <TextInput withAsterisk={field.required} label={field.label} />;
  }
};

export default UpdateDynamicField;
