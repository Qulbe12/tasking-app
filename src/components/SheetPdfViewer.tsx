/* eslint-disable */
import { createElement, useEffect, useRef, useState } from "react";
import PSPDFKit, { Instance, ToolbarItem } from "pspdfkit";
import { useAppSelector } from "../redux/store";
import { ActionIcon, Button, Flex, Menu, Text, Tooltip } from "@mantine/core";
import { IconFileExport, IconRectangle, IconZoomPan } from "@tabler/icons";
import { IAttachment, IDocument } from "hexa-sdk";
import { axiosPrivate } from "../config/axios";
import { showError } from "../redux/commonSliceFunctions";
import { IErrorResponse } from "../interfaces/IErrorResponse";
import { showNotification } from "@mantine/notifications";
import { ISheetResponse } from "../interfaces/sheets/ISheetResponse";
import { ISubFile } from "../interfaces/sheets/common";
import { useDisclosure } from "@mantine/hooks";

type SheetPdfViewerProps = {
  file: ISubFile;
};

const controller = new AbortController();

export default function SheetPdfViewer({ file }: SheetPdfViewerProps) {
  const containerRef = useRef<HTMLElement>();

  const { mode } = useAppSelector((state) => state.theme);

  const [instance, setInstance] = useState<Instance | null>(null);

  const [wheelScroll, setWheelScroll] = useState(false);

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
      a.download = file.name;
      a.setAttribute("download", file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const [loadingAnnotations, setLoadingAnnotations] = useState(false);
  const [annotsChanged, setAnnotsChanged] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    PSPDFKit.unload(container);

    (async function () {
      if (!file) return;

      setLoadingAnnotations(true);

      //   const res = await axiosPrivate.get(
      //     `/documents/${selectedDocument.id}/annotations/${attachment.id}`,
      //   );

      setLoadingAnnotations(false);

      const pspdfInstance = await PSPDFKit.load({
        container,
        theme: mode === "dark" ? "DARK" : "LIGHT",
        document: file.url,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
      });

      const viewState = pspdfInstance.viewState;

      pspdfInstance.setViewState(
        viewState.merge({
          interactionMode: "PAN",
        }),
      );

      pspdfInstance.addEventListener("annotations.didSave", () => {
        setAnnotsChanged(true);
      });

      const handleScroll = (e: WheelEvent) => {
        if (e.deltaY < 0) {
          pspdfInstance?.setViewState((viewState) => viewState.zoomIn());
        } else if (e.deltaY > 0) {
          pspdfInstance?.setViewState((viewState) => viewState.zoomOut());
        }
      };

      // pspdfInstance?.contentDocument.addEventListener("wheel", handleScroll);
      var zoom = false;
      var clickCount = 0;
      pspdfInstance.contentDocument.addEventListener("mousedown", (e) => {
        if (e.button !== 1) return;

        clickCount++;

        if (clickCount !== 1) return;

        setTimeout(function () {
          if (clickCount === 1) return;
          if (zoom) {
            pspdfInstance?.contentDocument.removeEventListener("wheel", handleScroll);
            zoom = false;
            setWheelScroll(false);
          } else {
            pspdfInstance?.contentDocument.addEventListener("wheel", handleScroll);
            zoom = true;
            setWheelScroll(true);
          }

          clickCount = 0;
        }, 300);
      });

      // pspdfInstance.contentDocument.addEventListener("dblclick", (e) => {
      //   // setWheelScroll((o) => !o);

      //   if (zoom) {
      //     pspdfInstance?.contentDocument.removeEventListener("wheel", handleScroll);
      //     zoom = false;
      //     setWheelScroll(false);
      //   } else {
      //     pspdfInstance?.contentDocument.addEventListener("wheel", handleScroll);
      //     zoom = true;
      //     setWheelScroll(true);
      //   }
      // });

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
      {/* @ts-ignore */}
      <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />

      <div className="absolute right-8 top-28">
        <Flex direction="column" gap="md">
          <Tooltip label="Double middle click to toggle zoom or scroll">
            <ActionIcon color="gray" variant="filled" size="lg" disabled={!wheelScroll}>
              <IconZoomPan />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </div>
    </div>
  );
}
