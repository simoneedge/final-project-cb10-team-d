import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Profile, { IProfile } from "../../(models)/Profile";

export async function GET() {
    try {
        const profiles: IProfile[] = await Profile.find();

        return NextResponse.json({ profiles }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body: IProfile = await req.json();
        const { mail, eventId } = body;

        if (!mail || !eventId) {
            throw new Error("Missing userEmail or eventId in request body");
        }

        // Trova il documento esistente per l'email dell'utente
        let profile = await Profile.findOne({ mail });
        console.log(profile)


        if (profile) {
            // Aggiungi il nuovo eventId se non è già presente
            if (!profile.eventId.includes(eventId)) {
                profile.eventId.push(eventId);
                await profile.save();
                return NextResponse.json({ profile }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Event already added" }, { status: 200 });
            }
        } else {
            // Crea un nuovo documento se non esiste
            profile = new Profile({ mail, eventId: [eventId] });
            await profile.save();
            return NextResponse.json({ profile }, { status: 201 });
        }
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ error: 'Failed to create or update profile', details: error }, { status: 500 });
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