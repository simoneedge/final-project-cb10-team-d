'use client'
import { useState } from 'react';

const fetchUnsplashImage = async (keywords: string[]): Promise<string> => {
    const accessKey = 'xrl-d5mGda3B79duvjalC99m_jQ00I3MzfOzrkO5ksM'; // Usa la tua Access Key
    const query = keywords.join('+')
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Prendi il primo risultato dall'array
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular; // URL dell'immagine
        } else {
            return ''; // Nessuna immagine trovata
        }
    } catch (error) {
        console.error('Errore nella fetch di Unsplash', error);
        return '';
    }
};

export default function TestPage() {
    const [formData, setFormData] = useState({
/*         _id: self.crypto.randomUUID(),
 */        title: '',
        longTitle: '',
        image: '',
        tag: [] as string[], // Array di stringhe per i tag
        description: '',
        date: '',
        price: '',
        location: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const keywords = [
            formData.title,
            formData.location,
        ]

        const imageUrl = await fetchUnsplashImage(keywords);

        const updatedFormData = {
            ...formData,
            image: imageUrl || formData.image, // Usa l'URL dell'immagine di Unsplash se disponibile, altrimenti lascia il valore attuale
        };
        console.log('Request size:', JSON.stringify(updatedFormData).length);

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Event created: ", data);
            } else {
                console.error("Failed to create event");
            }
        } catch (error) {
            console.error("Error creating event", error);
        }
    };

    return (
        <div>
            <h1>Create a new Event</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                <input type="text" name="longTitle" placeholder="Long Title" value={formData.longTitle} onChange={handleChange} />
                <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                <input type="text" name="tag" placeholder="Tags (comma-separated)" value={formData.tag.join(',')} onChange={(e) => setFormData({ ...formData, tag: e.target.value.split(',') })} />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleChange} />
                <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
}