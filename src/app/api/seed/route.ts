import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const records = await db.insert(advocates).values(advocateData).returning();

    return Response.json({ advocates: records });
  } catch (error) {
    console.error("Error seeding advocates:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
