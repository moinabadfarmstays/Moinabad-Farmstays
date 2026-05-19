/**
 * app/api/resorts/[slug]/route.js
 *
 * Public GET endpoint for fetching a resort by SEO slug (or _id fallback).
 * Used by the new Server Component detail page for generateMetadata + RSC data.
 *
 * Strategy:
 *   1. Try slug lookup first (production path)
 *   2. If not found, try _id lookup (backward compat for old /detail/[id] links)
 *   3. Attach only upcoming approved bookings (blocked dates for calendar)
 */

import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import bookingModel from "@/app/utils/models/bookingModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic"; // Never cache — booking availability is real-time

export async function GET(request, context) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;

    // Try slug first, then _id (backward compat)
    let product = await productModel.findOne({ slug }).lean();

    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      product = await productModel.findById(slug).lean();
    }

    if (!product) {
      return NextResponse.json({ message: "Resort not found" }, { status: 404 });
    }

    // Attach only upcoming approved bookings for blocked-date UI
    const now = new Date();
    const approvedBookings = await bookingModel
      .find({
        resortRoom: product._id,
        status: "approved",
        endDate: { $gt: now },
      })
      .select("startDate endDate status")
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json(
      {
        product: {
          ...product,
          bookings: approvedBookings,
        },
      },
      {
        status: 200,
        headers: {
          // Revalidate booking availability every 60 seconds via CDN
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[/api/resorts/[slug]] Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
