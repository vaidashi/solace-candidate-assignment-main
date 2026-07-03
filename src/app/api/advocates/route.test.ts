import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/advocates/route";

async function getJson(url: string) {
  const response = await GET(new NextRequest(url));
  return response.json();
}

describe("GET /api/advocates", () => {
  it("returns deterministic fallback advocates without a database", async () => {
    const json = await getJson("http://localhost:3000/api/advocates?page=1&pageSize=12");

    expect(json.data.length).toBeGreaterThan(0);
    expect(json.pagination.count).toBeGreaterThan(0);
    expect(json.data[0].specialties.length).toBeGreaterThan(0);
  });

  it("filters fallback data by specialty search terms", async () => {
    const json = await getJson(
      "http://localhost:3000/api/advocates?page=1&pageSize=12&search=Trauma%20PTSD",
    );

    expect(json.data.length).toBeGreaterThan(0);
    expect(
      json.data.every((advocate: { specialties: string[] }) =>
        advocate.specialties.some((specialty) => specialty.includes("Trauma")),
      ),
    ).toBe(true);
  });

  it("sorts fallback advocates by years of experience", async () => {
    const json = await getJson(
      "http://localhost:3000/api/advocates?page=1&pageSize=12&sortBy=yearsOfExperience&sortOrder=desc",
    );

    expect(json.data[0].yearsOfExperience).toBeGreaterThanOrEqual(
      json.data[1].yearsOfExperience,
    );
  });
});
