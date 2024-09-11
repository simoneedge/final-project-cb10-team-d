import { GET } from "@/app/api/events/route";
import { IEvent } from "@/app/api/events/route";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export default async function Home() {
  let response;
  let events: IEvent[] = [];
  let errorMessage: string | null = null;

  try {
    response = await GET();

    // Verifica se la risposta contiene eventi
    if ("events" in response && Array.isArray(response.events)) {
      events = response.events;
    } else {
      errorMessage = "Invalid response format";
    }
  } catch (error) {
    console.error("Errore durante il fetch:", error);
    errorMessage = "Failed to load events";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Upcoming Events
        </h1>

        {errorMessage ? (
          <div className="text-center text-red-500">
            <p>Error loading events: {errorMessage}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e: IEvent) => (
              <div
                key={e._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden p-6"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {e.title || "No title available"}
                </h2>
                <h3 className="text-lg font-medium text-gray-500 mb-4">
                  {e.longTitle || "No long title available"}
                </h3>

                {e.image && (
                  <div className="mb-4">
                    <img
                      src={e.image}
                      alt={e.title || "Event image"}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}

                {e.tag &&
                  e.tag.map((t, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}

                <p className="text-gray-700 mb-4">
                  {e.description || "No description available"}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Date: {e.date || "No date available"}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Price: {e.price || "No price available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No events available</p>
        )}
      </div>
    </div>
  );
}
