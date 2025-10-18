import dbConnect from "@/lib/mongodb";
import WaitingList from "@/models/WaitingList";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email)
      return Response.json({ ok: false, message: "Missing email" }, { status: 400 });

    const entries = await WaitingList.find({ email }).sort({ createdAt: -1 });
    return Response.json({ ok: true, entries });
  } catch (err) {
    console.error("WAITINGLIST ADMIN GET ERROR:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}