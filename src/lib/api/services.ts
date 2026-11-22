
import type {
  WeddingService,
  ServiceFilters,
} from "@/types/service";

export type {
  WeddingService,
  ServiceFilters,
} from "@/types/service";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

// ==========================================
// VALIDATE SERVICE ID
// ==========================================

export function isValidServiceId(
  id: string
): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

// ==========================================
// GET ALL SERVICES
// ==========================================

export async function getServices(
  filters: ServiceFilters = {}
): Promise<WeddingService[]> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category?.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.location?.trim()) {
    params.set("location", filters.location.trim());
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (
    filters.limit !== undefined &&
    Number.isInteger(filters.limit) &&
    filters.limit > 0
  ) {
    params.set("limit", String(filters.limit));
  }

  const query = params.toString();

  const url = query
    ? `${API_URL}/services?${query}`
    : `${API_URL}/services`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch services. Status: ${response.status}`
    );
  }

  const data: WeddingService[] =
    await response.json();

  return data;
}

// ==========================================
// GET FEATURED SERVICES
// ==========================================

export async function getFeaturedServices(
  limit: number = 6
): Promise<WeddingService[]> {
  return getServices({
    sort: "newest",
    limit,
  });
}

// ==========================================
// GET SERVICE BY ID
// ==========================================

export async function getServiceById(
  id: string
): Promise<WeddingService | null> {
  if (!isValidServiceId(id)) {
    return null;
  }

  const response = await fetch(
    `${API_URL}/services/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch service details. Status: ${response.status}`
    );
  }

  const data: WeddingService =
    await response.json();

  return data;
}
