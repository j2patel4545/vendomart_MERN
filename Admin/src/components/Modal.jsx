import "./Modal.css";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  title = "Modal Title",
  onClose,
  children,
  footer,
  width = "500px",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        <div className="modal-footer">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;
