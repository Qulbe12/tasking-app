import IBoardResponse from "./boards/IBoardResponse";
import { IDocumentResponse } from "./documents/IDocumentResponse";
import { ISheetResponse } from "./sheets/ISheetResponse";
import { ITemplateResponse } from "./template/ITemplateResponse";
import { IWorkspaceResponse } from "./workspaces/IWorkspaceResponse";

export interface ISearchResponse {
  boards: IBoardResponse[];
  documents: IDocumentResponse[];
  sheets: ISheetResponse[];
  templates: ITemplateResponse[];
  workspaces: IWorkspaceResponse[];
}
