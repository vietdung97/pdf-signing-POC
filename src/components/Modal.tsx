import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

interface ModalProps {
  isShowing: boolean;
  hide: () => void;
  headerTitle: string;
}

const Modal = ({ isShowing, hide, headerTitle }: ModalProps) =>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

export default Modal;
