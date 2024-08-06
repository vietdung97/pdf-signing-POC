import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { Button } from "./ui/button";

interface ModalProps {
  isShowing: boolean;
  onClose: () => void;
  onOk: () => void;
  headerTitle: string;
  children: React.ReactNode;
}

const Modal = ({
  isShowing,
  onClose,
  onOk,
  headerTitle,
  children,
}: ModalProps) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <div className="modal-header">
                <p>{headerTitle}</p>
              </div>
              {children}
              <div className="modal-footer flex justify-end gap-2">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type="button" onClick={onOk}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

export default Modal;
