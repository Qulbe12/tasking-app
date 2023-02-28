import { Card } from "@mantine/core";
import { ITemplate } from "hexa-sdk/dist/app.api";
import React from "react";

type TemplateCardProps = {
  template: ITemplate;
};

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card shadow="md" className="cursor-pointer hover:-translate-y-1 relative">
      <Card.Section>
        {template.default && (
          <small className="absolute top-0 left-0 w-6 h-6 flex justify-center align-center bg-orange-400 text-white">
            D
          </small>
        )}
        <div className="flex items-center justify-center p-4">{template.name}</div>
      </Card.Section>
    </Card>
  );
};

export default TemplateCard;
