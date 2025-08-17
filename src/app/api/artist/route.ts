import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Artist from "@/models/Artist";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/artist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // connect to the database
        await connectToDatabase();

        const response = await Artist.find({}).sort({
            createdAt: -1,
        });
        return NextResponse.json({ data: response }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/artist:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }

}

// POST /api/artist
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body = await req.json();

        const artist = new Artist({
            ...body,
            userId: session.user.id,
        });

        await artist.save();

        return NextResponse.json(
            { message: "Artist created successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/artist:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}