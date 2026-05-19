/**
 * app/api/resorts/migrate-slugs/route.js
 *
 * ONE-TIME migration script: generates slugs for all existing resorts.
 * Hit GET /api/resorts/migrate-slugs?secret=YOUR_ADMIN_SECRET once after deploy.
 * Delete this file (or add auth guard) afterwards.
 */

import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get("secret");
  // Simple one-time passphrase — delete this file after running the migration
  if (secret !== "moinabad-migrate-2024") {
    return NextResponse.json({ message: "Unauthorized — pass ?secret=moinabad-migrate-2024" }, { status: 401 });
  }


  try {
    await connectToDatabase();

    // Find all products missing a slug
    const products = await productModel.find({ slug: { $in: [null, undefined, ""] } });
    const results = [];

    for (const product of products) {
      // Trigger the pre-save hook by marking title as modified
      product.markModified("title");
      await product.save();
      results.push({ id: product._id, title: product.title, slug: product.slug });
    }

    return NextResponse.json({
      message: `Migrated ${results.length} resorts`,
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
