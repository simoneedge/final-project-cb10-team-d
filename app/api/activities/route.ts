import { NextResponse } from "next/server";
import Activity, { IActivity } from '../../(models)/Activities'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1; // Pagina di default 1
    const limit = Number(searchParams.get('limit')) || 9; // Limite di default 10 per pagina
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare

    try {
        const activities: IActivity[] = await Activity.find()
            .limit(limit)
            .skip(skip);

        const totalActivities = await Activity.countDocuments();

        return NextResponse.json({
            activities,
            totalPages: Math.ceil(totalActivities / limit), // Calcola il numero di pagine totali
            currentPage: page
        }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body: IActivity = await req.json();
        const newEvent = new Activity(body);

        await newEvent.save();
        return NextResponse.json({ event: newEvent }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}
