export const SERVICE_CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

// ==========================================
// WEDDING SERVICE
// ==========================================

export interface WeddingService {
  _id: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  location: string;
  images: string[];

  vendorId: string;
  vendorName: string;
  vendorEmail?: string;

  // Added by the API: true when the vendor has an active Premium plan
  isPremiumVendor?: boolean;

  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

// ==========================================
// SERVICE FILTERS
// ==========================================

export interface ServiceFilters {
  search?: string;
  category?: string;
  location?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
}
