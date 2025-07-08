import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}  className="fixed inset-0   flex items-center justify-center z-50 pt-6">
      <div  className="bg-gray-800 p-4 rounded-lg shadow-lg w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-3xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
