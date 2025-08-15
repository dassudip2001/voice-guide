import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET /api/category/[id]
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return NextResponse.json(
        { error: "category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/category/[id]
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );
    if (!category) {
      return NextResponse.json(
        { error: "category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "category updated successfully", category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/category/[id]
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectToDatabase();
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return NextResponse.json(
        { error: "category not found" },
        { status: 404 }
      );
    }
    await Category.deleteOne({ _id: id });
    return NextResponse.json(
      { message: "category deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category", success: false },
      { status: 500 }
    );
  }
}
