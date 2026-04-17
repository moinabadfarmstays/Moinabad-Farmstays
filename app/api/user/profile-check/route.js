import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";

/**
 * GET /api/user/profile-check
 * Returns the current user's phone and provider so the client can
 * decide whether to block booking for Google users without a phone.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await userModel.findById(session.user.id).select("phone provider");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      phone: user.phone || "",
      provider: user.provider || "credentials",
    });
  } catch (error) {
    console.error("profile-check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
