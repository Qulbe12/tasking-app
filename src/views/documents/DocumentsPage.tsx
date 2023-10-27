import React, { useEffect, useState } from "react";
import { IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";
import DocumentsGridView from "./components/DocumentsGridView";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getDocuments } from "../../redux/api/documentApi";
import DocumentsBoardView from "./components/DocumentsBoardView";
import { useLocation } from "react-router-dom";

const DocumentsPage = () => {
  const dispatch = useAppDispatch();
  const { state } = useLocation();

  const { data: documents, activeBoard } = useAppSelector((state) => ({
    data: state.documents.data,
    activeBoard: state.boards.activeBoard,
  }));

  const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse | null>(null);

  useEffect(() => {
    if (state !== null) {
      const foundDocument = documents.find((d) => d.id === state.documentId);
      setSelectedDocument(foundDocument ?? null);
    }
  }, [state]);

  useEffect(() => {
    if (!selectedDocument) return;
    const foundDocument = documents.find((f) => f.id === selectedDocument.id);
    if (!foundDocument) return;
    setSelectedDocument(foundDocument);
  }, [documents]);

  useEffect(() => {
    if (!activeBoard) return;
    setSelectedDocument(null);
    dispatch(getDocuments({ boardId: activeBoard.id, query: {} }));
  }, [activeBoard]);

  useEffect(() => {
    const handleEscapePress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedDocument(null);
      }
    };

    window.addEventListener("keydown", handleEscapePress, false);
    return () => window.removeEventListener("keydown", handleEscapePress, false);
  }, []);

  const handleAfterArchive = () => setSelectedDocument(documents.length > 0 ? documents[0] : null);

  return selectedDocument ? (
    <DocumentsBoardView
      afterArchive={handleAfterArchive}
      documents={documents}
      onDocumentClick={setSelectedDocument}
      selectedDocument={selectedDocument}
    />
  ) : (
    <DocumentsGridView documents={documents} onDocumentClick={setSelectedDocument} />
  );
};

export default DocumentsPage;
