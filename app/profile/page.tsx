'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseconfig'; // Assicurati di importare db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import HeartButton from '@/src/components/HeartButton';
import ArrowButton from '@/src/components/ArrowButton';

interface Card {
  id: string;
  title: string;
  image: string;
}

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const router = useRouter();

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
        console.error('Email utente non trovata');
      }
    } catch (error) {
      console.error('Errore nel recupero delle card:', error);
    }
  }, []);

  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName);
        setUserLastName(userData.lastName);
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati utente:', error);
    }
  };

  // Effetto per gestire l'autenticazione e il caricamento dei dati utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.uid);
        fetchCards(user.email);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router, fetchCards]);

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
    <div className="p-4 bg-bianco min-h-screen">
      <div className="mt-4 text-center flex justify-center items-center">
        <h2 className="text-xl font-titolo text-foreground">
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

      {showAccordion && (
        <div className="mt-4 border-2 border-rosso p-4 bg-gray-100 text-foreground relative shadow-md max-w-xs mx-auto">
          <button
            className="absolute top-2 right-2 text-rosso"
            onClick={toggleAccordion}
          >
            &times;
          </button>
          <h3 className="text-2xl font-titolo text-rosso mb-2">
            Preferenze account
          </h3>
          <div className="mb-4">
            <h4 className="text-md font-titolo text-rosso">Dati Personali</h4>
            <p className="font-testo mt-2">
              <strong>Nome:</strong> {userName}
            </p>
            <p className="font-testo">
              <strong>Cognome:</strong> {userLastName}
            </p>
            <p className="font-testo">
              <strong>Email:</strong> {userEmail}
            </p>
          </div>
        </div>
      )}

<div className="mt-4 flex flex-row items-center justify-center space-x-4">
  <Link href="/propose">
    <button className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold">
      Proponi evento
    </button>
  </Link>
  <button className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold">
    Eventi preferiti
  </button>
</div>


      <div className="mt-6 grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="overflow-hidden shadow-lg relative max-w-xs bg-bianco">
            <div className="relative">
              <div className="clip-path-bottom">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover w-full h-[200px]"
                />
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <HeartButton
                  onClick={handleUpdate} 
                  title={card.title}
                  image={card.image}
                  eventId={card.id}
                  color="#822225"
                />
              </div>
            </div>
            <div
              className="diagonal-line-container p-3 text-white relative"
              style={{ backgroundColor: '#822225' }}
            >
              <div className="diagonal-line-top"></div>
              <h2 className="text-[16px] font-titolo mt-4">{card.title}</h2>
              <div className="absolute bottom-2 right-2 cursor-pointer">
                <ArrowButton />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
