import './App.css';

import * as React from 'react';
import { LayerRenderStatus, Plugin, PluginOnCanvasLayerRender, SpecialZoomLevel, Viewer, Worker  } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import SignaturePad from 'signature_pad';
import samplePdf from './assets/sample.pdf';
interface DrawCanvasExampleProps {
    fileUrl: string;
}

const workerUrl = new URL(
  'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js',
  import.meta.url,
  ).toString();

let signaturePad: SignaturePad | null = null;

const DrawCanvasExample: React.FC<DrawCanvasExampleProps> = ({ fileUrl }) => {
    const message = 'customer@email.com';
    
    const customCanvasPlugin = (): Plugin => {
        const onCanvasLayerRender = (e: PluginOnCanvasLayerRender) => {
            console.log("📢[App.tsx:24]: e: ", e);
            // Return if the canvas isn't rendered completely
            if (e.status !== LayerRenderStatus.DidRender) {
                return;
            }

            // `e.ele` is the canvas element
            const canvas = e.ele;
            canvas.id = 'custom-canvas';
            const absCanvas = document.createElement('canvas');
            absCanvas.height = canvas.height;
            absCanvas.width = canvas.width;
            absCanvas.className = 'abs-canvas';
            canvas.parentNode?.append(absCanvas);
            
            signaturePad = new SignaturePad(absCanvas);
        };

        return {
            onCanvasLayerRender,
        };
    };

    const customCanvasPluginInstance = customCanvasPlugin();

    return <Viewer fileUrl={fileUrl} plugins={[customCanvasPluginInstance]} defaultScale={1.5} />;
};

const App = () => {
  return (
    <Worker workerUrl={workerUrl}>
      <DrawCanvasExample fileUrl={samplePdf} />
    </Worker>
  );
};

export default App;
