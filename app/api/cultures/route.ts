import { NextResponse } from "next/server";
import Culture, { ICulture } from '../../(models)/Culture'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1; // Pagina di default 1
    const limit = Number(searchParams.get('limit')) || 9; // Limite di default 10 per pagina
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare

    try {
        const cultures: ICulture[] = await Culture.find()
            .limit(limit)
            .skip(skip);
        // Conta il numero totale di attività
        const totalCultures = await Culture.countDocuments();

        return NextResponse.json({
            cultures,
            totalPages: Math.ceil(totalCultures / limit), // Calcola il numero di pagine totali
            currentPage: page
        }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body: ICulture = await req.json();
        const newEvent = new Culture(body);

        await newEvent.save();
        return NextResponse.json({ event: newEvent }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}