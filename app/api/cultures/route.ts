import { NextResponse } from "next/server";
import Culture, { ICulture } from '../../(models)/Culture'


export async function GET() {
    try {
        const cultures: ICulture[] = await Culture.find();

        return NextResponse.json({ cultures }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

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