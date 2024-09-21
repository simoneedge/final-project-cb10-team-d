"use client";
import EventForm from "@/src/components/EventForm";
import Button from "@/src/components/Button";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/src/components/Modal";

interface IFormattedArticleProps {
  article: string;
  setTitles: (titles: string[]) => void;
  setParagraphs: (paragraphs: string[]) => void;
}

function formatArticle(article: string, setTitles: (titles: string[]) => void, setParagraphs: (paragraphs: string[]) => void) {
  if (article) {
    const lines = article.split("\n");
    const titles: string[] = [];
    const paragraphs: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("##")) {
        titles.push(trimmedLine.replace("##", "").trim());
      } else if (trimmedLine.length > 0) {
        paragraphs.push(trimmedLine);
      }
    }

    setTitles(titles);
    setParagraphs(paragraphs);
  }
}

const fetchUnsplashImages = async (queries: string[]): Promise<string[]> => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const images: string[] = [];

  for (const query of queries) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        images.push(data.results[0].urls.regular);
      } else {
        images.push(""); // Se non ci sono immagini
      }
    } catch (error) {
      console.error("Errore nella fetch di Unsplash", error);
      images.push(""); // Aggiungi un'immagine vuota in caso di errore
    }
  }

  return images;
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

  const [article, setArticle] = useState<string>("");
  const [titles, setTitles] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "category") {
      const categoryColors: Record<string, string> = {
        foods: "#822225",
        activities: "#F2B85A",
        cultures: "#4E614E",
      };
      setColor(categoryColors[e.target.value] || "");
    }

    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagChange = (tags: string[]) => {
    setFormData((prevData) => ({ ...prevData, tag: tags }));
  };

  const handleEventSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      dateStart: formatDate(formData.dateStart),
      dateEnd: formatDate(formData.dateEnd),
    };

    const keywords = [formData.location, formData.title];
    const imageUrl = await fetchUnsplashImages(keywords);

    console.log('io sono article', article)
    // Formatta l'articolo e ottieni titoli e paragrafi
    formatArticle(article, setTitles, setParagraphs);
    console.log('io sono titles', titles)
    console.log('io sono paragraphs', paragraphs)
    const articleKeywords = [...titles, ...paragraphs].slice(0, 5); // Ottieni keywords dai titoli e paragrafi
    const arrayImageArticle = await fetchUnsplashImages(articleKeywords);
    console.log('io sono array', arrayImageArticle)

    const finalFormData = {
      ...formattedData,
      image: imageUrl[0] || formData.image,
      color,
      reviewed: false,
      article,
      arrayImageArticle, // Array di immagini per l'articolo
    };

    setIsSubmitting(true);
    try {
      const responseEvents = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });

      if (responseEvents.ok) {
        toast.success("Evento creato con successo!", {
          className: "bg-green-500 text-white p-2 rounded-lg",
        });
        setModalVisible(true);
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
        formatArticle(articleData.article, setTitles, setParagraphs); // Sposta qui
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
    window.location.href = "/";
  };

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
    setArticle("");
    setTitles([]);
    setParagraphs([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative ">
      <div className="p-8 w-full max-w-2xl">
        <h1 className="text-4xl mb-6 text-rosso text-left font-titolo">Proponi Evento</h1>
        <EventForm
          formData={formData}
          onChange={handleChange}
          onTagChange={handleTagChange}
          onSubmit={handleEventSubmit}
        />
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            label="Proponi Evento"
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
        <Modal isVisible={modalVisible} onClose={handleModalClose} />
        <div className="mt-8 font-titolo">
          {loading && !article ? (
            <div className="p-4 bg-white rounded shadow-md">
              <p className="text-gray-500">Generazione articolo in corso...</p>
            </div>
          ) : article ? (
            <div className="p-6 bg-white rounded shadow-md border border-gray-300">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{formData.title}</h1>
              <p className="text-sm text-gray-600 mb-4">{new Date().toLocaleDateString("it-IT")}</p>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Articolo"
                  className="w-full h-auto mb-4 rounded-lg"
                />
              )}
              <div className="prose">
                <div dangerouslySetInnerHTML={{ __html: article }} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
