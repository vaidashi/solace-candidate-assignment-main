"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/advocate";
import { debounce } from "lodash";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalAdvocates, setTotalAdvocates] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [advocatesPerPage, setAdvocatesPerPage] = useState<number>(10);

  useEffect(() => {
    console.log("fetching advocates...");

    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advocates?pageSize=50");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setTotalAdvocates(jsonResponse.pagination.count);
        setTotalPages(jsonResponse.pagination.pageTotal);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        setIsLoading(false);
      }
    };
    fetchAdvocates();
  }, [currentPage, advocatesPerPage]);

  const filterAdvocates = useCallback(
    debounce(() => {
      console.log("filtering advocates...");

      const filtered = advocates.filter((advocate) => {
        const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
        const searchTermLowerCase = searchTerm.toLowerCase();

        const searchMatch = searchTerm === "" || (
          fullName.includes(searchTermLowerCase) ||
          advocate.firstName.toLowerCase().includes(searchTermLowerCase) ||
          advocate.lastName.toLowerCase().includes(searchTermLowerCase) ||
          advocate.city.toLowerCase().includes(searchTermLowerCase) ||
          advocate.degree.toLowerCase().includes(searchTermLowerCase) ||
          advocate.specialties.some((s) =>
            s.toLowerCase().includes(searchTermLowerCase)
          ));

        return searchMatch;
      })

      setTotalAdvocates(filtered.length);
      setTotalPages(Math.ceil(filtered.length / advocatesPerPage));
      setFilteredAdvocates(filtered);

      if (currentPage > Math.ceil(filtered.length / advocatesPerPage)) {
        setCurrentPage(1);
      }
    }, 300),
    [advocates, searchTerm, advocatesPerPage, currentPage]
  );

  useEffect(() => {
    filterAdvocates();
    return () => {
      filterAdvocates.cancel();
    }
  }, [
    searchTerm,
    filterAdvocates,
    currentPage,
    advocatesPerPage,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  // Calculate paginated data
  const indexOfLastAdvocate = currentPage * advocatesPerPage;
  const indexOfFirstAdvocate = indexOfLastAdvocate - advocatesPerPage;
  const currentAdvocates = filteredAdvocates.slice(indexOfFirstAdvocate, indexOfLastAdvocate);
  const totalPagesForFiltered = Math.ceil(filteredAdvocates.length / advocatesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPagesForFiltered) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-4xl font-bold text-blue-600">Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={handleSearchChange} />
      </div>
      <br />
      <br />
      <div className="mb-4">
        <p>
          Showing {indexOfFirstAdvocate + 1}-{Math.min(indexOfLastAdvocate, filteredAdvocates.length)} of {filteredAdvocates.length} advocates
        </p>
        <div className="mt-2">
          <label htmlFor="perPage" className="mr-2">Items per page:</label>
          <select
            id="perPage"
            value={advocatesPerPage}
            onChange={(e) => {
              setAdvocatesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        {isLoading ? (
          "Loading..."
        ) : (
          <tbody>
            {currentAdvocates.map((advocate, index) => {
              return (
                <tr key={`${advocate.firstName}-${advocate.lastName}-${index}`}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s, i) => (
                      <div key={i}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPagesForFiltered }, (_, i) => i + 1).map((pageNum) => {
            // Show first page, last page, current page, and pages around current
            const showPage =
              pageNum === 1 ||
              pageNum === totalPagesForFiltered ||
              (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);

            if (!showPage) {
              // Show ellipsis
              if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 border rounded ${currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPagesForFiltered}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      <p className="mt-2 text-center text-sm text-gray-600">
        Page {currentPage} of {totalPagesForFiltered}
      </p>
    </main>
  );
}
