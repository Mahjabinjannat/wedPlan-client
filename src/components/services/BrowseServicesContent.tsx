"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  X,
} from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { getServices } from "@/lib/api/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SERVICE_CATEGORIES,
  type WeddingService,
  type ServiceFilters,
} from "@/types/service";

type SortOption = NonNullable<ServiceFilters["sort"]>;

// Labels for the sort dropdown
const SORT_OPTIONS: Record<SortOption, string> = {
  newest: "Newest First",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

interface ServiceQuery {
  search: string;
  category: string;
  location: string;
  sort: SortOption;
}

interface ServiceResult {
  key: string;
  services: WeddingService[];
  error: string;
}

export default function BrowseServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category is synchronized with the URL.
  const category = searchParams.get("category") ?? "";

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  // Debounced query values.
  const [debouncedQuery, setDebouncedQuery] = useState<ServiceQuery>({
    search,
    category,
    location,
    sort,
  });

  // Store completed requests with their query key.
  const [result, setResult] = useState<ServiceResult | null>(null);

  const currentQuery: ServiceQuery = {
    search,
    category,
    location,
    sort,
  };

  const currentKey = JSON.stringify(currentQuery);
  const debouncedKey = JSON.stringify(debouncedQuery);

  // Wait 300ms after filter changes.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery({
        search,
        category,
        location,
        sort,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category, location, sort]);

  // Fetch services after debounce.
 useEffect(() => {
  let cancelled = false;

  async function loadServices() {
    try {
      const data = await getServices({
        search: debouncedQuery.search,
        category: debouncedQuery.category,
        location: debouncedQuery.location,
        sort: debouncedQuery.sort,
      });

      if (!cancelled) {
        setResult({
          key: debouncedKey,
          services: data,
          error: "",
        });
      }
    } catch (err) {
      if (!cancelled) {
        setResult({
          key: debouncedKey,
          services: [],
          error:
            err instanceof Error
              ? err.message
              : "Something went wrong.",
        });
      }
    }
  }

  void loadServices();

  return () => {
    cancelled = true;
  };
}, [
  debouncedKey,
  debouncedQuery.search,
  debouncedQuery.category,
  debouncedQuery.location,
  debouncedQuery.sort,
]);

  // Only display data for the current filters.
  const loading = currentKey !== debouncedKey || result?.key !== currentKey;

  const services = loading ? [] : (result?.services ?? []);

  const error = loading ? "" : (result?.error ?? "");

  // Update category in URL.
  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // True when any filter is different from the default.
  const hasActiveFilters =
    search !== "" || location !== "" || category !== "" || sort !== "newest";

  // Clear all filters.
  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setSort("newest");
    handleCategoryChange("");
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9]">
      {/* Header */}
      <section className="bg-[#f8edef] px-4 py-16 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8b2339]">
          Wedding Marketplace
        </p>

        <h1 className="font-serif text-4xl font-bold text-[#2B2023] md:text-5xl">
          Discover Wedding Services
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[#806c72]">
          Find trusted wedding professionals and services to make your special
          day unforgettable.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Filter Panel */}
        <Card className="mb-10 gap-5 border border-[#eadfda] p-5 shadow-sm ring-0 sm:p-6">
          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6e9ec]">
                <SlidersHorizontal className="h-5 w-5 text-[#8b2339]" />
              </div>

              <div>
                <h2 className="font-serif text-xl font-bold text-[#2b2023]">
                  Find Your Perfect Service
                </h2>
                <p className="text-sm text-[#806c72]">
                  Search, filter by category or location, and sort by price.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleClearFilters}
                className="text-[#8b2339]"
              >
                <RotateCcw />
                Reset Filters
              </Button>
            )}
          </div>

          {/* Search, location, sort */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1.3fr_1fr]">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="filter-search" className="text-[#806c72]">
                Search
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#806c72]" />
                <Input
                  id="filter-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Service, vendor, style..."
                  className="h-11 rounded-xl bg-[#fcfaf9] pl-10 pr-9"
                />
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-[#806c72] hover:text-[#8b2339]"
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="filter-location" className="text-[#806c72]">
                Location
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#806c72]" />
                <Input
                  id="filter-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or state"
                  className="h-11 rounded-xl bg-[#fcfaf9] pl-10 pr-9"
                />
                {location && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setLocation("")}
                    aria-label="Clear location"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-[#806c72] hover:text-[#8b2339]"
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label htmlFor="filter-sort" className="text-[#806c72]">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort By
              </Label>
              <Select
                items={SORT_OPTIONS}
                value={sort}
                onValueChange={(value) => {
                  if (value) setSort(value as SortOption);
                }}
              >
                <SelectTrigger
                  id="filter-sort"
                  className="h-11 w-full rounded-xl bg-[#fcfaf9] px-4 data-[size=default]:h-11"
                >
                  <SelectValue />
                </SelectTrigger>

                {/* alignItemWithTrigger=false: open the menu below the box */}
                <SelectContent
                  alignItemWithTrigger={false}
                  sideOffset={6}
                  className="rounded-xl p-1"
                >
                  {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="rounded-lg py-2.5"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category pills */}
          <div className="space-y-2 border-t border-[#f0e5e1] pt-4">
            <p className="text-sm font-medium text-[#806c72]">Category</p>

            <div className="flex flex-wrap gap-2">
              {["", ...SERVICE_CATEGORIES].map((item) => {
                const active = category === item;

                return (
                  <Button
                    key={item || "all"}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="lg"
                    aria-pressed={active}
                    onClick={() => handleCategoryChange(item)}
                    className={`rounded-full px-4 ${
                      active ? "" : "bg-white text-[#30252a] hover:bg-[#f6e9ec]"
                    }`}
                  >
                    {item || "All Categories"}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Services Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold">Available Services</h2>

          {!loading && !error && (
            <Badge variant="secondary" className="h-7 px-3 text-sm">
              {services.length} {services.length === 1 ? "service" : "services"}{" "}
              found
            </Badge>
          )}
        </div>

        {/* Services Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-[#f0e5e8]"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700"
          >
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfda] bg-white px-6 py-20 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-[#b68a94]" />

            <h3 className="font-serif text-2xl font-bold">No Services Found</h3>

            <p className="mt-2 text-[#806c72]">
              Try adjusting your search or filters.
            </p>

            <Button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 h-11 rounded-xl px-6"
            >
              <RotateCcw />
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
