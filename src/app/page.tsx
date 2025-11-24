"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import SearchBar from "@/components/SearchBar";
import AdvocateGrid from "@/components/AdvocateGrid";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalAdvocates, setTotalAdvocates] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [advocatesPerPage, setAdvocatesPerPage] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch advocates from API with server-side search, pagination, and sorting
  const fetchAdvocates = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: advocatesPerPage.toString(),
        sortBy: "yearsOfExperience",
        sortOrder: sortOrder,
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/advocates?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();

      setAdvocates(jsonResponse.data);
      setTotalAdvocates(jsonResponse.pagination.count);
      setTotalPages(jsonResponse.pagination.pageTotal);
    } catch (error) {
      console.error("Failed to fetch advocates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAdvocates();
  }, [currentPage, advocatesPerPage, sortOrder, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Solace Advocates</h1>
          <p className="text-gray-600">Find experienced healthcare advocates to support your needs</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results count and items per page */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {searchTerm && (
              <p>
                Showing results for: <span className="font-semibold text-gray-900">"{searchTerm}"</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm text-gray-700 font-medium">
              Per page:
            </label>
            <select
              id="perPage"
              value={advocatesPerPage}
              onChange={(e) => {
                setAdvocatesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Advocate Grid */}
        <AdvocateGrid
          advocates={advocates}
          isLoading={isLoading}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Previous
              </button>
              {/* Show the first page, last page, and pages within 2 positions of the current page */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);

                  if (!showPage) {
                    if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
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
                      className={`px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Next
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalAdvocates} total advocates)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

