"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/advocate";
import { debounce } from "lodash";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    console.log("fetching advocates...");

    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        setIsLoading(false);
      }
    };
    fetchAdvocates();
  }, []);

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

      setFilteredAdvocates(filtered);
    }, 300),
    [advocates, searchTerm]
  );

  useEffect(() => {
    filterAdvocates();
    return () => {
      filterAdvocates.cancel();
    }
  }, [searchTerm, filterAdvocates]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
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
          "loading..."
        ) : (
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div>{s}</div>
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
    </main>
  );
}
