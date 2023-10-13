import { Card } from "@mantine/core";
import React from "react";
import { ITemplateResponse } from "../interfaces/template/ITemplateResponse";

type TemplateCardProps = {
  template: ITemplateResponse;
};

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
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
