import { connectDB } from "../../../lib/db";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const action = body.action || "fetch";

    // Ensure MongoDB connection is active
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not ready after connectDB call");
    }

    const db = mongoose.connection.db;
    const collection = db.collection("fiqh_structure");

    console.log(`Querying collection: ${collection.collectionName}`);

    if (action === "fetch") {
      const documents = await collection
        .find({})
        .sort({ order: 1, _id: -1 }) // sort by order (sequential in your saving method)
        .limit(200) // increased limit – adjust as needed
        .toArray();

      console.log(`Found ${documents.length} documents in fiqh_structure`);

      return Response.json({
        status: "success",
        count: documents.length,
        items: documents.map((doc) => ({
          _id: doc._id.toString(),
          bookName: doc.bookName || "—",
          page: doc.page ?? null,             // no page field → null
          index: doc.order ?? null,           // using 'order' from your saving method
          kitab: doc.kitab || "",
          bab: doc.bab || "",
          fasl: doc.fasl || "",
          paragraph: doc.text || "",          // matches your 'text' field
          customId: doc.masalaId || null,     // matches your 'masalaId'
          startChar: doc.startChar ?? null,
          endChar: doc.endChar ?? null,
          createdAt: doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : null,
        })),
      });
    }

    if (action === "update") {
      const {
        _id,
        bookName,
        page,
        index,       // frontend may send as index → map to order
        kitab,
        bab,
        fasl,
        paragraph,   // frontend sends paragraph → map to text
        customId,    // frontend sends customId → map to masalaId
      } = body;

      if (!_id) {
        return Response.json({ error: "Missing _id" }, { status: 400 });
      }

      const updateDoc = {
        $set: {
          updatedAt: new Date(),
        },
      };

      if (bookName !== undefined) updateDoc.$set.bookName = String(bookName).trim();
      if (page !== undefined) updateDoc.$set.page = Number(page) || null;
      if (index !== undefined) updateDoc.$set.order = Number(index) || null; // map to order
      if (kitab !== undefined) updateDoc.$set.kitab = String(kitab).trim();
      if (bab !== undefined) updateDoc.$set.bab = String(bab).trim();
      if (fasl !== undefined) updateDoc.$set.fasl = String(fasl).trim();
      if (paragraph !== undefined) updateDoc.$set.text = String(paragraph).trim();
      if (customId !== undefined) updateDoc.$set.masalaId = String(customId).trim();

      const result = await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        updateDoc
      );

      if (result.matchedCount === 0) {
        return Response.json({ error: "Document not found" }, { status: 404 });
      }

      console.log(`Updated document ${_id} – modified: ${result.modifiedCount}`);

      return Response.json({
        status: "success",
        updatedId: _id,
        modifiedCount: result.modifiedCount,
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("fiqh-admin-review endpoint error:", {
      message: err.message,
      stack: err.stack || "No stack trace",
    });

    return Response.json(
      {
        error: "Server error",
        message: err.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}