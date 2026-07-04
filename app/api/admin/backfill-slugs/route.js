/**
 * app/api/admin/backfill-slugs/route.js
 *
 * One-shot admin API to generate slugs for all products that don't have one.
 * The productModel pre-save hook only fires on document.save() — existing
 * products created before the slug field was added have no slug, so their
 * sitemap URLs use MongoDB ObjectIds instead of human-readable paths.
 *
 * HOW TO RUN (one time only):
 *   POST https://www.moinabadfarmstays.com/api/admin/backfill-slugs
 *   Header: x-admin-secret: <your ADMIN_SECRET env var>
 *
 * After running, all resort URLs in the sitemap will use slugs like:
 *   /resorts/green-valley-farmhouse-moinabad
 * instead of:
 *   /resorts/69e3c317af4f8585bad5febc
 */

import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { slugify } from "@/app/utils/slugify";

// Simple secret guard — set ADMIN_SECRET in your Vercel env vars
const ADMIN_SECRET = process.env.ADMIN_SECRET || "moinabad-admin-2026";

export async function POST(req) {
  // Auth check
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Find all products missing a slug
    const products = await productModel
      .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] })
      .select("_id title slug")
      .lean();

    if (products.length === 0) {
      return NextResponse.json({ message: "All products already have slugs.", updated: 0 });
    }

    const results = [];
    const usedSlugs = new Set(
      (await productModel.find({ slug: { $exists: true, $ne: null } }).select("slug").lean())
        .map((p) => p.slug)
    );

    for (const product of products) {
      let base = slugify(product.title);
      if (!base) base = product._id.toString();

      // Ensure uniqueness
      let candidate = base;
      let counter = 1;
      while (usedSlugs.has(candidate)) {
        candidate = `${base}-${counter++}`;
      }
      usedSlugs.add(candidate);

      await productModel.updateOne(
        { _id: product._id },
        { $set: { slug: candidate } }
      );

      results.push({ id: product._id, title: product.title, slug: candidate });
    }

    return NextResponse.json({
      message: `Backfilled ${results.length} slugs successfully.`,
      updated: results.length,
      slugs: results,
    });
  } catch (error) {
    console.error("Slug backfill error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Reject GET requests — this should never be called accidentally
export async function GET() {
  return NextResponse.json(
    { error: "Use POST with x-admin-secret header." },
    { status: 405 }
  );
}
