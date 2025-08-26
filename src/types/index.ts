export interface HomeDetails {
  homeType: '2BHK' | '3BHK' | '';
  qualityTier: 'Premium' | 'Luxury' | '';
  carpetArea: number;
}

export interface DimensionOption {
  length: number;
  width: number;
  label: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  selected: boolean;
  quantity: number;
  category: string;
  type: string; // Added type field
  userPrice: number; // User input price
  basePrice: number; // Base price from CMS for estimated calculations
  pricePerSqFt: number; // Price per sq.ft from API
  
  // New AddonPricing structure for Add Ons items
  addonPricing?: AddonPricing[];
  
  // User-entered dimensions for woodwork items
  userDimensions?: { length: number; width: number };
  
  totalPrice?: number; // Calculated as: userPrice × quantity
}

export interface SingleLineItem {
  id: string;
  name: string;
  selected: boolean;
  userPrice: number; // User input price
  totalPrice?: number; // Calculated as: userPrice × carpetArea
}

export interface RoomSizeSelection {
  [category: string]: number; // index of selected dimension for each category
}

export interface ServiceItem {
  id: string;
  name: string;
  selected: boolean;
  userPrice: number; // User input price
  description?: string;
}

export interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  city: string;
}

export type RoomType = 'BHK_1' | 'BHK_2' | 'BHK_3' | 'BHK_4' | 'BHK_5' | 'BHK_6';

