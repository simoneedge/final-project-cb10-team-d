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
Scrivi due articoli giornalistico dettagliato per un evento intitolato "${title}" che si terrà a "${location}" dal ${dateStart} al ${dateEnd}.
Il primo articolo deve riguardare '${location}' e deve essere incentrato sul territorio (aspetti naturalistici, punti di interesse..)
Il secondo articolo deve riguardare '${title}' analizza quali sono le caratteristiche dell'evento e realizza un articolo che ne approfondisca gli aspetti principali descritti
qui: ${description}
Gli'articoli devono seguire questa struttura:
1. Titolo dell'articolo: Usa un titolo accattivante che descriva l'articolo.
2. Introduzione: Una breve introduzione che catturi l'attenzione del lettore e fornisca una panoramica dell'argomento.
3. Descrizione dettagliata: Descrivi l'argomento, includendo il contesto, e gli aspetti più interessanti.
4. Tesi: Argomenta i motivi per cui questo articolo è importante o interessante per il pubblico.
7. Riferimenti: Aggiungi citazioni o fonti, se rilevante.
8. Conclusione: Offri una chiusura coinvolgente, con una chiamata all'azione per partecipare all'evento.
9. Il testo e i paragrafi non devono superare i 400 caratteri.
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
