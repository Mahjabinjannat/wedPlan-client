
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

const bookingSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  eventDate: z.iso.date(),
  eventLocation: z.string().trim().min(2).max(200),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Please sign in first." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid account." },
        { status: 401 }
      );
    }

    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user || user.isBlocked === true || user.role !== "customer") {
      return NextResponse.json(
        { message: "Only active customers can book services." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please provide valid booking details." },
        { status: 400 }
      );
    }

    const { serviceId, eventDate, eventLocation, message } =
      parsed.data;

    const event = new Date(`${eventDate}T00:00:00.000Z`);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (event.getTime() < today.getTime()) {
      return NextResponse.json(
        { message: "Event date cannot be in the past." },
        { status: 400 }
      );
    }

    const service = await db.collection("services").findOne({
      _id: new ObjectId(serviceId),
      status: "approved",
      isActive: true,
    });

    if (!service) {
      return NextResponse.json(
        { message: "This service is unavailable." },
        { status: 404 }
      );
    }

    const vendorId = String(service.vendorId ?? "");

    if (!ObjectId.isValid(vendorId)) {
      return NextResponse.json(
        {
          message:
            "This service is not linked to a valid vendor account.",
        },
        { status: 409 }
      );
    }

    const vendor = await db.collection("user").findOne({
      _id: new ObjectId(vendorId),
      role: "vendor",
      isBlocked: { $ne: true },
    });

    if (!vendor) {
      return NextResponse.json(
        { message: "The vendor is currently unavailable." },
        { status: 409 }
      );
    }

    const bookings = db.collection("bookings");

    // Prevent another active (pending or accepted) request
    // for the same customer, service and event date.
    const existing = await bookings.findOne({
      customerId: session.user.id,
      serviceId,
      eventDate,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            "You already have an active booking for this service and date.",
        },
        { status: 409 }
      );
    }

    const now = new Date();

    const result = await bookings.insertOne({
      customerId: session.user.id,
      customerName: user.name,
      customerEmail: user.email,

      vendorId,
      vendorName: service.vendorName ?? vendor.name,

      serviceId,
      serviceName: service.serviceName,
      servicePrice: service.price,

      eventDate,
      eventLocation,
      message: message ?? "",

      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        message: "Booking request submitted successfully.",
        bookingId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      { message: "Failed to create booking." },
      { status: 500 }
    );
  }
}
