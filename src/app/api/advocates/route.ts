import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from "next/server";

type Advocate = {
  specialties: string[];
  city: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    // type guard for specialty and city
    const data = (await db.select().from(advocates)) as Advocate[];

    let dataResponse = data;

    if (specialty) {
      dataResponse = dataResponse.filter((advocate) =>
        advocate.specialties.includes(specialty)
      );
    }

    if (city) {
      dataResponse = dataResponse.filter(
        (advocate) => advocate.city.toLowerCase() === city.toLowerCase()
      );
    }

    const count = dataResponse.length;
    const paginatedDataResponse = dataResponse.slice((page - 1) * pageSize, page * pageSize);

    return Response.json({ 
      data: paginatedDataResponse, 
      pagination: {
        page,
        pageSize,
        count,
        pageTotal: Math.ceil(count / pageSize),
      }
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
