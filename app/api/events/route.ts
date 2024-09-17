import { NextResponse } from "next/server";
import Event, { IEvent } from '../../(models)/Event'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1; // Pagina di default 1
    const limit = Number(searchParams.get('limit')) || 10; // Limite di default 10 per pagina
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare

    try {
        const events: IEvent[] = await Event.find()
            .limit(limit)
            .skip(skip);
        // Conta il numero totale di attività
        const totalEvents = await Event.countDocuments();
        return NextResponse.json({
            events,
            totalPages: Math.ceil(totalEvents / limit), // Calcola il numero di pagine totali
            currentPage: page
        }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

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
        console.log(error)
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}