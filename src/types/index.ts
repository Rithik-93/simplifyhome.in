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
  userPrice: number; // User input price
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
  description: string;
}

export interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  city: string;
}

// CMS Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}

export interface CMSItem {
  id: string;
  name: string;
  category: string;
  type: 'furniture' | 'singleLine' | 'service';
  basePrice: number;
  description?: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CMSCategory {
  id: string;
  name: string;
  type: 'furniture' | 'singleLine' | 'service';
  description?: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CMSUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// API Request/Response types
export interface CreateItemRequest {
  name: string;
  category: string;
  type: 'furniture' | 'singleLine' | 'service';
  basePrice: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'furniture' | 'singleLine' | 'service';
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor';
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface GetItemsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
  isActive?: boolean;
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
  activeItems: number;
  totalCategories: number;
  activeCategories: number;
  totalUsers: number;
  activeUsers: number;
  itemsByType: {
    furniture: number;
    singleLine: number;
    service: number;
  };
  itemsByCategory: Array<{
    category: string;
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
  furnitureItems: FurnitureItem[];
  singleLineItems: SingleLineItem[];
  serviceItems: ServiceItem[];
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

export const ROOM_DIMENSIONS = {
  'Master Bedroom': BEDROOM_DIMENSIONS,
  'Children Bedroom': BEDROOM_DIMENSIONS, 
  'Guest Bedroom': GUEST_BEDROOM_DIMENSIONS,
  'Living Room': LIVING_ROOM_DIMENSIONS,
  'Pooja Room': POOJA_ROOM_DIMENSIONS,
  'Modular Kitchen': KITCHEN_DIMENSIONS
};

export const DEFAULT_FURNITURE_ITEMS: FurnitureItem[] = [
  // Master Bedroom
  {
    id: 'master-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    userPrice: 0
  },
  {
    id: 'master-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    userPrice: 0
  },
  {
    id: 'master-tv-unit',
    name: 'TV Unit',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    userPrice: 0
  },
  {
    id: 'master-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    userPrice: 0
  },

  // Children Bedroom
  {
    id: 'children-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    userPrice: 0
  },
  {
    id: 'children-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    userPrice: 0
  },
  {
    id: 'children-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    userPrice: 0
  },

  // Guest Bedroom
  {
    id: 'guest-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    userPrice: 0
  },
  {
    id: 'guest-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    userPrice: 0
  },
  {
    id: 'guest-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    userPrice: 0
  },

  // Living Room
  {
    id: 'living-tv-drawer',
    name: 'TV Drawer unit',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    userPrice: 0
  },
  {
    id: 'living-tv-paneling',
    name: 'TV unit paneling',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    userPrice: 0
  },

  // Pooja Room
  {
    id: 'pooja-unit',
    name: 'Pooja Unit',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    userPrice: 0
  },
  {
    id: 'pooja-doors',
    name: 'Doors',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    userPrice: 0
  },

  // Modular Kitchen
  {
    id: 'kitchen-base-unit-parallel',
    name: 'Base Unit - Parallel',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-base-unit-l-shaped',
    name: 'Base Unit - L-Shaped',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-base-unit-island',
    name: 'Base Unit - Island',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-tandem-baskets',
    name: 'Tandem Baskets',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-bottle-pullout',
    name: 'Bottle Pullout',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-corner-unit',
    name: 'Corner Unit',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
  },
  {
    id: 'kitchen-wicker-basket',
    name: 'Wicker Basket',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    userPrice: 0
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
    id: 'sofa-premium', 
    name: 'Sofa (Premium)', 
    selected: false, 
    userPrice: 0,
    description: 'Premium quality sofa for 3BHK'
  },
  { 
    id: 'dining-table-premium', 
    name: 'Dining Table (Premium)', 
    selected: false, 
    userPrice: 0,
    description: 'Premium dining table for 3BHK'
  },
  { 
    id: 'carpets-premium', 
    name: 'Carpets (Premium)', 
    selected: false, 
    userPrice: 0,
    description: 'Premium carpets for 3BHK'
  },
  { 
    id: 'designer-lights-premium', 
    name: 'Designer Lights (Premium)', 
    selected: false, 
    userPrice: 0,
    description: 'Premium designer lights for 3BHK'
  }
]; 