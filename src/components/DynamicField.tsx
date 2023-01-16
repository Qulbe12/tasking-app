import { TextInput } from "@mantine/core";
import { FieldType, IField } from "hexa-sdk";
import React from "react";

type DynamicFieldProps = {
  field: IField;
};

const DynamicField = ({ field }: DynamicFieldProps) => {
  if (field.type === FieldType.Text)
    switch (field.type) {
      case FieldType.Text:
        return <TextInput withAsterisk={field.required} label={field.label} />;

      default:
        return <p>Default Type</p>;
    }

  return <div>DynamicField</div>;
};

export default DynamicField;
