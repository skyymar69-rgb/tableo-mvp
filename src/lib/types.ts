export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export type SubscriptionTier = "FREE" | "GROWTH" | "ENTERPRISE";
export type RestaurantStatus = "ACTIVE" | "ONBOARDING" | "SUSPENDED";
export type UserRole = "ADMIN" | "OWNER" | "MANAGER" | "STAFF";
export type RfmSegment = "champion" | "loyal" | "promising" | "at_risk" | "lost";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  currency: string;
  timezone: string;
  status: RestaurantStatus;
  logoUrl: string | null;
  description?: string | null;
  website?: string | null;
  openingHours?: string | null;
  settings?: RestaurantSettings | null;
  subscription?: { tier: SubscriptionTier } | null;
  tier?: SubscriptionTier;
}

export interface RestaurantSettings {
  primaryColor?: string;
  accentColor?: string;
  menuLayout?: string;
  showPrices?: boolean;
  showAllergens?: boolean;
  showCalories?: boolean;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  rawId: string;
  table: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
  createdAtIso: string;
  customer: string | null;
}

export interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  loyaltyPoints: number;
  rfmScore: RfmSegment;
  tags: string[];
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
  labels: string[];
  categoryId: string;
  allergens: string[];
  calories: number | null;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  position: number;
  dishes: Dish[];
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  currentOrderId: string | null;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accepted: boolean;
  createdAt: string;
}
