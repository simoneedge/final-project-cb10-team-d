"use client";
import EventForm from "@/src/components/EventForm";
import Button from "@/src/components/Button"; // Importa il componente Button
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetchUnsplashImage = async (keywords: string[]): Promise<string> => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const query = keywords.join("+");
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Errore nella fetch di Unsplash", error);
    return "";
  }
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function ProposePage() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    tag: [] as string[],
    description: "",
    dateStart: "",
    dateEnd: "",
    price: "",
    location: "",
    category: "",
  });

  const [article, setArticle] = useState<string>(""); // Stato per l'articolo generato
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingArticle, setIsGeneratingArticle] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagChange = (tags: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      tag: tags,
    }));
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determina il colore in base alla categoria selezionata
    let color = "";
    switch (formData.category) {
      case "cultures":
        color = "#4E614E";
        break;
      case "foods":
        color = "#822225";
        break;
      case "activities":
        color = "#F2B85A";
        break;
      default:
        color = ""; // Valore predefinito
    }

    const formattedData = {
      ...formData,
      dateStart: formatDate(formData.dateStart),
      dateEnd: formatDate(formData.dateEnd),
    };

    const keywords = [formData.title, formData.location];
    const imageUrl = await fetchUnsplashImage(keywords);

    const finalFormData = {
      ...formattedData,
      image: imageUrl || formData.image,
      color,
      reviewed: false,
    };

    setIsSubmitting(true);
    try {
      const [responseCategory, responseEvents] = await Promise.all([
        fetch(`/api/${formData.category}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData),
        }),
        fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData),
        }),
      ]);

      if (responseCategory.ok && responseEvents.ok) {
        const dataCategory = await responseCategory.json();
        const dataEvents = await responseEvents.json();
        console.log("Event created in category:", dataCategory);
        console.log("Event created in events:", dataEvents);

        toast.success("Evento creato con successo!", {
          className: "bg-green-500 text-white p-2 rounded-lg",
        });
      } else {
        toast.error("Errore nella creazione dell'evento.", {
          className: "bg-red-500 text-white p-2 rounded-lg",
        });
        console.error("Failed to create event in one or both APIs");
      }
    } catch (error) {
      toast.error("Errore nella creazione dell'evento.", {
        className: "bg-red-500 text-white p-2 rounded-lg",
      });

      console.error("Error creating event", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      dateStart: formatDate(formData.dateStart),
      dateEnd: formatDate(formData.dateEnd),
    };

    setIsGeneratingArticle(true);
    setLoading(true);
    try {
      const response = await fetch("/api/getArticles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const articleData = await response.json();
        setArticle(articleData.article);
        toast.success("Articolo generato con successo!", {
          className: "bg-green-500 text-white p-2 rounded-lg",
        });
      } else {
        throw new Error("Errore nella generazione dell'articolo.");
      }
    } catch (error) {
      toast.error("Errore nella generazione dell'articolo.", {
        className: "bg-red-500 text-white p-2 rounded-lg",
      });
      console.error("Error generating article", error);
    } finally {
      setIsGeneratingArticle(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">
          Proponi Evento
        </h1>
        <EventForm
          formData={formData}
          onChange={handleChange}
          onTagChange={handleTagChange}
          onSubmit={handleEventSubmit}
        />
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            label="Crea Evento"
            onClick={handleEventSubmit}
            className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
            disabled={isSubmitting}
          />
          <Button
            label="Genera Articolo"
            onClick={handleGenerateArticle}
            className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
            disabled={isGeneratingArticle || !formData.title}
            loading={loading}
          />
        </div>

        <div className="mt-8">
          {loading && !article ? (
            <div className="p-4 bg-white rounded shadow-md">
              <p className="text-gray-500">Generazione articolo in corso...</p>
              {/* Aggiungi qui uno skeleton loader se desideri */}
            </div>
          ) : article ? (
            <div className="p-6 bg-white rounded shadow-md border border-gray-300">
              {/* Titolo dell'articolo */}
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {formData.title}
              </h1>

              {/* Data di pubblicazione */}
              <p className="text-sm text-gray-600 mb-4">
                {new Date().toLocaleDateString("it-IT")}
              </p>

              {/* Immagine di copertura (da Unsplash) */}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Articolo"
                  className="w-full h-auto mb-4 rounded-lg shadow-lg"
                />
              )}

              {/* Contenuto dell'articolo */}
              <div className="text-gray-700">
                <p>{article}</p>
              </div>
            </div>
          ) : null}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
