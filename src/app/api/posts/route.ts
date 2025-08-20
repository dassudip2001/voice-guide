import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// GET /api/posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const pipeline: any[] = [
      {
        $sort: { createdAt: -1 as const }
      },
      {
        $lookup: {
          from: 'categories', 
          localField: 'category',
          foreignField: '_id',
          as: 'category'
      }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
      }
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
      }
      },
      {
        $unwind: {
          path: '$artist',
          preserveNullAndEmptyArrays: true
      }
      }
    ];

    const response = await Post.aggregate(pipeline);
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.log("Error in GET /api/posts:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const body = await request.json();

    const post = new Post({
      ...body,
      userId: session.user.id,
    });

    await post.save();

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in POST /api/posts:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
