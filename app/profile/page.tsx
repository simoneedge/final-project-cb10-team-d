"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth } from '@/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

interface Card {
  id: number;
  title: string;
  image: string;
}

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAccordion, setShowAccordion] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
       
        router.push('/');
      }
    });

   
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards'); 
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Errore nel recupero delle card:', error);
      }
    };

    fetchCards();

    return () => unsubscribe();
  }, [router]);

 
  const toggleAccordion = () => {
    setShowAccordion(!showAccordion);
  };

  return (
    <div className="p-4 bg-bianco min-h-screen">
      <div className="mt-4 text-center flex justify-center items-center">
        <h2 className="text-xl font-titolo text-foreground">
          Ciao {userEmail}
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
        <div className="mt-4 border border-rosso p-4 bg-[#f5f5f5] text-foreground relative rounded-lg shadow-md max-w-xs mx-auto">
          <button
            className="absolute top-2 right-2 text-rosso"
            onClick={toggleAccordion}
          >
            &times;
          </button>
          <h3 className="text-lg font-titolo text-rosso mb-2">
            Preferenze account
          </h3>
          <div className="mb-4">
            <h4 className="text-md font-titolo text-rosso">Dati Personali</h4>
            <p className="font-testo mt-2">
              <strong>Nome:</strong> Mario
            </p>
            <p className="font-testo">
              <strong>Cognome:</strong> Rossi
            </p>
            <p className="font-testo">
              <strong>Email:</strong> mariorossi@gmail.com
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-md font-titolo text-rosso">Gestione Account</h4>
            <p className="font-testo cursor-pointer hover:underline">Modifica account</p>
            <p className="font-testo cursor-pointer hover:underline">Cancella account</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col items-center space-y-4">
        <Link href="/propose">
          <button className="bg-giallo text-white py-2 px-4 rounded font-testo">
            Proponi evento
          </button>
        </Link>
        <button className="bg-rosso text-white py-2 px-4 rounded font-testo">
          Eventi preferiti
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="overflow-hidden shadow-lg relative max-w-xs bg-bianco">
            <div className="relative">
              <div className="clip-path-bottom">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover w-full h-[200px]"
                />
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <HeartButton color="#822225" />
                <BookmarkButton color="#822225" />
              </div>
            </div>
            <div className="diagonal-line-container p-3 text-white relative" style={{ backgroundColor: '#822225' }}>
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
