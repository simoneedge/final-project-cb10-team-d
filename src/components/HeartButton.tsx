import { getAuth } from 'firebase/auth';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface HeartButtonProps {
  eventId?: string;
  title: string | undefined;
  image: string | undefined;
  color: string;
  onUpdate: Dispatch<SetStateAction<boolean>>;


}

const HeartButton: React.FC<HeartButtonProps> = ({ eventId, color, title, image, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleFavoriteClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser; // Ottieni l'utente attuale da Firebase
    if (!user) {
      alert("Devi effettuare il login per aggiungere ai preferiti.");
      return;
    }
    const userEmail = user.email; // Ottieni l'email dell'utente
    console.log(userEmail);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: userEmail,
          events: [{
            id: eventId,
            title: title,
            image: image
          }]
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.message); // Messaggio di successo ("Event added" o "Event removed")
        setIsLiked(!isLiked); // Alterna lo stato del cuoricino
      } else {
        alert("Errore nell'aggiungere ai preferiti.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };


  return (
    <button
      onClick={handleFavoriteClick}
      className="p-1"
      style={{
        backgroundColor: color,
        marginTop: -10
      }}
      title="Heart Button"
    >
      <svg
        className="w-4 h-4 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 115.656 5.656L10 18.828l-6.828-6.828a4 4 0 010-5.656z"></path>
      </svg>
    </button>
  );
};

export default HeartButton;