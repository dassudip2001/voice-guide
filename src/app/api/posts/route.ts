import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// GET /api/posts
export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const response = await Post.find({}).sort({
            createdAt: -1,
        });
        return NextResponse.json({ data: response }, { status: 200 });
    } catch (error) {
        console.log("Error in GET /api/posts:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}