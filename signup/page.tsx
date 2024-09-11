'use client';

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const auth = getAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailValidation = !email.trim();
  const passwordValidation = !password.trim();
  const confirmPasswordValidation = !confirmPass.trim();
  const arePasswordAndConfirmPassEqual = password === confirmPass;

  const formValidation =
    emailValidation ||
    passwordValidation ||
    confirmPasswordValidation ||
    !arePasswordAndConfirmPassEqual;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidation) {
      setError("Please fill out all fields correctly.");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/signin");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h1>
        {error && (
          <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
            <strong className="font-semibold">Error:</strong>
            <p>{error}</p>
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button
            className={`bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors duration-300 ${formValidation ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={formValidation}
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}