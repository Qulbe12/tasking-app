import { IGroup } from "hexa-sdk/dist/app.api";
import { ISheetResponse } from "../sheets/ISheetResponse";
import { IDocumentResponse } from "../documents/IDocumentResponse";
import IBoardResponse from "../boards/IBoardResponse";
import { ITemplateResponse } from "../template/ITemplateResponse";

interface IBoardResourceResponse {
  board: IBoardResponse;
  groups: IGroup[];
  templates: ITemplateResponse[];
  documents: IDocumentResponse[];
  sheets: ISheetResponse[];
}

export default IBoardResourceResponse;
