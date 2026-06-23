"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import {
  PageHeader,
  DestinationCard,
  SearchBar,
  FilterChip,
  EmptyState,
  ShowMoreButton,
} from "@/components/browse";
import { staggerContainer } from "@/lib/motion";

const INITIAL_VISIBLE = 8;

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
  const [showAll, setShowAll] = useState(false);

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

  const ordered = useMemo(() => {
    const f = filtered.filter((d) => d.featured);
    const r = filtered.filter((d) => !d.featured);
    return [...f, ...r];
  }, [filtered]);

  const isFiltering = !!search || !!selectedCountry;

  const visible = isFiltering || showAll ? ordered : ordered.slice(0, INITIAL_VISIBLE);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Explore"
        highlight="Destinations"
        description="Discover handpicked destinations curated by local experts and seasoned travelers."
      >

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
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-semibold text-white">
                {isFiltering ? "Search Results" : "Featured Destinations"}
              </h2>
              <span className="text-xs text-white/30">
                {isFiltering
                  ? `${filtered.length} found`
                  : `${visible.length} of ${ordered.length}`}
              </span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((d, i) => (
                <DestinationCard key={d.id} {...d} index={i} />
              ))}
            </motion.div>

            {!isFiltering && !showAll && (
              <ShowMoreButton
                remaining={ordered.length - visible.length}
                totalLabel="more"
                onClick={() => setShowAll(true)}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
