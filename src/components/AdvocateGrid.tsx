import { Advocate } from "@/types/advocate";
import AdvocateCard from "./AdvocateCard";

interface AdvocateGridProps {
    advocates: Advocate[];
    isLoading?: boolean;
    sortOrder: "asc" | "desc";
    onSortChange: (order: "asc" | "desc") => void;
}

export default function AdvocateGrid({
    advocates,
    isLoading = false,
    sortOrder,
    onSortChange
}: AdvocateGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 text-lg">Loading advocates...</div>
            </div>
        );
    }

    if (advocates.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 text-lg">No advocates found. Try adjusting your search.</div>
            </div>
        );
    }

    return (
        <div>
            {/* Sort Controls */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-700">
                    <span className="font-semibold">{advocates.length}</span> advocate{advocates.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 font-medium">Sort by Experience:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advocates.map((advocate, index) => (
                    <AdvocateCard key={`${advocate.firstName}-${advocate.lastName}-${index}`} advocate={advocate} />
                ))}
            </div>
        </div>
    );
}
