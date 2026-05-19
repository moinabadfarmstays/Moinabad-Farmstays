/**
 * app/api/blog/route.js — GET all published blog posts
 */
import connectToDatabase from "@/app/utils/configue/db";
import blogModel from "@/app/utils/models/blogModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await blogModel
      .find({ published: true })
      .select("title slug excerpt coverImage author tags readingTime createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
