import { getRandomEvents } from '@/data/eventUtils';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const slides = await getRandomEvents(); 

        return NextResponse.json({ slides }, { status: 200 });
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
    }
}