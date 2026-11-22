
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

interface Context {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  action: z.enum(["cancel", "accept", "reject"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid booking ID." },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user || user.isBlocked === true) {
      return NextResponse.json(
        { message: "Account access restricted." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid booking action." },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

    const customerAction =
      action === "cancel" && user.role === "customer";

    const vendorAction =
      (action === "accept" || action === "reject") &&
      user.role === "vendor";

    if (!customerAction && !vendorAction) {
      return NextResponse.json(
        { message: "You cannot perform this action." },
        { status: 403 }
      );
    }

    const ownershipFilter = customerAction
      ? { customerId: session.user.id }
      : { vendorId: session.user.id };

    const nextStatus =
      action === "cancel"
        ? "cancelled"
        : action === "accept"
          ? "accepted"
          : "rejected";

    const result = await db.collection("bookings").updateOne(
      {
        _id: new ObjectId(id),
        ...ownershipFilter,
        status: "pending",
      },
      {
        $set: {
          status: nextStatus,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          message:
            "Booking not found, not yours, or no longer pending.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: `Booking ${nextStatus} successfully.`,
      status: nextStatus,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    return NextResponse.json(
      { message: "Failed to update booking." },
      { status: 500 }
    );
  }
}
