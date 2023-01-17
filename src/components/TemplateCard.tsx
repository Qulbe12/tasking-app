import { Card } from "@mantine/core";
import { ITemplate } from "hexa-sdk";
import React from "react";

type TemplateCardProps = {
  template: ITemplate;
};

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card className="cursor-pointer hover:-translate-y-1">
      <Card.Section>
        <div className="flex items-center justify-center p-4">{template.name}</div>
      </Card.Section>
    </Card>
  );
};

export default TemplateCard;