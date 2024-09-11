import { NextResponse } from "next/server";
import Event from '../../(models)/Event'

export interface IEvent {
    _id: string;
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
        const events: IEvent[] = await Event.find();
        return NextResponse.json({ events }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body: IEvent = await req.json();
        const newEvent = new Event(body);
        await newEvent.save();

        return NextResponse.json({ event: newEvent }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}