import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import React from "react";

const FONTS = ["Figtree", "Caveat", "Pacifico", "DancingScript"];

interface TypeTabProps {
  onChangeData: (data: { signature: string; selectedFont: string }) => void;
}

const TypeTab = ({ onChangeData }: TypeTabProps) => {
  const [selectedFont, setSelectedFont] = React.useState(FONTS[0]);
  const [signature, setSignature] = React.useState("");

  React.useEffect(() => {
    onChangeData && onChangeData({ signature, selectedFont });
  }, [signature, selectedFont]);

  return (
    <>
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
    </>
  );
};

export default TypeTab;
