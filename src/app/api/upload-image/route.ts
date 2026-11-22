
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    // Only signed-in, non-blocked users can upload images
    // (protects the ImgBB API key from being used by anyone).
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Please sign in to upload images." },
        { status: 401 }
      );
    }

    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user || user.isBlocked === true) {
      return NextResponse.json(
        { message: "Your account cannot upload images." },
        { status: 403 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "ImgBB API key is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Unsupported image format." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be smaller than 5MB." },
        { status: 400 }
      );
    }

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: imageFormData,
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      return NextResponse.json(
        { message: "Failed to upload image to ImgBB." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
    });
  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
