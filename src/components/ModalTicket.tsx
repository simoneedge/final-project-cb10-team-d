import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faEnvelope, faUser, faTicketAlt } from '@fortawesome/free-solid-svg-icons'; // Aggiungi faTicketAlt per il numero di ticket

const ModalTicket = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    data: '',
    eta: 'adulti',
    orario: '',
    email: '',
    numeroBiglietti: 1 // Campo aggiunto per il numero di biglietti
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content p-6 rounded-lg shadow-lg bg-white w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Prenota il ticket</h2>
        <form className="flex flex-col space-y-4"> {/* Aggiungi flex per migliorare l'allineamento */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600" />
            <label className="flex-1">Data:</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
            <label className="flex-1">Età:</label>
            <select
              name="eta"
              value={formData.eta}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
            >
              <option value="adulti">Adulti</option>
              <option value="bimbi">Bimbi (5-10 anni)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faClock} className="text-gray-600" />
            <label className="flex-1">Orario:</label>
            <select
              name="orario"
              value={formData.orario}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
            >
              <option value="16">16:00</option>
              <option value="17">17:00</option>
              <option value="18">18:00</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />
            <label className="flex-1">Email per conferma:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faTicketAlt} className="text-gray-600" /> {/* Icona per i ticket */}
            <label className="flex-1">Numero di biglietti:</label>
            <input
              type="number"
              name="numeroBiglietti"
              value={formData.numeroBiglietti}
              onChange={handleChange}
              min="1"
              required
              className="flex-1 p-2 border rounded"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Conferma Prenotazione
          </button>
        </form>
        <button
          onClick={onClose}
          className="btn-secondary mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default ModalTicket;
