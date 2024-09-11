import { NextResponse } from "next/server";
import Event from '../../(models)/Event'

export interface IEvent {
    _id?: string;
    name?: string;
    category?: string;
}

export async function GET() {
    try {
        const events: IEvent[] = JSON.parse(JSON.stringify(await Event.find()));
        return { events };  // Restituisce un oggetto con l'array di eventi
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error', error }, { status: 500 });  // Gestione errori
    }
}
