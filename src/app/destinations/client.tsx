"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { PageHeader, DestinationCard, SearchBar, FilterChip, EmptyState } from "@/components/browse";
import { staggerContainer } from "@/lib/motion";

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  coverImage: string;
  activityCount: number;
  rating: number;
  highlights: string[];
  featured: boolean;
}

interface Props {
  destinations: Destination[];
  countries: string[];
}

export function DestinationsClient({ destinations, countries }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = destinations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (selectedCountry) {
      result = result.filter((d) => d.country === selectedCountry);
    }
    return result;
  }, [destinations, search, selectedCountry]);

  const featured = filtered.filter((d) => d.featured);
  const rest = filtered.filter((d) => !d.featured);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Explore"
        highlight="Destinations"
        description="Discover handpicked destinations curated by local experts and seasoned travelers."
      >
        {/* Search & Filters */}
        <div className="mx-auto max-w-2xl space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search destinations by name, country, or keyword..."
          />
          <div className="flex flex-wrap justify-center gap-2">
            <FilterChip
              label="All"
              active={!selectedCountry}
              onClick={() => setSelectedCountry(null)}
            />
            {countries.map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={selectedCountry === c}
                onClick={() => setSelectedCountry(selectedCountry === c ? null : c)}
                count={destinations.filter((d) => d.country === c).length}
              />
            ))}
          </div>
        </div>
      </PageHeader>

      <section className="section-container pb-20">
        {filtered.length === 0 ? (
          <EmptyState
            title="No destinations found"
            description="Try a different search term or remove filters."
            action={
              <button
                onClick={() => { setSearch(""); setSelectedCountry(null); }}
                className="btn-secondary text-sm"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-12">
                <div className="mb-6 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-lg font-semibold text-white">
                    Featured Destinations
                  </h2>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {featured.map((d, i) => (
                    <DestinationCard key={d.id} {...d} index={i} />
                  ))}
                </motion.div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="mb-6 font-display text-lg font-semibold text-white">
                    All Destinations
                  </h2>
                )}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {rest.map((d, i) => (
                    <DestinationCard key={d.id} {...d} index={i} />
                  ))}
                </motion.div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
