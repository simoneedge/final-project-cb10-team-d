import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Profile, { IProfile } from "../../(models)/Profile";
import { IEvent } from "@/app/(models)/Event";

export async function GET() {
    try {
        const profiles: IProfile[] = await Profile.find();

        return NextResponse.json({ profiles }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: IProfile = await req.json();
        const { mail, events } = body;

        if (!mail || !events || events.length === 0) {
            throw new Error("Missing userEmail or event in request body");
        }

        // Trova il documento esistente per l'email dell'utente
        let profile = await Profile.findOne({ mail });

        if (profile) {
            if (!profile.events) {
                profile.events = []; // Inizializza `events` se non esiste
            }

            const newEvent = events[0]; // Supponiamo che stai inviando un solo evento
            const eventIndex = profile.events.findIndex((e: any) => e.title === newEvent.title);

            if (eventIndex !== -1) {
                // Se l'evento esiste, rimuovilo dall'array
                profile.events.splice(eventIndex, 1);
                await profile.save();
                return NextResponse.json({ message: "Event removed from favorites", profile }, { status: 200 });
            } else {
                // Aggiungi il nuovo evento se non è già presente
                profile.events.push(newEvent);
                await profile.save();
                return NextResponse.json({ message: "Event added to favorites", profile }, { status: 200 });
            }
        } else {
            // Se il profilo non esiste, creane uno nuovo con l'array `events`
            profile = new Profile({ mail, events: events }); // Aggiungi direttamente l'array di eventi
            await profile.save();
            return NextResponse.json({ profile }, { status: 201 });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to create or update profile" }, { status: 500 });
    }
}














/*
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

const profile: IProfile | null = await Profile.findById(id);

if (!profile) {
return NextResponse.json(
    { error: "Profilo non trovato" },
    { status: 404 }
);
}

return NextResponse.json({ profile }, { status: 200 });
} catch (error) {
console.error("Errore nella richiesta:", error);
return NextResponse.json({ error: "Errore del server" }, { status: 500 });
}
} */



/* export async function PUT(req: Request) {
    try {
        const { eventId } = await req.json();
        const user = await Profile.findOne({ userMail: userEmail });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const isFavorite = user.favoriteEvents.includes(eventId);

        if (isFavorite) {
            user.favoriteEvents.pull(eventId);
        } else {
            user.favoriteEvents.push(eventId);
        }

        await user.save();
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update favorites', details: error }, { status: 500 });
    }
}
 */