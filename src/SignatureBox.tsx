import React from "react";
import useModal from "./hooks/useModal";
import Modal from "./components/Modal";

interface SignatureBoxProps {
  top: number;
  left: number;
}

const SignatureBox = ({ top, left }: SignatureBoxProps) => {
  const { isShowing, toggle } = useModal();
  console.log("📢[SignatureBox.tsx:12]: isShowing: ", isShowing);
  return (
    <div className="signature-box" style={{ top, left }}>
      <div className="signature" onClick={toggle}>
        <p>Signature</p>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        headerTitle={'Add Signature'}
      />
    </div>
  );
};

export default SignatureBox;
