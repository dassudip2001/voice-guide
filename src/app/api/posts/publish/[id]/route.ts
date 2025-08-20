import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { PostStatus } from "@/schema/postSchema";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  console.log(`Publishing post with ID: ${id}`);
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  connectToDatabase();

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    await Post.findOneAndUpdate(
      { _id: id },
      { $set: { status: PostStatus.published } }
    );
    return NextResponse.json({ message: "Post published successfully" });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json(
      { error: "Failed to publish post" },
      { status: 500 }
    );
  }
}
