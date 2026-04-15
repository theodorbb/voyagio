"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
  PageHeader,
  ActivityCard,
  SearchBar,
  FilterChip,
  EmptyState,
} from "@/components/browse";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ActivityData {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  destinationName: string;
  destinationSlug: string;
  difficulty: string | null;
  maxGroupSize: number;
  featured: boolean;
}

interface Props {
  activities: ActivityData[];
  destinations: { name: string; slug: string }[];
  categories: string[];
}

type SortOption = "featured" | "rating" | "price-low" | "price-high" | "duration";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "duration", label: "Duration" },
];

const PRICE_RANGES = [
  { label: "Under €30", min: 0, max: 30 },
  { label: "€30 – €60", min: 30, max: 60 },
  { label: "€60 – €100", min: 60, max: 100 },
  { label: "€100+", min: 100, max: Infinity },
];

export function ActivitiesClient({ activities, destinations, categories }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...activities];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.destinationName.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Destination
    if (selectedDestination) {
      result = result.filter((a) => a.destinationSlug === selectedDestination);
    }

    // Price
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      result = result.filter((a) => a.price >= range.min && a.price < range.max);
    }

    // Sort
    switch (sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        result.sort((a, b) => a.duration - b.duration);
        break;
      // "featured" is default order from server
    }

    return result;
  }, [activities, search, selectedCategory, selectedDestination, selectedPrice, sort]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedDestination ? 1 : 0) +
    (selectedPrice !== null ? 1 : 0);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Discover"
        highlight="Activities"
        description="Browse curated experiences across all destinations — from kayaking tours to cooking classes."
      >
        <div className="mx-auto max-w-2xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search activities, categories, or destinations..."
          />
        </div>
      </PageHeader>

      <section className="section-container pb-20">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
              showFilters || activeFilterCount > 0
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/70"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative ml-auto flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-white/30" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 pr-8 text-xs text-white/60 outline-none focus:border-accent/40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[var(--surface)]">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <span className="hidden text-xs text-white/30 sm:block">
            {filtered.length} of {activities.length} activities
          </span>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Category */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={!selectedCategory}
                    onClick={() => setSelectedCategory(null)}
                  />
                  {categories.map((c) => (
                    <FilterChip
                      key={c}
                      label={c}
                      active={selectedCategory === c}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === c ? null : c)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Destination
                </h4>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={!selectedDestination}
                    onClick={() => setSelectedDestination(null)}
                  />
                  {destinations.map((d) => (
                    <FilterChip
                      key={d.slug}
                      label={d.name}
                      active={selectedDestination === d.slug}
                      onClick={() =>
                        setSelectedDestination(
                          selectedDestination === d.slug ? null : d.slug
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Price Range
                </h4>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={selectedPrice === null}
                    onClick={() => setSelectedPrice(null)}
                  />
                  {PRICE_RANGES.map((r, i) => (
                    <FilterChip
                      key={r.label}
                      label={r.label}
                      active={selectedPrice === i}
                      onClick={() =>
                        setSelectedPrice(selectedPrice === i ? null : i)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedDestination(null);
                    setSelectedPrice(null);
                  }}
                  className="text-xs font-medium text-accent transition-colors hover:text-accent-light"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No activities found"
            description="Try adjusting your search or filters."
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                  setSelectedDestination(null);
                  setSelectedPrice(null);
                }}
                className="btn-secondary text-sm"
              >
                Clear All
              </button>
            }
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((a, i) => (
              <ActivityCard key={a.id} {...a} showFavorite index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
