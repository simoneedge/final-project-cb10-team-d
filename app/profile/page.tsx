"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseconfig"; // Assicurati di importare db
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import ArrowButton from "../../src/components/ArrowButton";
import Card from "@/src/components/Card";

interface Card {
  id: number;
  title: string;
  image: string;
  color: string;
}

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const router = useRouter();
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);

  // Funzione per recuperare i preferiti dell'utente
  const fetchFavorites = useCallback(async (email: string | null) => {
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const favoriteTitle = data.profile.events.map(
        (event: { title: string }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  }, []);

  // Funzione per recuperare le card
  const fetchCards = useCallback(async (email: string | null) => {
    try {
      if (email) {
        const response = await fetch(`/api/profiles?email=${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data.profile.events);
      } else {
        console.error("Email utente non trovata");
      }
    } catch (error) {
      console.error("Errore nel recupero delle card:", error);
    }
  }, []);

  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName);
        setUserLastName(userData.lastName);
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };

  // Effetto per gestire l'autenticazione e il caricamento dei dati utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.uid);
        fetchCards(user.email);
        fetchFavorites(user.email);  // Aggiungi qui la fetch dei preferiti
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router, fetchCards, fetchFavorites]);

  // Funzione per aggiornare le card dopo l'interazione
  const handleUpdate = useCallback(async () => {
    if (userEmail) {
      await fetchCards(userEmail); // Fetch cards after updating favorites
    }
  }, [userEmail, fetchCards]);

  // Funzione per mostrare o nascondere l'accordion
  const toggleAccordion = () => {
    setShowAccordion(!showAccordion);
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Sezione di Benvenuto */}
      <div className="mt-4 text-center flex justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Ciao {userName} {userLastName}
        </h2>
        <button onClick={toggleAccordion} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#822225"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>

      {/* Accordion delle Preferenze */}
      {showAccordion && (
        <div className="mt-4 border-2 border-rosso p-4 bg-gray-100 text-gray-900 relative shadow-md max-w-lg mx-auto">
          <button
            className="absolute top-2 right-2 text-red-600"
            onClick={toggleAccordion}
          >
            &times;
          </button>
          <h3 className="text-2xl font-semibold text-rosso mb-4">
            Preferenze account
          </h3>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-rosso">Dati Personali</h4>
            <p className="mt-2">
              <strong>Nome:</strong> {userName}
            </p>
            <p>
              <strong>Cognome:</strong> {userLastName}
            </p>
            <p>
              <strong>Email:</strong> {userEmail}
            </p>
          </div>
        </div>
      )}

      {/* Pulsanti */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-center space-x-0 space-y-4 md:space-y-0 md:space-x-4">
        <Link href="/propose">
          <button className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold transition-colors duration-300 w-full md:w-auto">
            Proponi evento
          </button>
        </Link>
        <button className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold transition-colors duration-300 w-full md:w-auto">
          Eventi preferiti
        </button>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            eventId={card.id}
            key={card.title}  // Usa il titolo come chiave univoca
            backgroundColor={card.color}
            title={card.title || "No title available"}
            imageSrc={card.image || "default-image-url"}
            link={
              <Link href={`/food/${card.id}`}>
                <ArrowButton />
              </Link>
            }
            isLiked={favoriteEventTitle.includes(card.title)}  // Usa il titolo per controllare se è piaciuto
            onHeartClick={async () => {
              await fetchFavorites(getAuth().currentUser?.email || ""); // Ricarica i preferiti dopo il click
              handleUpdate();  // Aggiorna anche le card
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
