import { useEffect, useRef, useState } from "react";
import PSPDFKit, { Instance } from "pspdfkit";
import { useAppSelector } from "../redux/store";
import { ISubFile } from "../interfaces/sheets/common";

type SheetPdfViewerProps = {
  file: ISubFile;
  handleKeyEvent: (e: KeyboardEvent) => void;
};

export default function SheetPdfViewer({ file, handleKeyEvent }: SheetPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mode } = useAppSelector((state) => state.theme);

  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const loadInstance = async () => {
      if (!file) return;

      try {
        if (instance) {
          await PSPDFKit.unload(container);
        }
        const pspdfInstance = await PSPDFKit.load({
          container,
          theme: mode === "dark" ? "DARK" : "LIGHT",
          document: file.url,
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
        });

        const toolbarItems = pspdfInstance.toolbarItems;
        pspdfInstance.setToolbarItems(toolbarItems.filter((item) => item.type !== "export-pdf"));
        setInstance(pspdfInstance);
      } catch (err) {
        console.log(err);
      }
    };

    loadInstance();

    return () => {
      PSPDFKit && PSPDFKit.unload(container);
    };
  }, [file]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
