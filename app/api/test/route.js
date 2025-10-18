import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    return Response.json({ ok: true, message: "MongoDB connected successfully!"});
  }
  catch (error) {
    return Response.json({ ok: false, message: "Failed to connect to MongoDB"});
  }
}