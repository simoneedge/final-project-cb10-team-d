import { IEvent } from '@/app/(models)/Event';

export const getRandomEvents = async (): Promise<{ src: string; caption: string }[]> => {
    try {
        // Fetch gli eventi dall'API interna
        const res = await fetch('http://localhost:3000/api/events', { cache: 'no-cache' });
        const data = await res.json();

        // Seleziona un numero casuale di eventi
        const events: IEvent[] = data.events;
        const randomEvents = events.sort(() => 0.5 - Math.random()).slice(0, 5); 

        // Mappa gli eventi per restituire solo src e caption
        return randomEvents.map(event => ({
            src: event.image || 'default-image-url.jpg', // Imposta una URL di default se l'immagine non è presente
            caption: event.title || 'No title' // Imposta un titolo di default se il titolo non è presente
        }));
    } catch (error: any) {
        throw new Error(`Errore durante il fetch: ${error.message}`);
    }
};
