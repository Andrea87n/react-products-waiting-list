import dbConnect from "@/lib/mongodb";
import WaitingList from "@/models/WaitingList";

export async function GET() {
  try {
    await dbConnect();

    const stats = await WaitingList.aggregate([
      { $group: { _id: "$productId", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    return Response.json({ ok: true, stats });
  } catch (err) {
    console.error("POPULAR ERROR:", err);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
