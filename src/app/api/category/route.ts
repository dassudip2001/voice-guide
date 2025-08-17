import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET /api/category
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // connect to the database
    await connectToDatabase();

    const response = await Category.find({}).sort({
      createdAt: -1,
    });
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/category:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

// POST /api/category
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();

    // Validate the request body
    // const safeCategory = CategoryWriteFormSchema.safeParse(body);

    // Create a new category
    const category = new Category({
      ...body,
      userId: session.user.id, // Ensure userId is set from session
    });

    // Save the new category to the database
    await category.save();

    return NextResponse.json(
      { message: "Category created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/category:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
