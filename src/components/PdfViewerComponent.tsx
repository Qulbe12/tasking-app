import { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";

export default function PdfViewerComponent(props: { document: any }) {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    let instance: any;
    // let PSPDFKit: any;
    (async function () {
      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });
    })();

    return () => {
      PSPDFKit && PSPDFKit.unload(container);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
