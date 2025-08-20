/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
interface CloudinaryUploadResponse {
  public_id: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // const loginUser = await currentUser();
    // // check if user is logged in
    // if (!loginUser)
    //   return NextResponse.json(
    //     { error: "User not logged in" },
    //     { status: 401 }
    //   );
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("buffer", buffer);

    const result = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-uploads" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResponse);
          }
        );
        uploadStream.end(buffer);
      }
    );

    //

    return NextResponse.json(
      {
        result,
        publicId: result.secure_url,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}