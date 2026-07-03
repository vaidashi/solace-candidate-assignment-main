"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
  };

  return (
    <form className="w-full max-w-3xl" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by specialty, city, degree, or advocate name..."
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200"
          disabled={isLoading}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Find advocates"}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
