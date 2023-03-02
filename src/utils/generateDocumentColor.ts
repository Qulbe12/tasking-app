import { DefaultMantineColor } from "@mantine/core";
import { defaultTemplateTypes } from "../constants/defaultTemplateTypes";

export function generateDocumentColor(templateName?: string): DefaultMantineColor {
  if (!templateName) return "indigo";

  switch (templateName) {
    case defaultTemplateTypes.budget:
      return "cyan";
    case defaultTemplateTypes.changeEvents:
      return "blue";
    case defaultTemplateTypes.changeOrders:
      return "grape";
    case defaultTemplateTypes.contract:
      return "green";
    case defaultTemplateTypes.documents:
      return "indigo";
    case defaultTemplateTypes.invoices:
      return "lime";
    case defaultTemplateTypes.meeting:
      return "orange";
    case defaultTemplateTypes.punchList:
      return "pink";
    case defaultTemplateTypes.quote:
      return "red";
    case defaultTemplateTypes.rfis:
      return "teal";
    case defaultTemplateTypes.sheets:
      return "violet";
    case defaultTemplateTypes.specifications:
      return "violet";
    case defaultTemplateTypes.submittals:
      return "yellow";
    case defaultTemplateTypes.task:
      return "indigo";
    default:
      return "indigo";
  }
}
