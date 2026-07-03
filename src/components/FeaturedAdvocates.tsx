import type { Advocate } from "@/types/advocate";

interface FeaturedAdvocatesProps {
  advocates: Advocate[];
}

export default function FeaturedAdvocates({
  advocates,
}: FeaturedAdvocatesProps) {
  if (advocates.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Featured matches
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            Examples of specialty-aligned advocates you can contact today.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          Each preview highlights a care area so the directory feels useful
          before you refine the full search.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {advocates.map((advocate) => (
          <article
            key={`${advocate.firstName}-${advocate.lastName}`}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                  {advocate.degree}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {advocate.firstName} {advocate.lastName}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {advocate.city} · {advocate.yearsOfExperience} years experience
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {advocate.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
