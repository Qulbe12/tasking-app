import { Drawer, Flex, LoadingOverlay, Title } from "@mantine/core";
import { IconFileText } from "@tabler/icons";
import { IAttachment, IDocument } from "hexa-sdk";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../config/axios";
import { showError } from "../../redux/commonSliceFunctions";
import PdfViewerComponentPublic from "../../components/PdfViewerComponentPublic";

const DocumentPublicView = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [document, setDocument] = useState<IDocument | null>(null);

  async function fetchDocumentById(documentId: string) {
    setDocument(null);
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/documents/${documentId}`);
      setLoading(false);
      setDocument(res.data);
    } catch (err) {
      showError("Unable to get document");
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchDocumentById(location.pathname.split("/")[2]);
  }, []);

  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="p-4">
      <LoadingOverlay visible={loading} />

      <Title order={1} className="cursor-pointer" onClick={() => navigate("/")} mb="md">
        Hexadesk
      </Title>

      <Title order={3}> {document?.title}</Title>

      <p>Description: {document?.description}</p>
      <p>Document Type: {document?.type}</p>

      <p>Attachments: </p>
      {document?.attachments.map((a) => {
        return (
          <Flex
            onClick={() => {
              setSelectedAttachment(a);
              setPdfOpen(true);
            }}
            gap="md"
            style={{ cursor: "pointer" }}
            align="center"
            key={a.id}
          >
            <IconFileText size={32} />
            <p>{a.name}</p>
          </Flex>
        );
      })}

      <Drawer
        position="right"
        size="50%"
        title={selectedAttachment?.name}
        opened={pdfOpen}
        onClose={() => {
          setPdfOpen((o) => !o);
          setSelectedAttachment(null);
        }}
      >
        {selectedAttachment && (
          <PdfViewerComponentPublic selectedDocument={document} attachment={selectedAttachment} />
        )}
      </Drawer>
    </div>
  );
};

export default DocumentPublicView;
