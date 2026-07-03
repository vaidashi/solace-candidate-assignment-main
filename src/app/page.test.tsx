import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

const baseResponse = {
  data: [
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
  ],
  pagination: {
    count: 3,
    page: 1,
    pageSize: 12,
    pageTotal: 1,
  },
};

describe("Home page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = input.toString();
        const isSpecialtySearch = url.includes("search=Trauma+%26+PTSD");

        return Promise.resolve({
          ok: true,
          json: async () =>
            isSpecialtySearch
              ? {
                  ...baseResponse,
                  data: [baseResponse.data[0]],
                  pagination: {
                    ...baseResponse.pagination,
                    count: 1,
                  },
                }
              : baseResponse,
        });
      }),
    );

    window.scrollTo = vi.fn();
  });

  it("renders specialty-first trust content before search", async () => {
    render(<Home />);

    expect(
      await screen.findByText(
        "Find the right healthcare advocate by care need, not by guesswork.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Trauma & PTSD" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Examples of specialty-aligned advocates you can contact today.",
      ),
    ).toBeInTheDocument();
  });

  it("uses specialty chips to hand off into search", async () => {
    render(<Home />);

    const chip = await screen.findByRole("button", { name: "Trauma & PTSD" });
    fireEvent.click(chip);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Trauma & PTSD")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=Trauma+%26+PTSD"),
      );
    });

    expect(
      await screen.findByText(/Showing specialty-aware matches for/i),
    ).toBeInTheDocument();
  });
});
