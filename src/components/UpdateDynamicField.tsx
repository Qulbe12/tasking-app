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
import React from "react";
import { FieldType, IField } from "../interfaces/documents/IField";

type UpdateDynamicFieldProps = {
  field: IField;
  value?: string;
  onChange?: (e: string | boolean | Date | string[]) => void;
};

const UpdateDynamicField: React.FC<UpdateDynamicFieldProps> = ({ field, value, onChange }) => {
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
    case FieldType.Textarea:
      return (
        <Textarea
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
            onChange && onChange(e.toISOString());
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
