import * as React from "react";
import {
  LayerRenderStatus,
  Plugin,
  PluginOnCanvasLayerRender,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import samplePdf from "./assets/sample.pdf";
import SignatureBox, {
  Coordinate,
  SignatureData,
} from "./components/SignatureBox";
import ReactDOM from "react-dom";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { getSignatureDimension } from "./lib/utils";

// Import the styles
import "./App.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const SignatureCoordinates: Coordinate[] = [
  { pageIndex: 1, x: 210, y: 700, id: Date.now() },
  { pageIndex: 1, x: 461, y: 700, id: Date.now() + 123 },
  { pageIndex: 2, x: 210, y: 700, id: Date.now() + 12353 },
  { pageIndex: 2, x: 461, y: 700, id: Date.now() + 646 },
];

const workerUrl = new URL(
  "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
).toString();

const createNodeFromComponent = (
  Component: React.ElementType,
  props: object
) => {
  const newNode = document.createElement("div");
  ReactDOM.render(<Component {...props} />, newNode);
  return newNode;
};

const useCustomCanvasPlugin = (onSigned: (data: string, opts: SignatureData) => void): Plugin => {
  return React.useMemo(() => {
    const onCanvasLayerRender = (e: PluginOnCanvasLayerRender) => {
      if (e.status !== LayerRenderStatus.DidRender) {
        return;
      }

      const { pageIndex, ele: canvas } = e;
      canvas.id = "custom-canvas";
      const absCanvas = document.createElement("canvas");
      absCanvas.height = canvas.height;
      absCanvas.width = canvas.width;
      absCanvas.className = "abs-canvas";
      const parentNode = canvas.parentNode;
      parentNode?.append(absCanvas);
      SignatureCoordinates.forEach((coordinate) => {
        if (coordinate.pageIndex - 1 === pageIndex) {
          const newNode = createNodeFromComponent(SignatureBox, {
            coordinate,
            onSigned,
          });
          parentNode?.append(newNode);
        }
      });
    };

    return {
      onCanvasLayerRender,
    };
  }, [onSigned]);
};

const DrawCanvasExample: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [signedSignature, setSignedSignature] = React.useState<
    Array<SignatureData & { data: string }>
  >([]);

  const onSigned = React.useCallback((data: string, opts: SignatureData) => {
    setSignedSignature((prev) => {
      const index = prev.findIndex((item) => item.id === opts.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...opts, data };
        return updated;
      }
      return [...prev, { ...opts, data }];
    });
  }, []);

  const customCanvasPluginInstance = useCustomCanvasPlugin(onSigned);

  const download = React.useCallback(async () => {
    const resPDf = await fetch(fileUrl);
    const buffer = await resPDf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);

    await Promise.all(
      signedSignature.map(async (item) => {
        const { x, y, data, textData, pageIndex } = item;
        let { textWidth, textHeight } = getSignatureDimension(textData, 20);

        if (!textData) {
          textWidth = 100;
          textHeight = 50;
        }

        const page = pdfDoc.getPage(pageIndex - 1);
        const { height } = page.getSize();

        const jpgImage = await pdfDoc.embedPng(data);

        const safeTop = height - y - textHeight;

        page.drawImage(jpgImage, {
          x: x,
          y: safeTop,
          width: textWidth,
          height: textHeight,
        });
      })
    );

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    saveAs(blob, Date.now() + "_signed.pdf");
  }, [fileUrl, signedSignature]);

  return (
    <React.Fragment>
      <button onClick={download}>Download</button>
      <Viewer
        fileUrl={fileUrl}
        plugins={[customCanvasPluginInstance]}
        defaultScale={SpecialZoomLevel.ActualSize}
      />
    </React.Fragment>
  );
};

const App = () => {
  return (
    <Worker workerUrl={workerUrl}>
      <DrawCanvasExample fileUrl={samplePdf} />
    </Worker>
  );
};

export default App;