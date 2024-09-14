import { NextResponse } from "next/server";
import Food, { IFood } from '../../(models)/Foods'


export async function GET() {
    try {
        const foods: IFood[] = await Food.find();

        return NextResponse.json({ foods }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body: IFood = await req.json();
        const newEvent = new Food(body);

        await newEvent.save();
        return NextResponse.json({ event: newEvent }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}