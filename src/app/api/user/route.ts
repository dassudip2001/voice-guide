import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


// GET /api/user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // connect to the database
        await connectToDatabase();

        const response = await User.find({}).sort({
            createdAt: -1,
        });
        return NextResponse.json({ data: response }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/user:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }

}

// POST /api/user
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body = await req.json();

        const user = new User({
            ...body,
            password: bcrypt.hashSync(body.password, 10),
        });

        await user.save();

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/user:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}