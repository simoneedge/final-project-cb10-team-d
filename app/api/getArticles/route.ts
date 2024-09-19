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
Scrivi un articolo giornalistico dettagliato per un evento intitolato "${title}" che si terrà a "${location}" dal ${dateStart} al ${dateEnd}.
L'articolo deve seguire questa struttura:
1. Titolo dell'evento: Usa un titolo accattivante che descriva l'evento.
2. Introduzione: Una breve introduzione che catturi l'attenzione del lettore e fornisca una panoramica dell'evento.
3. Descrizione dettagliata: Descrivi l'evento, includendo il contesto, il pubblico a cui è rivolto e gli aspetti più interessanti. Aggiungi dettagli su ${category}.
4. Tesi: Argomenta i motivi per cui questo evento è importante o interessante per il pubblico.
5. Antitesi: Descrivi eventuali sfide o potenziali svantaggi dell'evento, offrendo una visione equilibrata.
6. Dettagli pratici: Fornisci informazioni utili come prezzo, luogo, orari, e qualsiasi altro dettaglio pratico (ad esempio, trasporti, accessibilità).
7. Riferimenti: Aggiungi citazioni o fonti, se rilevante.
8. Conclusione: Offri una chiusura coinvolgente, con una chiamata all'azione per partecipare all'evento.
9. Il testo e i paragrafi non devono superare i 400 caratteri.

Dettagli aggiuntivi da includere nell'articolo: ${description}.
`;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      throw new Error("Chiave API mancante.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const output = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (output) {
      return NextResponse.json({ ok: true, article: output });
    } else {
      throw new Error("Nessun articolo generato.");
    }
  } catch (error: any) {
    console.error("Errore API:", error.message || error);
    return NextResponse.json(
      { ok: false, message: error.message || "Errore interno del server." },
      { status: 500 }
    );
  }
}
