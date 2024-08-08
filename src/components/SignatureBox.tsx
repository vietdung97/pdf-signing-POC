import { useRef, useState, useCallback, memo } from "react";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { cn, getSignatureDimension } from "../lib/utils";
import { getFontEmbedCSS, toPng } from "html-to-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypeTab from "./TypeTab";
import DrawTab, { DrawTabRef } from "./DrawTab";

export interface Coordinate {
  x: number;
  y: number;
  pageIndex: number;
  id: number;
}

export interface SignatureData extends Coordinate {
  textData: string;
}

interface SignatureBoxProps {
  coordinate: Coordinate;
  onSigned: (dataURL: string, options: SignatureData) => void;
}

const SignatureBox = memo(({ coordinate, onSigned }: SignatureBoxProps) => {
  const { x, y } = coordinate;
  const { isShowing, toggle } = useModal();
  const [selectedTab, setSelectedTab] = useState("draw");
  const [signedData, setSignedData] = useState<any>();
  const [signatureBase64, setSignatureBase64] = useState("");
  const [drawBase64, setDrawBase64] = useState("");
  const [disableOk, setDisableOk] = useState(true);
  const drawTabRef = useRef<DrawTabRef>(null);

  const handleTypeSign = useCallback(async ({ signature, selectedFont }: { signature: string; selectedFont: string; }) => {
    try {
      const offScreenContainer = document.createElement("div");
      offScreenContainer.style.position = "absolute";
      offScreenContainer.style.top = "-9999px";
      offScreenContainer.style.left = "-9999px";
      document.body.appendChild(offScreenContainer);

      const domNode = document.createElement("div");
      const fontSize = 160;
      const { textWidth } = getSignatureDimension(signature, fontSize);
      domNode.innerHTML = signature;
      domNode.style.fontFamily = selectedFont;
      domNode.style.fontSize = fontSize + "px";
      domNode.style.position = "absolute";
      domNode.style.top = "0px";
      domNode.style.left = "-8px";
      domNode.style.zIndex = "-9999";
      domNode.style.width = `${textWidth + fontSize}px`;
      offScreenContainer.appendChild(domNode);

      const fontEmbedCSS = await getFontEmbedCSS(domNode);

      const dataUrl = await toPng(domNode, {
        fontEmbedCSS,
        quality: 1,
        pixelRatio: 1,
      });

      offScreenContainer.removeChild(domNode);
      document.body.removeChild(offScreenContainer);

      setSignatureBase64(dataUrl);
      onSigned(dataUrl, { ...coordinate, textData: signature });
      toggle();
    } catch (error) {
      console.error("Failed to capture image:", error);
    }
  }, [coordinate, onSigned, toggle]);

  const handleOk = useCallback(async () => {
    if (selectedTab === "draw") {
      const dataUrl = drawTabRef.current?.toPng();
      if (dataUrl) {
        setDrawBase64(dataUrl);
        onSigned(dataUrl, { ...coordinate, textData: "" });
        toggle();
      }
    }

    if (selectedTab === "type") {
      const { signature, selectedFont } = signedData;
      if (signature) {
        await handleTypeSign({ signature, selectedFont });
      }
    }
  }, [selectedTab, signedData, coordinate, onSigned, toggle, handleTypeSign]);

  const changeDataTypeTab = useCallback((data: { signature: string; selectedFont: string; }) => {
    setSignedData(data);
    setDisableOk(!data.signature);
  }, []);

  const onEndDraw = useCallback(() => {
    setDisableOk(false);
  }, []);

  const onClear = useCallback(() => {
    setDisableOk(true);
  }, []);

  const openModal = useCallback(() => {
    toggle();
    setDrawBase64("");
    setSignatureBase64("");
  }, [toggle]);

  const renderTempSignature = useCallback(() => {
    if (selectedTab === "draw" && drawBase64) {
      return (
        <img src={drawBase64} alt="signature" className="w-[100px] h-[50px]" />
      );
    }

    if (selectedTab === "type" && signatureBase64) {
      const { signature, selectedFont } = signedData;
      return (
        <p className={cn("text-xl", `font-${selectedFont}`)}>{signature}</p>
      );
    }

    return <p>Sign here</p>;
  }, [selectedTab, drawBase64, signatureBase64, signedData]);

  return (
    <div className="signature-box" style={{ top: y, left: x }}>
      <div onClick={openModal}>{renderTempSignature()}</div>

      <Modal
        isShowing={isShowing}
        onClose={toggle}
        onOk={handleOk}
        disableOk={disableOk}
        headerTitle={"Add Signature"}
      >
        <Tabs
          value={selectedTab}
          className="w-full my-4"
          onValueChange={setSelectedTab}
        >
          <TabsList className="w-full">
            <TabsTrigger value="draw" className="w-full">
              Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="w-full">
              Type
            </TabsTrigger>
          </TabsList>
          <TabsContent value="draw" className="w-full">
            <DrawTab ref={drawTabRef} onEndDraw={onEndDraw} onClear={onClear} />
          </TabsContent>
          <TabsContent value="type" className="w-full">
            <TypeTab onChangeData={changeDataTypeTab} />
          </TabsContent>
        </Tabs>
      </Modal>
    </div>
  );
});

export default SignatureBox;
