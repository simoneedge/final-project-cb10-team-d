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
