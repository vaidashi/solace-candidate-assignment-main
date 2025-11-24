import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from "next/server";
import { Advocate } from "@/types/advocate";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const degree = searchParams.get("degree");
    const searchQuery = searchParams.get("search"); // General search across multiple fields
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy = searchParams.get("sortBy") || ""; // e.g., "yearsOfExperience"
    const sortOrder = searchParams.get("sortOrder") || "asc"; // "asc" or "desc"

    // type guard for specialty and city
    const data = (await db.select().from(advocates)) as Advocate[];

    let dataResponse = data;

    // Apply filters
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

    if (firstName) {
      dataResponse = dataResponse.filter(
        (advocate) => advocate.firstName?.toLowerCase().includes(firstName.toLowerCase())
      );
    }

    if (lastName) {
      dataResponse = dataResponse.filter(
        (advocate) => advocate.lastName?.toLowerCase().includes(lastName.toLowerCase())
      );
    }

    if (degree) {
      dataResponse = dataResponse.filter(
        (advocate) => advocate.degree?.toLowerCase().includes(degree.toLowerCase())
      );
    }

    // General search across all text fields for multi-field search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase().trim();
      const searchTerms = searchLower.split(/\s+/); // Split by whitespace into individual terms

      dataResponse = dataResponse.filter((advocate) => {
        const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
        const searchableText = [
          fullName,
          advocate.firstName?.toLowerCase() || "",
          advocate.lastName?.toLowerCase() || "",
          advocate.city?.toLowerCase() || "",
          advocate.degree?.toLowerCase() || "",
          ...advocate.specialties.map((s: string) => s.toLowerCase())
        ].join(" ");

        // Every search term must match somewhere in the searchable text
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Apply sorting
    if (sortBy === "yearsOfExperience") {
      dataResponse.sort((a: any, b: any) => {
        const aVal = a.yearsOfExperience || 0;
        const bVal = b.yearsOfExperience || 0;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
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
