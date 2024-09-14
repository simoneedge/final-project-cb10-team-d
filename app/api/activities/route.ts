import { NextResponse } from "next/server";
import Activity, { IActivity } from '../../(models)/Activities'


export async function GET() {
    try {
        const activities: IActivity[] = await Activity.find();

        return NextResponse.json({ activities }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

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
