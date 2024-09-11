import { ICulture } from "../(models)/Culture";

const getData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/cultures', { cache: "no-cache" });
    const data = await res.json();
    console.log("Data fetched from /api/culture:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw Error(error.message)
  }
}

export default async function Home() {
  let { cultures } = await getData();
  console.log("Cultures in frontend:", cultures);  // Log per debug
  let errorMessage: string | null = null;


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {cultures.map((e: ICulture) => (
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
      }
    </div>
  );
}
