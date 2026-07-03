"use client";

import { useEffect, useMemo, useState } from "react";

import FeaturedAdvocates from "@/components/FeaturedAdvocates";
import AdvocateGrid from "@/components/AdvocateGrid";
import HomepageHero from "@/components/HomepageHero";
import SearchBar from "@/components/SearchBar";
import {
  getFeaturedAdvocates,
  getHomepageSpecialties,
} from "@/lib/homepage-trust";
import type { Advocate } from "@/types/advocate";

interface AdvocateResponse {
  data: Advocate[];
  pagination: {
    count: number;
    page: number;
    pageSize: number;
    pageTotal: number;
  };
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [homepagePreviewAdvocates, setHomepagePreviewAdvocates] = useState<
    Advocate[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAdvocates, setTotalAdvocates] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [advocatesPerPage, setAdvocatesPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;

    async function loadAdvocates() {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: advocatesPerPage.toString(),
          sortBy: "yearsOfExperience",
          sortOrder,
        });

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        const response = await fetch(`/api/advocates?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = (await response.json()) as AdvocateResponse;

        if (cancelled) {
          return;
        }

        setAdvocates(jsonResponse.data);
        setTotalAdvocates(jsonResponse.pagination.count);
        setTotalPages(jsonResponse.pagination.pageTotal);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch advocates:", error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAdvocates();

    return () => {
      cancelled = true;
    };
  }, [advocatesPerPage, currentPage, searchTerm, sortOrder]);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepagePreview() {
      try {
        const params = new URLSearchParams({
          page: "1",
          pageSize: "100",
          sortBy: "yearsOfExperience",
          sortOrder: "desc",
        });

        const response = await fetch(`/api/advocates?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = (await response.json()) as AdvocateResponse;

        if (!cancelled) {
          setHomepagePreviewAdvocates(jsonResponse.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch homepage preview advocates:", error);
        }
      }
    }

    void loadHomepagePreview();

    return () => {
      cancelled = true;
    };
  }, []);

  const homepageSpecialties = useMemo(
    () => getHomepageSpecialties(homepagePreviewAdvocates),
    [homepagePreviewAdvocates],
  );

  const featuredAdvocates = useMemo(
    () => getFeaturedAdvocates(homepagePreviewAdvocates),
    [homepagePreviewAdvocates],
  );

  const handleSearch = (term: string) => {
    const normalizedTerm = term.trim();

    setSearchInput(term);
    setSearchTerm(normalizedTerm);
    setCurrentPage(1);
  };

  const handleSpecialtySelect = (specialty: string) => {
    setSearchInput(specialty);
    setSearchTerm(specialty);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showTrustContent = !searchTerm;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ec_0%,#fffdf9_28%,#f8fafc_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <HomepageHero
          specialties={homepageSpecialties}
          onSpecialtySelect={handleSpecialtySelect}
        />

        <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Search advocates
              </p>
              <h2 className="text-2xl font-semibold text-slate-950">
                Search by specialty, city, degree, or advocate name.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Keep the specialty proof in view, then search the full directory
                when you are ready to narrow your options.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <span className="font-semibold">{totalAdvocates}</span> advocates
              available in current results
            </div>
          </div>

          <div className="mt-6">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
        </section>

        {showTrustContent && (
          <FeaturedAdvocates advocates={featuredAdvocates} />
        )}

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2 text-sm text-slate-600">
              {searchTerm ? (
                <p>
                  Showing specialty-aware matches for{" "}
                  <span className="font-semibold text-slate-950">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </p>
              ) : (
                <p>
                  Browse the full directory after reviewing featured specialty
                  matches above.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="perPage"
                className="text-sm font-medium text-slate-700"
              >
                Per page:
              </label>
              <select
                id="perPage"
                value={advocatesPerPage}
                onChange={(event) => {
                  setAdvocatesPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          <AdvocateGrid
            advocates={advocates}
            isLoading={isLoading}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {!isLoading && totalPages > 1 && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNum) => {
                      const showPage =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 2 &&
                          pageNum <= currentPage + 2);

                      if (!showPage) {
                        if (
                          pageNum === currentPage - 3 ||
                          pageNum === currentPage + 3
                        ) {
                          return (
                            <span
                              key={pageNum}
                              className="px-2 text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }

                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-slate-600">
                Page {currentPage} of {totalPages} ({totalAdvocates} total
                advocates)
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
