import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(ip);

  if (!limit.allowed) {
    return Response.json(
      { ok: false, message: `Too many attempts. Retry in ${limit.retryAfter}s`},
      { status: 429 }
    )
  }


  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password)
      return Response.json({ ok: false, message: "Missing credentials" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ ok: false, message: "User not found" }, { status: 404 });

    if (user.password !== password)
      return Response.json({ ok: false, message: "Invalid password" }, { status: 401 });

    return Response.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
