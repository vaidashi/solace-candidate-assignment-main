import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FeaturedAdvocates from "@/components/FeaturedAdvocates";

describe("FeaturedAdvocates", () => {
  it("renders advocate trust cards with visible specialties", () => {
    render(
      <FeaturedAdvocates
        advocates={[
          {
            firstName: "Jordan",
            lastName: "Lee",
            city: "New York",
            degree: "MD",
            specialties: ["Trauma & PTSD", "LGBTQ"],
            yearsOfExperience: 12,
            phoneNumber: 5551111111,
          },
        ]}
      />,
    );

    expect(
      screen.getByText(
        "Examples of specialty-aligned advocates you can contact today.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Jordan Lee")).toBeInTheDocument();
    expect(screen.getByText("Trauma & PTSD")).toBeInTheDocument();
  });
});
