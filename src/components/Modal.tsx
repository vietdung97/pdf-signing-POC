import { Fragment, memo, ReactNode } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { Button } from "./ui/button";

interface ModalProps {
  isShowing: boolean;
  onClose: () => void;
  onOk: () => void;
  headerTitle: string;
  children: ReactNode;
  disableClose?: boolean;
  disableOk?: boolean;
}

const ModalContent = ({
  onClose,
  onOk,
  headerTitle,
  children,
  disableClose,
  disableOk,
}: Omit<ModalProps, "isShowing">) => (
  <Fragment>
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
            disabled={disableClose}
          >
            Close
          </Button>
          <Button type="button" onClick={onOk} disabled={disableOk}>
            Done
          </Button>
        </div>
      </div>
    </div>
  </Fragment>
);

const Modal = memo(
  ({
    isShowing,
    onClose,
    onOk,
    headerTitle,
    children,
    disableClose = false,
    disableOk = false,
  }: ModalProps) => {
    return isShowing
      ? ReactDOM.createPortal(
          <ModalContent
            onClose={onClose}
            onOk={onOk}
            headerTitle={headerTitle}
            disableClose={disableClose}
            disableOk={disableOk}
          >
            {children}
          </ModalContent>,
          document.body
        )
      : null;
  }
);

export default Modal;
