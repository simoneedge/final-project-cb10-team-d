import React, { useState } from 'react';
import Button from './Button';

function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // aprire la modale
  const openModal = () => {
    setIsModalOpen(true);
  };

  // chiudere la modale
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <Button label="ACCEDI" onClick={openModal} className='text-rosso hover:font-bold'/>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative rounded-none">
            <h2 className="text-xl text-rosso font-semibold mb-4">Fai il login</h2>
            <p className="mb-4">Inserisci le tue credenziali per accedere.</p>

           
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-rosso font-bold text-xl"
            >
              &times;
            </button>

            {/* Contenuto della modale */}
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 p-2  focus:ring-2 focus:ring-verde"
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 p-2  focus:ring-2 focus:ring-verde"
              />
              <button
                type="submit"
                className="bg-verde text-white p-2  hover:bg-indigo-700"
              >
                Login
              </button>
            </form>

            {/* Link registrazione */}
            <div className="mt-4 w-full m-0 p-0">
              <p className="text-gray-400">
                Non sei ancora registrato?{' '}
                <a href="/signup" className="text-verde font-bold hover:underline">
                  Registrati
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginButton;
