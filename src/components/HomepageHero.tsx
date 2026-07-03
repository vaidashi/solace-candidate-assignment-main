interface HomepageHeroProps {
  specialties: string[];
  onSpecialtySelect: (specialty: string) => void;
}

export default function HomepageHero({
  specialties,
  onSpecialtySelect,
}: HomepageHeroProps) {
  return (
    <section className="rounded-[2rem] bg-[linear-gradient(135deg,#172033_0%,#24324d_52%,#f1dfc8_52%,#f7efe6_100%)] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
            Specialty-first advocate matching
          </p>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Find the right healthcare advocate by care need, not by guesswork.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-100/90">
              Start with a specialty, see who can help, then search deeper without
              losing momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => onSpecialtySelect(specialty)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/20"
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-[#fffaf4] p-5 text-slate-900 shadow-lg">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                How Solace helps
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Prove fit before the first search.
              </h2>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-amber-50 px-4 py-3">
                1. Pick a care need like trauma, ADHD, or postpartum support.
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                2. See real advocates with relevant specialties right away.
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-slate-50">
                3. Continue into search with more confidence and less friction.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
