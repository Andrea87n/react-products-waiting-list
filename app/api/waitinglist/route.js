import dbConnect from "@/lib/mongodb";
import WaitingList from "@/models/WaitingList";


export async function POST(req) {
  try {
    await dbConnect();
    const { productId, email } = await req.json();

    if (!productId || !email) {
      return Response.json({ ok: false, message: "Missing data" }, { status: 400 });
    }

    const exists = await WaitingList.findOne({ productId: String(productId), email});

    if (exists) {
      return Response.json({ ok: false, message: "You have already subscribed this product to the mailing list"}, { status: 400 })
    }

    const entry = await WaitingList.create({ productId: String(productId), email });

    return Response.json({ ok: true, entry });
  } catch (error) {
    console.error("WAITINGLIST ERROR:", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const productId = searchParams.get("productId");

    if (!email)
      return Response.json({ ok: false, message: "Missing email" }, { status: 400 });

    let query = { email };
    if (productId) query.productId = productId;

    const result = await WaitingList.find(query);

    return Response.json({
      ok: true,
      items: result,
      subscribed: productId ? !!result.length : undefined,
    });
  } catch (error) {
    console.log("WAITINGLIST GET ERROR", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();
    const { productId, email } = await req.json();

    if (!productId || !email)
      return Response.json({ ok: false, message: "Missing data" }, { status: 400 });

    const deleted = await WaitingList.deleteOne({ productId, email });

    if (deleted.deletedCount === 0)
      return Response.json({ ok: false, message: "Not found" }, { status: 404 });

    return Response.json({ ok: true });

  } catch (error) {
    console.log("WAITINGLIST DELETE ERROR", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}