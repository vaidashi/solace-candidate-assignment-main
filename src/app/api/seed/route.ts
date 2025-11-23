import db from "../../../db";
import { advocates, advocateSchema } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // validate advocate data
    advocateData.forEach((advocate) => {
      advocateSchema.parse(advocate);
    });
    const records = await db.insert(advocates).values(advocateData).returning();

    return Response.json({ advocates: records });
  } catch (error) {
    console.error("Error seeding advocates:", error);
    
    if (error instanceof z.ZodError) {
      return new Response("Data Validation Error", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
