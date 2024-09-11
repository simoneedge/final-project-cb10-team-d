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
