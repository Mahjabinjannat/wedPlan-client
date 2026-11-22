
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

export async function POST() {
  try {
    // ==========================================
    // 1. VERIFY AUTHENTICATED USER
    // ==========================================

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // ==========================================
    // 2. VALIDATE USER ID
    // ==========================================

    const userId = session.user.id;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const mongoUserId = new ObjectId(userId);

    // ==========================================
    // 3. FIND USER IN MONGODB
    // ==========================================

    const users = db.collection("user");

    const user = await users.findOne({
      _id: mongoUserId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // ==========================================
    // 4. CHECK EXISTING ROLE
    // ==========================================

    if (user.role === "admin") {
      return NextResponse.json(
        {
          message:
            "Admin accounts cannot be converted to vendor accounts.",
        },
        { status: 403 }
      );
    }

    if (user.role === "vendor") {
      return NextResponse.json(
        {
          message: "You already have a vendor account.",
          role: "vendor",
        },
        { status: 200 }
      );
    }

    if (
      user.role !== "customer" &&
      user.role !== undefined
    ) {
      return NextResponse.json(
        { message: "Role change is not allowed." },
        { status: 403 }
      );
    }

    // ==========================================
    // 5. ONLY ALLOW DURING SIGN UP
    // ==========================================
    // Users must not change their own role later.
    // Vendor activation is only allowed for accounts
    // created in the last 10 minutes (the sign up flow).

    const createdAt = new Date(String(user.createdAt ?? ""));
    const tenMinutes = 10 * 60 * 1000;

    if (
      Number.isNaN(createdAt.getTime()) ||
      Date.now() - createdAt.getTime() > tenMinutes
    ) {
      return NextResponse.json(
        {
          message:
            "Vendor accounts can only be chosen during sign up.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // 6. UPDATE CUSTOMER TO VENDOR
    // ==========================================

    const result = await users.updateOne(
      {
        _id: mongoUserId,
        $or: [
          { role: "customer" },
          { role: { $exists: false } },
        ],
      },
      {
        $set: {
          role: "vendor",
        },
      }
    );

    // ==========================================
    // 7. VERIFY UPDATE
    // ==========================================

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message:
            "Unable to update role. Please try again.",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // 8. SUCCESS RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Vendor account activated successfully.",
        role: "vendor",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Vendor activation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to activate vendor account.",
      },
      { status: 500 }
    );
  }
}
