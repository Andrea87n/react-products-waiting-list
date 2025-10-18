import dbConnect from "@/lib/mongodb";
import WaitingList from "@/models/WaitingList";

export async function GET() {
  // DEBUG: controlla se la variabile è caricata
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length);

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
    console.error("Error stack:", err.stack);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}