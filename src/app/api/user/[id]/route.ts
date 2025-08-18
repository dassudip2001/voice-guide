import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET /api/user/[id]
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
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// DELETE /api/user/[id]
export async function DELETE(
    req: NextRequest,
    props:{params:Promise<{id:string}>}
){
    try {
        const {id} = await props.params;
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 });
        }
        await User.deleteOne({ _id: id });
        return NextResponse.json(
            { message: "user deleted successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user", success: false },
            { status: 500 }
        );
    }
}

// PUT /api/user/[id]
export async function PUT(
    req: NextRequest,
    props:{params:Promise<{id:string}>}
){
    try {
        const {id} = await props.params;
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 });
        }
       const body = await req.json();
       if(body.password){
        body.password = bcrypt.hashSync(body.password, 10);
       }
       
       await User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
       return NextResponse.json({ message: "user updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user", success: false },
            { status: 500 }
        );
    }
}