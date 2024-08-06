import React, { useRef } from "react";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, getSignatureDimension } from "../lib/utils";
import { getFontEmbedCSS, toPng } from "html-to-image";

export interface Coordinate {
  top: number;
  left: number;
  pageIndex: number;
  id: number;
}

export interface SignatureData extends Coordinate {
  textData: string;
}

interface SignatureBoxProps {
  coordinate: Coordinate;
  onSigned: (
    signature: string,
    options: SignatureData
  ) => void;
}

const FONTS = ["Figtree", "Caveat", "Pacifico", "DancingScript"];

const SignatureBox = ({ coordinate, onSigned }: SignatureBoxProps) => {
  const { top, left } = coordinate;
  const { isShowing, toggle } = useModal();
  const [selectedFont, setSelectedFont] = React.useState(FONTS[0]);
  const [signature, setSignature] = React.useState("");
  const [signatureBase64, setSignatureBase64] = React.useState("");
  const domNodeRef = useRef<HTMLElement>(null);

  const handleSign = async () => {
    if (domNodeRef.current === null) {
      return;
    }

    try {
      const oldSignature = document.querySelector(
        `[data-id='${coordinate.id}']`
      );
      if (oldSignature) oldSignature.remove();

      const domNode = document.createElement("div");
      const fontSize = 160;
      const { textWidth } = getSignatureDimension(
        signature,
        fontSize
      );
      domNode.setAttribute("data-id", `${coordinate.id}`);
      domNode.innerHTML = signature;
      domNode.style.fontFamily = selectedFont;
      domNode.style.fontSize = fontSize + "px";
      domNode.style.position = "absolute";
      domNode.style.top = "0px";
      domNode.style.left = "-8px";
      domNode.style.zIndex = "-9999";
      domNode.style.width = `${textWidth + 8}px`;
      domNodeRef?.current?.appendChild(domNode);

      const fontEmbedCSS = await getFontEmbedCSS(domNode);

      const dataUrl = await toPng(domNode, {
        fontEmbedCSS,
        quality: 1,
        pixelRatio: 1,
      });
      domNodeRef?.current?.removeChild(domNode);

      setSignatureBase64(dataUrl);
      onSigned(dataUrl, { ...coordinate, textData: signature });
      toggle();
    } catch (error) {
      console.error("Failed to capture image:", error);
    }
  };

  return (
    <div className="signature-box" style={{ top, left }}>
      <div ref={domNodeRef} onClick={toggle}>
        {signatureBase64 ? (
          <p className={cn("text-xl", `font-${selectedFont}`)}>{signature}</p>
        ) : (
          <p>Sign here</p>
        )}
      </div>

      <Modal
        isShowing={isShowing}
        onClose={toggle}
        onOk={handleSign}
        headerTitle={"Add Signature"}
      >
        <div className="mb-2">
          <Input
            type="text"
            placeholder="Signature"
            value={signature}
            className={cn("text-center text-2xl h-14", `font-${selectedFont}`)}
            onChange={(e) => setSignature(e.target.value)}
          />

          <RadioGroup
            className={cn("flex flex-wrap gap-2 mt-2")}
            value={selectedFont}
          >
            {FONTS.map((font) => (
              <div
                className={cn(
                  "flex items-center space-x-2 w-[calc(50%-0.5rem)]",
                  `font-${font} text-xl px-2 py-1 rounded-md`
                )}
              >
                <RadioGroupItem
                  value={font}
                  onClick={() => setSelectedFont(font)}
                />
                <p className={`font-${font}`}>
                  {signature ? signature : "Signature"}
                </p>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Modal>
    </div>
  );
};

export default SignatureBox;
