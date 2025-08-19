import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        
    } catch (error) {
        console.error("Error in POST /api/upload:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}