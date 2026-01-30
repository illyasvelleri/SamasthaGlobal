import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Masala from "../../../models/masala";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get("bookName");

    const filter = {};
    if (bookName) filter.bookName = bookName;

    const masalas = await Masala.find(filter)
      .sort({ page: 1, index: 1 })
      .limit(500);

    return NextResponse.json({
      success: true,
      count: masalas.length,
      data: masalas,
    });
  } catch (error) {
    console.error("Masala API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch masalas" },
      { status: 500 }
    );
  }
}
