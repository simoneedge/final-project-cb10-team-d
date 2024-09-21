'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseconfig'; // Assicurati che Firestore sia correttamente importato
import { doc, setDoc } from 'firebase/firestore'; // Importa Firestore per gestire i documenti
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPass.trim() ||
    password !== confirmPass;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene la richiesta GET predefinita del form
    e.stopPropagation(); // Ferma l'eventuale propagazione dell'evento
    if (isSubmitting) return; // Evita doppi submit

    setIsSubmitting(true); // Imposta il flag di submit
    setError(null); // Resetta l'errore all'inizio del submit

    if (formValidation) {
      setError('Please fill out all fields correctly.');
      toast.error('Please fill out all fields correctly.');
      setIsSubmitting(false); // Resetta il flag

      return;
    }

    try {
      // Crea l'utente con email e password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Aggiungi nome, cognome ed email a Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        active: true,
      });

      toast.success('Registrazione effettuata con successo!');

      // Reindirizza alla home "/" dopo 2 secondi
      setTimeout(() => {
        setIsSubmitting(false); // Resetta il flag prima di reindirizzare

        router.push('/');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          setError('Email già registrata. Prova a effettuare il login.');
          toast.error('Email già registrata. Prova a effettuare il login.');
          return; // Aggiungi un return qui per evitare doppi trigger

        } else {
          setError(error.message);
          toast.error(error.message);
          return; // Aggiungi un return qui per evitare doppi trigger

        }
      } else {
        setError('An unknown error occurred.');
        toast.error('An unknown error occurred.');
        return; // Aggiungi un return qui per evitare doppi trigger

      }
      setIsSubmitting(false); // Resetta il flag

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-titolo text-rosso mb-6">Registrati</h1>
        {error && (
          <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
            <strong className="font-semibold">Error:</strong>
            <p>{error}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => router.push('/')}>
                Cancel
              </button>
              <button
                type="submit"
                className={`border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold ${formValidation ? 'opacity-100 cursor-not-allowed' : ''
                  }`}
                disabled={formValidation}
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <ToastContainer containerId="toastSignUp"/>
      </div>
    </div>
  );
}
