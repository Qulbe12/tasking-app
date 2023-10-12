import { Center, Loader } from "@mantine/core";
import React, { useRef, useState } from "react";

import { Thumbnail, Document, pdfjs } from "react-pdf/dist/cjs";
import { PageCallback } from "react-pdf/dist/cjs/shared/types";

import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PDFPreviewProps = {
  url: string;
};

const PDFPreview: React.FC<PDFPreviewProps> = ({ url }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePageLoadSuccess = (page: PageCallback) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const viewport = page.getViewport({ scale: 1.015 });
      const computedScale = containerWidth / viewport.width;
      setScale(computedScale);
    }
  };
  return (
    <div ref={containerRef} style={{ width: "100%", height: "200px", overflow: "hidden" }}>
      <Document
        file={url}
        noData={null}
        loading={
          <Center className="w-full h-40 bg-gray-50-50 flex align-center justify-center">
            <Loader />
          </Center>
        }
      >
        <Thumbnail pageNumber={1} onLoadSuccess={handlePageLoadSuccess} scale={scale} />
      </Document>
    </div>
  );
};

export default PDFPreview;