// New AddonPricing interface to match backend schema
export interface AddonPricing {
  id: string;
  itemId: string;
  roomType: RoomType;
  premiumPrice: number;
  luxuryPrice: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CMSType {
  id: string;
  name: string;
  categories?: CMSCategory[];
  items?: CMSItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CMSCategory {
  id: string;
  name: string;
  type: CMSType;
  typeId: string;
  items?: CMSItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CMSItem {
  id: string;
  name: string;
  description?: string;
  availableInRooms: RoomType[];
  
  // Standard pricing (per sq ft) - for regular items
  premiumPricePerSqFt?: number | null;
  luxuryPricePerSqFt?: number | null;
  
  // New AddonPricing structure for Add Ons items
  addonPricing?: AddonPricing[];
  
  imageUrl?: string;
  category?: CMSCategory | null;
  categoryId?: string | null;
  type?: CMSType | null;
  typeId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// API Request/Response types
export interface CreateTypeRequest {
  name: string;
}

export interface UpdateTypeRequest extends Partial<CreateTypeRequest> {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
  typeId: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  availableInRooms: RoomType[];
  
  // Standard pricing (per sq ft) - for regular items
  premiumPricePerSqFt?: number | null;
  luxuryPricePerSqFt?: number | null;
  
  // Add-on pricing for Add Ons items
  addonPricing?: Omit<AddonPricing, 'id' | 'itemId' | 'createdAt' | 'updatedAt'>[];
  
  imageUrl?: string;
  categoryId?: string | null;
  typeId?: string | null;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: string;
}

// User management types
export interface CMSUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer';
  isActive?: boolean;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface GetItemsRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  typeId?: string;
  availableInRooms?: RoomType[];
}

export interface CMSPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CMSResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: CMSPagination;
}

export interface DashboardStats {
  totalItems: number;
  totalTypes: number;
  totalCategories: number;
  itemsByRoomType: {
    [key in RoomType]: number;
  };
  itemsByCategory: Array<{
    category: string;
    type: string;
    count: number;
  }>;
  itemsByType: Array<{
    type: string;
    count: number;
  }>;
  recentItems: CMSItem[];
}

export interface EstimateItem {
  category: string;
  items: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

export interface AppState {
  currentStep: number;
  homeDetails: HomeDetails;
  items: FurnitureItem[]; // Consolidated items
  userDetails: UserDetails;
  estimate: EstimateItem[];
  finalPrice: number;
}

// Define dimension options for each category
const BEDROOM_DIMENSIONS: DimensionOption[] = [
  { length: 10, width: 12, label: '10 × 12 ft' },
  { length: 14, width: 16, label: '14 × 16 ft' },
  { length: 11, width: 11, label: '11 × 11 ft' },
  { length: 10, width: 10, label: '10 × 10 ft' }
];

const LIVING_ROOM_DIMENSIONS: DimensionOption[] = [
  { length: 7, width: 10, label: '7 × 10 ft' },
  { length: 10, width: 13, label: '10 × 13 ft' },
  { length: 12, width: 18, label: '12 × 18 ft' },
  { length: 15, width: 20, label: '15 × 20 ft' }
];

const POOJA_ROOM_DIMENSIONS: DimensionOption[] = [
  { length: 9, width: 9, label: '9 × 9 ft' },
  { length: 3, width: 3, label: '3 × 3 ft' }
];

const KITCHEN_DIMENSIONS: DimensionOption[] = [
  { length: 8, width: 10, label: '8 × 10 ft' },
  { length: 10, width: 12, label: '10 × 12 ft' },
  { length: 12, width: 14, label: '12 × 14 ft' }
];

// Room dimension options for each category
const GUEST_BEDROOM_DIMENSIONS: DimensionOption[] = [
  { length: 10, width: 10, label: '10 × 10 ft' },
  { length: 10, width: 12, label: '10 × 12 ft' },
  { length: 11, width: 11, label: '11 × 11 ft' }
];

// Default dimensions for unknown categories
const DEFAULT_ROOM_DIMENSIONS: DimensionOption[] = [
  { length: 10, width: 10, label: '10 × 10 ft' },
  { length: 10, width: 12, label: '10 × 12 ft' },
  { length: 12, width: 12, label: '12 × 12 ft' }
];

export const ROOM_DIMENSIONS = {
  'Master Bedroom': BEDROOM_DIMENSIONS,
  'Children Bedroom': BEDROOM_DIMENSIONS, 
  'Guest Bedroom': GUEST_BEDROOM_DIMENSIONS,
  'Living Room': LIVING_ROOM_DIMENSIONS,
  'Pooja Room': POOJA_ROOM_DIMENSIONS,
  'Modular Kitchen': KITCHEN_DIMENSIONS
};

// Helper function to get room dimensions with fallback
export const getRoomDimensions = (category: string): DimensionOption[] => {
  return ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS] || DEFAULT_ROOM_DIMENSIONS;
};

export const DEFAULT_FURNITURE_ITEMS: FurnitureItem[] = [
  // Master Bedroom
  {
    id: 'master-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    type: 'Wood Work',
    basePrice: 45000,
    userPrice: 0,
    pricePerSqFt: 450
  },
  {
    id: 'master-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    type: 'Wood Work',
    basePrice: 15000,
    userPrice: 0,
    pricePerSqFt: 300
  },
  {
    id: 'master-tv-unit',
    name: 'TV Unit',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    type: 'Wood Work',
    basePrice: 25000,
    userPrice: 0,
    pricePerSqFt: 400
  },
  {
    id: 'master-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    type: 'Wood Work',
    basePrice: 35000,
    userPrice: 0,
    pricePerSqFt: 500
  },

  // Children Bedroom
  {
    id: 'children-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    type: 'Wood Work',
    basePrice: 35000,
    userPrice: 0,
    pricePerSqFt: 400
  },
  {
    id: 'children-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    type: 'Wood Work',
    basePrice: 12000,
    userPrice: 0,
    pricePerSqFt: 250
  },
  {
    id: 'children-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    type: 'Wood Work',
    basePrice: 28000,
    userPrice: 0,
    pricePerSqFt: 450
  },

  // Guest Bedroom
  {
    id: 'guest-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    type: 'Wood Work',
    basePrice: 40000,
    userPrice: 0,
    pricePerSqFt: 420
  },
  {
    id: 'guest-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    type: 'Wood Work',
    basePrice: 14000,
    userPrice: 0,
    pricePerSqFt: 280
  },
  {
    id: 'guest-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    type: 'Wood Work',
    basePrice: 32000,
    userPrice: 0,
    pricePerSqFt: 480
  },

  // Living Room
  {
    id: 'living-tv-drawer',
    name: 'TV Drawer unit',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    type: 'Wood Work',
    basePrice: 30000,
    userPrice: 0,
    pricePerSqFt: 600
  },
  {
    id: 'living-tv-paneling',
    name: 'TV unit paneling',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    type: 'Wood Work',
    basePrice: 20000,
    userPrice: 0,
    pricePerSqFt: 350
  },

  // Pooja Room
  {
    id: 'pooja-unit',
    name: 'Pooja Unit',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    type: 'Wood Work',
    basePrice: 50000,
    userPrice: 0,
    pricePerSqFt: 800
  },
  {
    id: 'pooja-doors',
    name: 'Doors',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    type: 'Wood Work',
    basePrice: 15000,
    userPrice: 0,
    pricePerSqFt: 300
  },

  // Modular Kitchen
  {
    id: 'kitchen-base-unit-parallel',
    name: 'Base Unit - Parallel',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 60000,
    userPrice: 0,
    pricePerSqFt: 1200
  },
  {
    id: 'kitchen-base-unit-l-shaped',
    name: 'Base Unit - L-Shaped',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 75000,
    userPrice: 0,
    pricePerSqFt: 1400
  },
  {
    id: 'kitchen-base-unit-island',
    name: 'Base Unit - Island',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 85000,
    userPrice: 0,
    pricePerSqFt: 1600
  },
  {
    id: 'kitchen-tandem-baskets',
    name: 'Tandem Baskets',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 25000,
    userPrice: 0,
    pricePerSqFt: 150
  },
  {
    id: 'kitchen-bottle-pullout',
    name: 'Bottle Pullout',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 18000,
    userPrice: 0,
    pricePerSqFt: 120
  },
  {
    id: 'kitchen-corner-unit',
    name: 'Corner Unit',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 45000,
    userPrice: 0,
    pricePerSqFt: 200
  },
  {
    id: 'kitchen-wicker-basket',
    name: 'Wicker Basket',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    type: 'Wood Work',
    basePrice: 12000,
    userPrice: 0,
    pricePerSqFt: 80
  }
];

export const DEFAULT_SINGLE_LINE_ITEMS: SingleLineItem[] = [
  {
    id: 'false-ceiling',
    name: 'False Ceiling',
    selected: false,
    userPrice: 0
  },
  {
    id: 'ceiling-painting',
    name: 'Ceiling Painting',
    selected: false,
    userPrice: 0
  },
  {
    id: 'electrical-wiring',
    name: 'Electrical & Wiring',
    selected: false,
    userPrice: 0
  }
];

export const DEFAULT_SERVICE_ITEMS: ServiceItem[] = [
  { 
    id: 'sofa', 
    name: 'Sofa', 
    selected: false, 
    userPrice: 0,
    description: 'Premium quality sofa for your home'
  },
  { 
    id: 'dining-table', 
    name: 'Dining Table', 
    selected: false, 
    userPrice: 0,
    description: 'Premium dining table for your home'
  },
  { 
    id: 'carpets', 
    name: 'Carpets', 
    selected: false, 
    userPrice: 0,
    description: 'Premium carpets for your home'
  },
  { 
    id: 'designer-lights', 
    name: 'Designer Lights', 
    selected: false, 
    userPrice: 0,
    description: 'Premium designer lights for your home'
  },
  { 
    id: 'curtains', 
    name: 'Curtains', 
    selected: false, 
    userPrice: 0,
    description: 'Premium curtains for your home'
  }
]; 