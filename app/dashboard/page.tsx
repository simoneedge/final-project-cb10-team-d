'use client';

import React, { useEffect, useState } from 'react';
import { IEvent } from '../(models)/Event';

function Dashboard() {
    const [cards, setCards] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchCards = async (): Promise<void> => {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Filtra le card con reviewed = false
            const filteredCards = data.events.filter((event: IEvent) => event.reviewed === false);
            setCards(filteredCards);
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (eventId: string): Promise<void> => {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewed: true }),
            });

            if (!response.ok) {
                throw new Error(`Failed to publish event. Status: ${response.status}`);
            }

            // Rimuovi l'evento dalla lista una volta pubblicato
            setCards(prevCards => prevCards.filter(event => String(event._id) !== String(eventId)));
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const handleRemove = async (eventId: string): Promise<void> => {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to remove event. Status: ${response.status}`);
            }

            // Rimuovi l'evento dalla lista una volta rimosso
            setCards(prevCards => prevCards.filter(event => String(event._id) !== String(eventId)));
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div>Error: {errorMessage}</div>;

    return (
        <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="pl-2 py-2 text-left">Immagine</th>
                        <th scope="col" className="py-2 text-left">Titolo evento</th>
                        <th scope="col" className="px-2 py-2 text-left">Data inizio</th>
                        <th scope="col" className="px-2 py-2 text-left">Data fine</th>
                        <th scope="col" className="pl-2 py-2 text-left">Location</th>
                        <th scope="col" className="pl-2 py-2 text-left">Tag</th>
                        <th scope="col" className="pl-2 py-2 text-left">Prezzo</th>
                        <th scope="col" className="px-2 py-2 text-left">Azione</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map((product: IEvent) => (
                        <React.Fragment key={product._id}>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="p-2 text-left">
                                    <img src={product.image} className="w-16 md:w-32 max-w-full max-h-full" alt={product.title} />
                                </td>
                                <td className="py-2 font-semibold text-gray-900 text-left">{product.title}</td>
                                <td className="py-2 text-left">
                                    <span className="font-semibold text-gray-900">{product.dateStart}</span>
                                </td>
                                <td className="py-2 font-semibold text-gray-900 text-left">{product.dateEnd}</td>
                                <td className="px-2 py-2 text-left">{product.location}</td>
                                <td className="px-2 py-2 text-left">
                                    {Array.isArray(product.tag) ? (
                                        product.tag.map((tag, index) => (
                                            <span key={index} className="inline-block bg-gray-200 text-gray-800 px-1 py-1 rounded-full mr-1">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span>{product.tag}</span>
                                    )}
                                </td>
                                <td className="px-2 py-2 text-left">{product.price}</td>
                                <td className="px-2 py-2 text-left">
                                    <button
                                        onClick={() => handlePublish(String(product._id))} // Assicurati di usare product._id
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded mr-2"
                                    >
                                        Pubblica
                                    </button>
                                    <button
                                        onClick={() => handleRemove(String(product._id))} // Aggiungi qui la logica per rimuovere l'evento
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                                    >
                                        Rimuovi
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-gray-100">
                                <td colSpan={8} className="p-4">
                                    <p className="text-gray-700">{product.description}</p>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
