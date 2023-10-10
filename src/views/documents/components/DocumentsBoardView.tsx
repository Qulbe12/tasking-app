import React from "react";

import DocumentsListCol from "./DocumentsListCol";
import { IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";

import "./DocumentsBoardView.scss";
import DocumentsDetailsCol from "./DocumentsDetailsCol";
import DocumentsCommentsCol from "./DocumentsCommentsCol";
import DocumentsLinkedDocsCol from "./DocumentsLinkedDocsCol";

type DocumentsBoardViewProps = {
  documents: IDocumentResponse[];
  selectedDocument: IDocumentResponse | null;
  onDocumentClick: (document: IDocumentResponse) => void;
};

const DocumentsBoardView: React.FC<DocumentsBoardViewProps> = ({
  documents,
  selectedDocument,
  onDocumentClick,
}) => {
  return (
    <div className="documents-board-view">
      <DocumentsListCol
        documents={documents}
        selectedDocument={selectedDocument}
        onDocumentClick={onDocumentClick}
      />
      <DocumentsDetailsCol document={selectedDocument} />
      <DocumentsCommentsCol selectedDocument={selectedDocument} />
      <DocumentsLinkedDocsCol
        documents={documents}
        onDocumentClick={onDocumentClick}
        selectedDocument={selectedDocument}
      />
    </div>
  );
};

export default DocumentsBoardView;