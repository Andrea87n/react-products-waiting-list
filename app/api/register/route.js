import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: `Too many attempts. Retry in ${limit.retryAfter}s.` },
      { status: 429 }
    );
  }


  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    // User creation
    const user = await User.create({ name, email, password });

    return NextResponse.json({ ok: true, user })

  } catch (error) {
    console.log("REGISTER ERROR: ", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    )
  }
}