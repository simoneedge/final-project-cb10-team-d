import mongoose from "mongoose";
import Event, { IEvent } from "@/app/(models)/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verifica che l'ID sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("ID non valido:", id);
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    const event: IEvent | null = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Evento non trovato" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}

/* import Event, { IEvent } from "@/app/(models)/Event";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("ID non valido:", id);
            return NextResponse.json({ error: "ID non valido" }, { status: 400 });
        }

        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);


        const event: IEvent | null = await Event.findById(objectId);
        console.log(event);
        return NextResponse.json({ event }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })

    }
} */
