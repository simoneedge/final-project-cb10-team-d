import { GET, IEvent } from "../api/events/route";

export default async function Home() {

    let response;
    let events: IEvent[] = [];
    let errorMessage: string | null = null;

    try {
        response = await GET();

        // Verifica se la risposta contiene eventi
        if ('events' in response && Array.isArray(response.events)) {
            events = response.events;
        } else {
            errorMessage = 'Invalid response format';
        }
    } catch (error) {
        console.error('Errore durante il fetch:', error);
        errorMessage = 'Failed to load events';
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {errorMessage ? (
                <div>
                    <p>Error loading events: {errorMessage}</p>
                </div>
            ) : events.length > 0 ? (
                events.map((e: IEvent) => (
                    <div key={e._id} className="p-4 bg-white shadow-md rounded-lg">
                        <h2>{e.title || 'No title available'}</h2>
                        <h3>{e.longTitle || 'No long title available'}</h3>
                        {e.image && <img src={e.image} alt={e.title || 'Event image'} />}
                        {e.tag && e.tag.map((t, i) => {
                            return <p key={i}>{t}</p>;
                        })
                        }
                        <p>{e.description || 'No description available'}</p>
                        <p>{e.date || 'No date available'}</p>
                        <p>{e.price || 'No price available'}</p>
                    </div>
                ))
            ) : (
                <p>No events available</p>
            )}
        </div>
    );
}