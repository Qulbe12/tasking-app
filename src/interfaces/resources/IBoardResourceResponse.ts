import { IBoard, IGroup, ITemplate } from "hexa-sdk/dist/app.api";
import { ISheetResponse } from "../sheets/ISheetResponse";
import { IDocumentResponse } from "../documents/IDocumentResponse";

interface IBoardResourceResponse {
  board: IBoard;
  groups: IGroup[];
  templates: ITemplate[];
  documents: IDocumentResponse[];
  sheets: ISheetResponse[];
}

export default IBoardResourceResponse;
