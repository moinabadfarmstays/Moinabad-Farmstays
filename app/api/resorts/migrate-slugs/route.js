/**
 * app/api/resorts/migrate-slugs/route.js
 *
 * ONE-TIME migration: generates slugs for all existing resorts.
 * Uses direct updateOne() to bypass the pre-save hook (avoids bundler issues).
 * DELETE this file after running the migration.
 */

import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

// Inline slug generator — no external import, safe from bundler mangling
function makeSlug(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")       // spaces/underscores → hyphen
    .replace(/[^\w-]+/g, "")       // remove non-word chars
    .replace(/--+/g, "-")          // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== "moinabad-migrate-2024") {
    return NextResponse.json(
      { message: "Unauthorized — pass ?secret=moinabad-migrate-2024" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    // Fetch all products without a slug
    const products = await productModel
      .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] })
      .select("_id title")
      .lean();

    const results = [];

    for (const product of products) {
      let slug = makeSlug(product.title);

      // Ensure uniqueness: append short id suffix if slug already exists
      const existing = await productModel.findOne({ slug });
      if (existing && existing._id.toString() !== product._id.toString()) {
        slug = `${slug}-${product._id.toString().slice(-4)}`;
      }

      await productModel.updateOne(
        { _id: product._id },
        { $set: { slug } }
      );

      results.push({ id: product._id, title: product.title, slug });
    }

    return NextResponse.json({
      message: `✅ Migrated ${results.length} resort${results.length !== 1 ? "s" : ""}`,
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
