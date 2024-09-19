import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-center text-verde">Grazie!</h2>
        <p className="mt-4 text-center text-gray-700">
          Grazie per aver proposto il tuo evento. A seguito di un controllo, troverai il tuo evento insieme ai nostri.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-rosso hover:bg-rosso-dark text-white px-4 py-2 rounded-lg"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
