import React from 'react';


interface EventFormProps {
  onSubmit?: (data: { nome: string; cognome: string; email: string; settore: string; messaggio: string }) => void;
}

const EventForm = ({ onSubmit }: EventFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      nome: formData.get('nome') as string,
      cognome: formData.get('cognome') as string,
      email: formData.get('email') as string,
      settore: formData.get('settore') as string,
      messaggio: formData.get('messaggio') as string,
    };

   
    if (onSubmit) {
      onSubmit(data);
    }

    form.reset(); 
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2 text-verde">Contattaci</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="settore"
        placeholder="Settore"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="messaggio"
        placeholder="Messaggio"
        className="w-full border p-2 rounded"
        required
      ></textarea>
      <button
        type="submit"
        className="px-4 py-2 bg-rosso text-white rounded hover:bg-rosso-scuro"
      >
        Invia
      </button>
    </form>
  );
};

export default EventForm;
