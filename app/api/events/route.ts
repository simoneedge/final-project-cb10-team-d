import { NextResponse } from "next/server";
import Event from '../../(models)/Event'

export interface IEvent {
    _id?: string;
    title?: string;
    longTitle?: string;
    image?: string;
    tag?: string[];
    description?: string;
    date?: string;
    price?: string;
    location?: string;

}

export async function GET() {
    try {
        const events: IEvent[] = JSON.parse(JSON.stringify(await Event.find()));
        return { events }; // Restituisce un oggetto con l'array di eventi
    } catch (error) {
        console.error("Errore durante il fetch degli eventi:", error);
        return {
            events: [],
            message: "Error during event fetching",
            error: error instanceof Error ? error.message : "Unknown error",
        }; // Restituisci un oggetto con messaggio d'errore
    }
}
