import { useImperativeHandle, useEffect, useState, useCallback, forwardRef, memo } from "react";
import SignaturePad from "signature_pad";

interface DrawTabProps {
  onEndDraw: () => void;
  onClear: () => void;
}

export interface DrawTabRef {
  toPng: () => string | undefined;
}

const DrawTab = forwardRef<DrawTabRef, DrawTabProps>(
  ({ onEndDraw, onClear }, ref) => {
    const [signaturePad, setSignaturePad] = useState<SignaturePad>();
    const [selectedColor, setSelectedColor] = useState("#000");

    useEffect(() => {
      const canvas = document.querySelector("#draw-canvas") as HTMLCanvasElement;
      if (canvas) {
        const parentDiv = canvas.parentElement;
        canvas.width = parentDiv?.clientWidth || 0;
        canvas.height = 300;
        const newSignaturePad = new SignaturePad(canvas, {
          dotSize: 0.1,
          minWidth: 1,
          maxWidth: 1,
          penColor: "black",
        });
        newSignaturePad.addEventListener("endStroke", onEndDraw);
        setSignaturePad(newSignaturePad);

        return () => {
          newSignaturePad.off();
        };
      }
    }, [onEndDraw]);

    useEffect(() => {
      if (signaturePad) {
        signaturePad.penColor = selectedColor;
      }
    }, [selectedColor, signaturePad]);

    useImperativeHandle(
      ref,
      () => ({
        toPng: () => signaturePad?.toDataURL(),
      }),
      [signaturePad]
    );

    const clearSignature = useCallback(() => {
      signaturePad?.clear();
      onClear();
    }, [signaturePad, onClear]);

    const DotColor = memo(({ color }: { color: string }) => {
      return (
        <div
          className="w-5 h-5 rounded-full"
          onClick={() => setSelectedColor(color)}
          style={{
            backgroundColor: color,
            borderWidth: 2,
            borderColor: selectedColor === color ? selectedColor : "none",
          }}
        ></div>
      );
    });

    return (
      <div>
        <div className="flex flex-row gap-x-2 py-3 pb-5 justify-end">
          {["#000", "#4537DE", "#F472B6", "#34D399", "#F59E0B"].map((color) => (
            <DotColor key={color} color={color} />
          ))}
        </div>
        <div className="w-full h-[300px] relative">
          <canvas
            id="draw-canvas"
            className="absolute inset-0 z-10 w-full rounded-sm border border-gray-300 border-dashed cursor-crosshair"
          ></canvas>
        </div>
        <div className="text-center">
          <button
            className="text-sm text-[#4537DE] my-3 mt-6"
            onClick={clearSignature}
          >
            Clear Signature
          </button>
        </div>
      </div>
    );
  }
);

export default DrawTab;
