import { describe, expect, it } from "vitest";

import {
  getFeaturedAdvocates,
  getHomepageSpecialties,
  homepageSpecialties,
} from "@/lib/homepage-trust";
import type { Advocate } from "@/types/advocate";

const advocates: Advocate[] = [
  {
    firstName: "Jordan",
    lastName: "Lee",
    city: "New York",
    degree: "MD",
    specialties: ["Trauma & PTSD", "LGBTQ"],
    yearsOfExperience: 12,
    phoneNumber: 5551111111,
  },
  {
    firstName: "Casey",
    lastName: "Patel",
    city: "Chicago",
    degree: "PhD",
    specialties: ["Attention and Hyperactivity (ADHD)", "Sleep issues"],
    yearsOfExperience: 8,
    phoneNumber: 5552222222,
  },
  {
    firstName: "Taylor",
    lastName: "Brown",
    city: "Austin",
    degree: "MSW",
    specialties: ["Substance use/abuse", "Chronic pain"],
    yearsOfExperience: 10,
    phoneNumber: 5553333333,
  },
];

describe("homepage trust helpers", () => {
  it("prioritizes curated specialties that exist in the dataset", () => {
    expect(getHomepageSpecialties(advocates)).toEqual(
      homepageSpecialties.slice(0, 3).concat("LGBTQ", "Chronic pain", "Sleep issues"),
    );
  });

  it("returns three deterministic featured advocates without duplicates", () => {
    const featured = getFeaturedAdvocates(advocates);

    expect(featured).toHaveLength(3);
    expect(new Set(featured.map((advocate) => advocate.firstName)).size).toBe(3);
    expect(featured[0].specialties).toContain("Trauma & PTSD");
    expect(featured[1].specialties).toContain("Attention and Hyperactivity (ADHD)");
    expect(featured[2].specialties).toContain("Substance use/abuse");
  });
});
