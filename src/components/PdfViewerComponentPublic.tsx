/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import PSPDFKit, { Instance } from "pspdfkit";
import { useAppSelector } from "../redux/store";
import { Button, Flex, Menu, Text } from "@mantine/core";
import { IconFileExport, IconRectangle } from "@tabler/icons";
import { IAttachment, IDocument } from "hexa-sdk";
import { axiosPrivate } from "../config/axios";

type PdfViewerComponentProps = {
  selectedDocument?: IDocument | null;
  attachment: IAttachment;
};

export default function PdfViewerComponentPublic({
  attachment,
  selectedDocument,
}: PdfViewerComponentProps) {
  const containerRef = useRef<string | HTMLElement>();

  const { mode } = useAppSelector((state) => state.theme);

  const [instance, setInstance] = useState<Instance | null>(null);

  async function exportPdf(excludeAnnotations: boolean) {
    if (!instance) return;
    const buffer = await instance.exportPDF({
      excludeAnnotations,
    });

    const supportsDownloadAttribute = HTMLAnchorElement.prototype.hasOwnProperty("download");
    const blob = new Blob([buffer], { type: "application/pdf" });
    // @ts-ignore
    if (navigator.msSaveOrOpenBlob) {
      // @ts-ignore
      navigator.msSaveOrOpenBlob(blob, documentTitle);
    } else if (!supportsDownloadAttribute) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const dataUrl = reader.result;
        downloadPdf(dataUrl);
      };
      reader.readAsDataURL(blob);
    } else {
      const objectUrl = window.URL.createObjectURL(blob);
      downloadPdf(objectUrl);
      window.URL.revokeObjectURL(objectUrl);
    }

    function downloadPdf(blob: any) {
      const a = document.createElement("a");
      a.href = blob;
      a.style.display = "none";
      a.download = attachment.name;
      a.setAttribute("download", attachment.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const [loadingAnnotations, setLoadingAnnotations] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    PSPDFKit.unload(container);

    (async function () {
      if (!selectedDocument) return;

      setLoadingAnnotations(true);

      const res = await axiosPrivate.get(
        `/documents/${selectedDocument.id}/annotations/${attachment.id}`,
      );

      setLoadingAnnotations(false);

      const pspdfInstance = await PSPDFKit.load({
        container,
        theme: mode === "dark" ? "DARK" : "LIGHT",
        document: attachment.url,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        instantJSON: {
          annotations: res.data,
          format: "https://pspdfkit.com/instant-json/v1",
        },
      });

      const toolbarItems = pspdfInstance.toolbarItems;
      pspdfInstance.setToolbarItems(toolbarItems.filter((item) => item.type !== "export-pdf"));
      setInstance(pspdfInstance);
    })();

    return () => {
      PSPDFKit && PSPDFKit.unload(container);
    };
  }, []);

  return (
    <div>
      <Flex justify="flex-end">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="gray" leftIcon={<IconFileExport size={14} />}>
              Export
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                exportPdf(false);
              }}
              icon={<IconFileExport size={14} />}
            >
              With Annotations
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                exportPdf(true);
              }}
              icon={<IconFileExport size={14} />}
            >
              Without Annotations
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {loadingAnnotations && <Text>Loading annotations...</Text>}

      {/* @ts-ignore */}
      <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />
    </div>
  );
}
