// src/components/Login.tsx
"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Importa l'istanza auth inizializzata
import Button from './Button'; // Supponendo che ci sia un componente button riutilizzabile

const LoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsModalOpen(false);
    } catch (error) {
      alert('Errore di accesso, riprova.');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <>
      {isLoggedIn ? (
        <Button label="LOGOUT" onClick={handleLogout} className="text-rosso hover:font-bold" />
      ) : (
        <Button label="ACCEDI" onClick={openModal} className="text-rosso hover:font-bold" />
      )}
      
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

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-verde"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-verde"
              />
              <button
                type="submit"
                className="bg-verde text-white p-2 hover:bg-indigo-700"
              >
                Login
              </button>
            </form>

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
};

export default LoginButton;
