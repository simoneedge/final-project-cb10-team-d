// /app/api/getArticles/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, location, dateStart, dateEnd, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Parametri mancanti. Assicurati che tutti i campi siano forniti.",
        },
        { status: 400 }
      );
    }
    const prompt = `
Scrivi un articolo giornalistico dettagliati su "${location}".
Il primo articolo riguarda '${location}' e deve essere incentrato sul territorio, includendo aspetti naturalistici, storici, punti di interesse culturale e paesaggistico, attività all’aperto, ecc.
Il secondo articolo riguarda '${title}' e deve analizzare l’evento descrivendo le sue caratteristiche principali. Realizza un articolo che esplori a fondo i dettagli dell’evento e approfondisca tutti gli aspetti principali indicati qui: ${description}.


Struttura dell'articolo (minimo 700 parole):
1. Titolo dell'articolo: Usa un titolo accattivante che descriva in modo chiaro l'articolo.
2. Introduzione (circa 50-100 parole): Scrivi una breve introduzione che catturi l’attenzione del lettore, con una panoramica sull'argomento.
3. Descrizione dettagliata (circa 300-400 parole): Suddividi questa sezione in sottoargomenti che descrivano i punti salienti.
    - Per l'articolo sul territorio, includi sottosezioni come:
      - Aspetti naturalistici (es. flora, fauna, clima)
      - Punti di interesse culturale (es. musei, monumenti storici)
      - Attività e opportunità per i visitatori (es. escursioni, sport)
    - Per l’articolo sull’evento, includi sottosezioni come:
      - Caratteristiche principali dell'evento
      - Obiettivi e scopo
      - Pubblico di riferimento e target
      - Location dell'evento e altre informazioni logistiche
4. Tesi (circa 100-150 parole): Argomenta il perché l’argomento trattato sia interessante o importante per il pubblico.
5. Conclusione (circa 50-100 parole): Chiudi l’articolo con una riflessione o una chiamata all’azione, invitando il lettore a visitare il luogo o partecipare all’evento.
Il testo e i paragrafi devono essere di almeno 500-700 parole.
`;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      throw new Error("Chiave API mancante.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const output = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (output) {
      return NextResponse.json({ ok: true, article: output });
    } else {
      throw new Error("Nessun articolo generato.");
    }
  } catch (error: unknown) {
    console.error("Errore API:", (error as Error).message || error);
    return NextResponse.json(
      { ok: false, message: (error as Error).message || "Errore interno del server." },
      { status: 500 }
    );
  }
}
