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


// DELETE /api/artist/[id]
export async function DELETE(
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
    await Artist.deleteOne({ _id: id });
    return NextResponse.json(
      { message: "artist deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Failed to delete artist", success: false },
      { status: 500 }
    );
  }
}

// PUT /api/artist/[id]
export async function PUT(
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
        const body = await req.json();
        await Artist.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
        return NextResponse.json({ message: "artist updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating artist:", error);
        return NextResponse.json(
            { error: "Failed to update artist" },
            { status: 500 }
        );
    }
}
