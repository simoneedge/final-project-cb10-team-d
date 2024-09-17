"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter per gestire il redirect
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebaseconfig";
import Button from "./Button";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface LoginButtonProps {
  buttonLabel?: string;
  buttonClassName?: string;
  redirectTo?: string;
  onLoginSuccess?: () => void; // Aggiungi il tipo esplicito
}

const LoginButton: React.FC<LoginButtonProps> = ({
  buttonLabel = "ACCEDI",
  buttonClassName = "text-rosso hover:font-bold",
  redirectTo = "/", // Valore di default per il redirect dopo il login
  onLoginSuccess, // Aggiungi questa nuova props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Inizializza useRouter per gestire la navigazione

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
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
      toast.success("Login effettuato con successo!" , {
        className: 'custom-toast-success',
      });
      if (onLoginSuccess) onLoginSuccess(); // Chiama la funzione solo se è definita      router.push(redirectTo); // Effettua il redirect alla pagina specificata
      router.push(redirectTo); // Effettua il redirect alla pagina specificata
    } catch (error) {
      toast.error("Errore di accesso, riprova.", {
        className: 'custom-toast-error',
      });
    }
  };

  const handleLogout = () => {
    signOut(auth);
    toast.info("Logout effettuato con successo!", {
      className: 'custom-toast-info',
    });
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Button
        label={isLoggedIn ? "LOGOUT" : buttonLabel}
        onClick={isLoggedIn ? handleLogout : openModal}
        className={isLoggedIn ? "text-rosso hover:font-bold" : buttonClassName}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative rounded-none">
            <h2 className="font-titolo text-2xl text-rosso font-semibold mb-4">
              Fai il login
            </h2>
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
                className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
              >
                Login
              </button>
            </form>

            <div className="mt-4 w-full m-0 p-0">
              <p className="text-gray-400">
                Non sei ancora registrato?{" "}
                <a
                  href="/signup"
                  className="text-rosso font-bold hover:underline"
                >
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
