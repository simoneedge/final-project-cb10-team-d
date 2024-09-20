"use client";
import EventForm from "@/src/components/EventForm";
import Button from "@/src/components/Button"; // Importa il componente Button
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/src/components/Modal";

// Funzione per ottenere immagini da Unsplash
const fetchUnsplashImage = async (keywords: string[]): Promise<string> => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const query = keywords.join("+");
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results && data.results.length > 0
      ? data.results[0].urls.regular
      : "";
  } catch (error) {
    console.error("Errore nella fetch di Unsplash", error);
    return "";
  }
};

// Funzione per formattare la data
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  // Gestione del cambio di valore nei campi del form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.name === "category") {
      if (e.target.value === "foods") {
        setColor("#822225");
      } else if (e.target.value === "activities") {
        setColor("#F2B85A");
      } else if (e.target.value === "cultures") {
        setColor("#4E614E");
      }
    }

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestione del cambio nei tag
  const handleTagChange = (tags: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      tag: tags,
    }));
  };

  // Funzione per inviare i dati e creare l'evento
  const handleEventSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      dateStart: formatDate(formData.dateStart),
      dateEnd: formatDate(formData.dateEnd),
    };

    const keywords = [formData.location, formData.title, formData.location];
    const imageUrl = await fetchUnsplashImage(keywords);

    const finalFormData = {
      ...formattedData,
      image: imageUrl || formData.image,
      color,
      reviewed: false,
    };

    setIsSubmitting(true);
    try {
      const [responseEvents] = await Promise.all([
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalFormData),
        }),
      ]);

      if (responseEvents.ok) {
        toast.success("Evento creato con successo!", {
          className: "bg-green-500 text-white p-2 rounded-lg",
        });
        setModalVisible(true); // Mostra la modale
      } else {
        toast.error("Errore nella creazione dell'evento.", {
          className: "bg-red-500 text-white p-2 rounded-lg",
        });
      }
    } catch (error) {
      toast.error("Errore nella creazione dell'evento.", {
        className: "bg-red-500 text-white p-2 rounded-lg",
      });
    } finally {
      setIsSubmitting(false);
      resetForm();
    }
  };

  // Funzione per generare l'articolo
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
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setIsGeneratingArticle(false);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    window.location.href = "/"; // Reindirizza alla homepage
  };
  //io ho anche bisogno che al submit, o campi nel formo vengono resettati
  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      tag: [],
      description: "",
      dateStart: "",
      dateEnd: "",
      price: "",
      location: "",
      category: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative ">
      <div className="p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-rosso text-center font-titolo">
          Proponi Evento
        </h1>
        <EventForm
          formData={formData}
          onChange={handleChange}
          onTagChange={handleTagChange}
          onSubmit={handleEventSubmit} // Submit per creare evento
        />
        <div className="mt-6 flex gap-4 justify-center">npm
          <Button
            label="Crea Evento"
            onClick={(e) => handleEventSubmit(e)}
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
        <Modal isVisible={modalVisible} onClose={handleModalClose} />
        <div className="mt-8 font-titolo">
          {loading && !article ? (
            <div className="p-4 bg-white rounded shadow-md">
              <p className="text-gray-500">Generazione articolo in corso...</p>
            </div>
          ) : article ? (
            <div className="p-6 bg-white rounded shadow-md border border-gray-300">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {formData.title}
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                {new Date().toLocaleDateString("it-IT")}
              </p>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Articolo"
                  className="w-full h-auto mb-4 rounded-lg shadow-lg"
                />
              )}
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
