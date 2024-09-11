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
