import { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";

type PdfViewerComponentProps = {
  documentUrl: string;
};

export default function PdfViewerComponent({ documentUrl }: PdfViewerComponentProps) {
  const containerRef = useRef<string | HTMLElement>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    PSPDFKit.unload(container);

    PSPDFKit.load({
      container,
      document: documentUrl,
      baseUrl: `${window.location.protocol}//${window.location.host}/`,
    });

    return () => {
      PSPDFKit && PSPDFKit.unload(container);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />;
}
