import { Advocate } from "@/types/advocate";

const curatedHomepageSpecialties = [
  "Trauma & PTSD",
  "Attention and Hyperactivity (ADHD)",
  "Substance use/abuse",
  "Women's issues (post-partum, infertility, family planning)",
  "LGBTQ",
  "Chronic pain",
];

const maxHomepageSpecialties = 6;

export const homepageSpecialties = curatedHomepageSpecialties;

export function getHomepageSpecialties(advocates: Advocate[]) {
  const matchingCurated = curatedHomepageSpecialties.filter((specialty) =>
    advocates.some((advocate) => advocate.specialties.includes(specialty)),
  );

  if (matchingCurated.length >= maxHomepageSpecialties) {
    return matchingCurated.slice(0, maxHomepageSpecialties);
  }

  const fallbackSpecialties = Array.from(
    new Set(
      advocates.flatMap((advocate) => advocate.specialties).filter(Boolean),
    ),
  ).filter((specialty) => !matchingCurated.includes(specialty));

  return [...matchingCurated, ...fallbackSpecialties].slice(
    0,
    maxHomepageSpecialties,
  );
}

export function getFeaturedAdvocates(advocates: Advocate[]) {
  const featured: Advocate[] = [];
  const featuredIds = new Set<string>();

  for (const specialty of curatedHomepageSpecialties.slice(0, 3)) {
    const match = advocates.find((advocate) =>
      advocate.specialties.includes(specialty),
    );

    if (!match) {
      continue;
    }

    const key = `${match.firstName}-${match.lastName}`;

    if (!featuredIds.has(key)) {
      featured.push(match);
      featuredIds.add(key);
    }
  }

  if (featured.length < 3) {
    for (const advocate of advocates) {
      const key = `${advocate.firstName}-${advocate.lastName}`;

      if (featuredIds.has(key)) {
        continue;
      }

      featured.push(advocate);
      featuredIds.add(key);

      if (featured.length === 3) {
        break;
      }
    }
  }

  return featured;
}
