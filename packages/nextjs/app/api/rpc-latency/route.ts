import { NextResponse } from "next/server";
import { getLatencyData } from "~~/utils/rpc/latency";

export async function GET() {
  try {
    const response = await getLatencyData();

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
      },
    });
  } catch (error) {
    console.error("[API /rpc-latency] Error:", error);
    return NextResponse.json({ error: "Failed to fetch latency data" }, { status: 500 });
  }
}
