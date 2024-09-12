import { IFood } from "../(models)/Foods";

const getData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/foods", {
      cache: "no-cache",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw Error(error.message);
  }
};

export default async function Home() {
  let { foods } = await getData();
  console.log("Cultures in frontend:", foods); // Log per debug
  let errorMessage: string | null = null;

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {foods.map((e: IFood) => (
          <div key={e._id} className="p-4 bg-white shadow-md rounded-lg">
            <h2>title:{e.title || "No title available"}</h2>
            <h3>title2:{e.longTitle || "No long title available"}</h3>
            {e.image && <img src={e.image} alt={e.title || "Event image"} />}
            {e.tag &&
              e.tag.map((t, i) => {
                return <p key={i}>tag:{t}</p>;
              })}
            <p>description:{e.description || "No description available"}</p>
            <p>data:{e.date || "No date available"}</p>
            <p>price:{e.price || "No price available"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
