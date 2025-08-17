import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Artist from "@/models/Artist";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET /api/artist/[id]
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const artist = await Artist.findOne({ _id: id });
    if (!artist) {
      return NextResponse.json({ error: "artist not found" }, { status: 404 });
    }
    return NextResponse.json({ artist }, { status: 200 });
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist" },
      { status: 500 }
    );
  }
}
