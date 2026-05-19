/**
 * app/api/blog/[slug]/route.js — GET single blog post by slug
 */
import connectToDatabase from "@/app/utils/configue/db";
import blogModel from "@/app/utils/models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    const post = await blogModel.findOne({ slug, published: true }).lean();

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    blogModel.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).catch(() => {});

    return NextResponse.json({ post }, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" },
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
