import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import React, { useState, useEffect, useCallback, memo } from "react";

const FONTS = ["Figtree", "Caveat", "Pacifico", "DancingScript"];

interface TypeTabProps {
  onChangeData: (data: { signature: string; selectedFont: string }) => void;
}

const TypeTab = memo(({ onChangeData }: TypeTabProps) => {
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    onChangeData && onChangeData({ signature, selectedFont });
  }, [signature, selectedFont, onChangeData]);

  const handleSignatureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignature(e.target.value);
  }, []);

  const handleFontChange = useCallback((font: string) => {
    setSelectedFont(font);
  }, []);

  return (
    <>
      <Input
        type="text"
        placeholder="Signature"
        value={signature}
        className={cn("text-center text-2xl h-14", `font-${selectedFont}`)}
        onChange={handleSignatureChange}
      />

      <RadioGroup
        className={cn("flex flex-wrap gap-2 mt-2")}
        value={selectedFont}
      >
        {FONTS.map((font) => (
          <div
            key={font}
            className={cn(
              "flex items-center space-x-2 w-[calc(50%-0.5rem)]",
              `font-${font} text-xl px-2 py-1 rounded-md`
            )}
          >
            <RadioGroupItem
              value={font}
              onClick={() => handleFontChange(font)}
            />
            <p className={`font-${font}`}>
              {signature ? signature : "Signature"}
            </p>
          </div>
        ))}
      </RadioGroup>
    </>
  );
});

export default TypeTab;
