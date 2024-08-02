import "./App.css";

import * as React from "react";
import {
  LayerRenderStatus,
  Plugin,
  PluginOnCanvasLayerRender,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import SignaturePad from "signature_pad";
import samplePdf from "./assets/sample.pdf";
import SignatureBox from "./SignatureBox";
import ReactDOM from "react-dom";
interface DrawCanvasExampleProps {
  fileUrl: string;
}

// Page 1, X: 210, Y: 700
// Page 1, X: 461, Y: 700
// Page 2, X: 210, Y: 700
// Page 2, X: 461, Y: 700

const SignatureCoordinates = [
  { pageIndex: 1, x: 210, y: 700 },
  { pageIndex: 1, x: 461, y: 700 },
  { pageIndex: 2, x: 210, y: 700 },
  { pageIndex: 2, x: 461, y: 700 },
];

const workerUrl = new URL(
  "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
).toString();

let signaturePad: SignaturePad | null = null;

const DrawCanvasExample: React.FC<DrawCanvasExampleProps> = ({ fileUrl }) => {

  const createNodeFromComponent = (Component, props) => {
    // Create a new DOM node
    const newNode = document.createElement('div');
  
    // Render the React component into the new DOM node
    ReactDOM.render(<Component {...props} />, newNode);
  
    // Return the newly created node
    return newNode;
  }; 

  const customCanvasPlugin = (): Plugin => {
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
          const newNode = createNodeFromComponent(SignatureBox, {top: coordinate.y, left: coordinate.x});
          parentNode?.append(newNode);
        }
      });
      signaturePad = new SignaturePad(absCanvas);
    };

    return {
      onCanvasLayerRender,
    };
  };

  const customCanvasPluginInstance = customCanvasPlugin();

  return (
    <Viewer
      fileUrl={fileUrl}
      plugins={[customCanvasPluginInstance]}
      defaultScale={SpecialZoomLevel.ActualSize}
    />
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
