import { IBoard, IDocument, IGroup, ITemplate } from "hexa-sdk/dist/app.api";
import { ISheetResponse } from "../sheets/ISheetResponse";

interface IBoardResourceResponse {
  board: IBoard;
  groups: IGroup[];
  templates: ITemplate[];
  documents: IDocument[];
  sheets: ISheetResponse[];
}

export default IBoardResourceResponse;
