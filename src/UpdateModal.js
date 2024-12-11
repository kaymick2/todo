import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './UpdateModal.css';

const UpdateModal = ({ isOpen, onClose, onUpdate, item }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (item) {
      setText(item.text || '');
    }
  }, [item]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (item && item.id) {
      onUpdate(item.id, text);
    }
  };

  return ReactDOM.createPortal(
    <div className="backdrop">
      <div className="cart">
        <h2>Update Item</h2>
        <div className="row1">
          <div>Text:</div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="row2">
          <button className="close" onClick={onClose}>Close</button>
          <button className="update" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default UpdateModal;
