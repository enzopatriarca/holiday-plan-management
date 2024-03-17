function SimpleModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}

          <button className="modal-close" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  
  export default SimpleModal;