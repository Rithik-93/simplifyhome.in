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

export interface ItemPricing {
  area: {
    luxury: number; // Area in square feet required for this item
    premium: number; // Area in square feet required for this item
  };
  price: {
    luxury: number; // Price per square foot - multiply by area to get total cost
    premium: number; // Price per square foot - multiply by area to get total cost
  };
}

export interface FurnitureItem {
  id: string;
  name: string;
  selected: boolean;
  quantity: number;
  category: string;
  pricing: {
    [roomSize: string]: ItemPricing;
  };
  totalPrice?: number; // Calculated as: pricing[roomSize].area[tier] × pricing[roomSize].price[tier]
}

export interface SingleLineItem {
  id: string;
  name: string;
  selected: boolean;
  pricePerSqFt: number; // Price per square foot - multiply by carpet area to get total cost
  totalPrice?: number; // Calculated as: pricePerSqFt × carpetArea
}

export interface RoomSizeSelection {
  [category: string]: number; // index of selected dimension for each category
}

export interface ServiceItem {
  id: string;
  name: string;
  selected: boolean;
  basePrice: number; // Fixed base price for the service (for general services)
  pricePerSqFt: number; // Additional price per square foot (if applicable)
  description: string;
  pricing?: {
    // Dynamic pricing based on home type and quality tier
    [homeType: string]: {
      [qualityTier: string]: number;
    };
  };
  // Total cost = basePrice + (pricePerSqFt × carpetArea) OR pricing[homeType][qualityTier] if pricing exists
}

export interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  city: string;
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
    pricing: {
      '10 × 10 ft': { area: { luxury: 30, premium: 20 }, price: { luxury: 4800, premium: 2850 } },
      '10 × 12 ft': { area: { luxury: 40, premium: 25 }, price: { luxury: 5000, premium: 3000 } },
      '14 × 16 ft': { area: { luxury: 60, premium: 35 }, price: { luxury: 6000, premium: 2800 } },
      '11 × 11 ft': { area: { luxury: 35, premium: 15 }, price: { luxury: 2500, premium: 2500 } }
    }
  },
  {
    id: 'master-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 12, premium: 12 }, price: { luxury: 2800, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 14, premium: 14 }, price: { luxury: 3800, premium: 2580 } },
      '14 × 16 ft': { area: { luxury: 16, premium: 16 }, price: { luxury: 4500, premium: 3200 } },
      '11 × 11 ft': { area: { luxury: 10, premium: 10 }, price: { luxury: 2650, premium: 1950 } }
    }
  },
  {
    id: 'master-tv-unit',
    name: 'TV Unit',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 8, premium: 8 }, price: { luxury: 1500, premium: 1250 } },
      '10 × 12 ft': { area: { luxury: 10, premium: 10 }, price: { luxury: 1600, premium: 1300 } },
      '14 × 16 ft': { area: { luxury: 12, premium: 12 }, price: { luxury: 3000, premium: 2000 } },
      '11 × 11 ft': { area: { luxury: 10, premium: 10 }, price: { luxury: 2000, premium: 1800 } }
    }
  },
  {
    id: 'master-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Master Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 30, premium: 24 }, price: { luxury: 3000, premium: 3000 } },
      '10 × 12 ft': { area: { luxury: 30, premium: 30 }, price: { luxury: 3700, premium: 3700 } },
      '14 × 16 ft': { area: { luxury: 36, premium: 36 }, price: { luxury: 4200, premium: 4200 } },
      '11 × 11 ft': { area: { luxury: 27, premium: 27 }, price: { luxury: 3400, premium: 3400 } }
    }
  },

  // Children Bedroom
  {
    id: 'children-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 30, premium: 20 }, price: { luxury: 4800, premium: 2850 } },
      '10 × 12 ft': { area: { luxury: 40, premium: 25 }, price: { luxury: 5000, premium: 3000 } },
      '14 × 16 ft': { area: { luxury: 60, premium: 35 }, price: { luxury: 6000, premium: 2800 } },
      '11 × 11 ft': { area: { luxury: 35, premium: 15 }, price: { luxury: 4300, premium: 2500 } }
    }
  },
  {
    id: 'children-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 12, premium: 12 }, price: { luxury: 2800, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 14, premium: 14 }, price: { luxury: 3800, premium: 2850 } },
      '14 × 16 ft': { area: { luxury: 16, premium: 16 }, price: { luxury: 4500, premium: 3200 } },
      '11 × 11 ft': { area: { luxury: 10, premium: 10 }, price: { luxury: 2650, premium: 1950 } }
    }
  },
  {
    id: 'children-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Children Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 24, premium: 24 }, price: { luxury: 3000, premium: 3000 } },
      '10 × 12 ft': { area: { luxury: 30, premium: 30 }, price: { luxury: 3700, premium: 3700 } },
      '14 × 16 ft': { area: { luxury: 36, premium: 36 }, price: { luxury: 4200, premium: 4200 } },
      '11 × 11 ft': { area: { luxury: 27, premium: 27 }, price: { luxury: 3400, premium: 3400 } }
    }
  },

  // Guest Bedroom
  {
    id: 'guest-wardrobe',
    name: 'Wardrobe',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 30, premium: 20 }, price: { luxury: 4800, premium: 2850 } },
      '10 × 12 ft': { area: { luxury: 40, premium: 25 }, price: { luxury: 5000, premium: 3000 } },
      '11 × 11 ft': { area: { luxury: 35, premium: 15 }, price: { luxury: 4300, premium: 2500 } }
    }
  },
  {
    id: 'guest-study-table',
    name: 'Study Table',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 12, premium: 12 }, price: { luxury: 2800, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 14, premium: 14 }, price: { luxury: 3800, premium: 2850 } },
      '11 × 11 ft': { area: { luxury: 10, premium: 10 }, price: { luxury: 2650, premium: 1950 } }
    }
  },
  {
    id: 'guest-bed-unit',
    name: 'Bed Unit with Back Panel',
    selected: false,
    quantity: 1,
    category: 'Guest Bedroom',
    pricing: {
      '10 × 10 ft': { area: { luxury: 24, premium: 24 }, price: { luxury: 3000, premium: 3000 } },
      '10 × 12 ft': { area: { luxury: 30, premium: 30 }, price: { luxury: 3700, premium: 3700 } },
      '11 × 11 ft': { area: { luxury: 27, premium: 27 }, price: { luxury: 3400, premium: 3400 } }
    }
  },

  // Living Room
  {
    id: 'living-tv-drawer',
    name: 'TV Drawer unit',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    pricing: {
      '7 × 10 ft': { area: { luxury: 60, premium: 15 }, price: { luxury: 21500, premium: 18500 } },
      '10 × 13 ft': { area: { luxury: 60, premium: 15 }, price: { luxury: 24500, premium: 21500 } },
      '12 × 18 ft': { area: { luxury: 60, premium: 15 }, price: { luxury: 29500, premium: 24500 } },
      '15 × 20 ft': { area: { luxury: 60, premium: 15 }, price: { luxury: 32500, premium: 29500 } }
    }
  },
  {
    id: 'living-tv-paneling',
    name: 'TV unit paneling',
    selected: false,
    quantity: 1,
    category: 'Living Room',
    pricing: {
      '7 × 10 ft': { area: { luxury: 60, premium: 40 }, price: { luxury: 1150, premium: 750 } },
      '10 × 13 ft': { area: { luxury: 80, premium: 60 }, price: { luxury: 1350, premium: 850 } },
      '12 × 18 ft': { area: { luxury: 95, premium: 75 }, price: { luxury: 1750, premium: 950 } },
      '15 × 20 ft': { area: { luxury: 110, premium: 80 }, price: { luxury: 2550, premium: 1250 } }
    }
  },

  // Pooja Room
  {
    id: 'pooja-unit',
    name: 'Pooja Unit',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    pricing: {
      '3 × 3 ft': { area: { luxury: 2, premium: 2 }, price: { luxury: 7500, premium: 4000 } },
      '9 × 9 ft': { area: { luxury: 6, premium: 6 }, price: { luxury: 5000, premium: 4000 } }
    }
  },
  {
    id: 'pooja-doors',
    name: 'Doors',
    selected: false,
    quantity: 1,
    category: 'Pooja Room',
    pricing: {
      '3 × 3 ft': { area: { luxury: 110, premium: 80 }, price: { luxury: 16000, premium: 13000 } },
      '9 × 9 ft': { area: { luxury: 110, premium: 80 }, price: { luxury: 13000, premium: 10000 } }
    }
  },

  // Modular Kitchen
  {
    id: 'kitchen-base-unit-parallel',
    name: 'Base Unit - Parallel',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 100, premium: 100 }, price: { luxury: 2850, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 120, premium: 120 }, price: { luxury: 2850, premium: 2050 } },
      '12 × 14 ft': { area: { luxury: 130, premium: 130 }, price: { luxury: 2850, premium: 2050 } }
    }
  },
  {
    id: 'kitchen-base-unit-l-shaped',
    name: 'Base Unit - L-Shaped',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 120, premium: 120 }, price: { luxury: 2850, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 130, premium: 130 }, price: { luxury: 2850, premium: 2050 } },
      '12 × 14 ft': { area: { luxury: 148, premium: 148 }, price: { luxury: 2850, premium: 2050 } }
    }
  },
  {
    id: 'kitchen-base-unit-island',
    name: 'Base Unit - Island',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 90, premium: 90 }, price: { luxury: 2850, premium: 2050 } },
      '10 × 12 ft': { area: { luxury: 100, premium: 100 }, price: { luxury: 2850, premium: 2050 } },
      '12 × 14 ft': { area: { luxury: 110, premium: 110 }, price: { luxury: 2850, premium: 2050 } }
    }
  },
  {
    id: 'kitchen-tandem-baskets',
    name: 'Tandem Baskets',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 6000, premium: 5000 } },
      '10 × 12 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 6000, premium: 5000 } },
      '12 × 14 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 6000, premium: 5000 } }
    }
  },
  {
    id: 'kitchen-bottle-pullout',
    name: 'Bottle Pullout',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 12000, premium: 7500 } },
      '10 × 12 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 12000, premium: 7500 } },
      '12 × 14 ft': { area: { luxury: 0, premium: 0 }, price: { luxury: 12000, premium: 7500 } }
    }
  },
  {
    id: 'kitchen-corner-unit',
    name: 'Corner Unit',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 27500, premium: 20500 } },
      '10 × 12 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 27500, premium: 20500 } },
      '12 × 14 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 27500, premium: 20500 } }
    }
  },
  {
    id: 'kitchen-wicker-basket',
    name: 'Wicker Basket',
    selected: false,
    quantity: 1,
    category: 'Modular Kitchen',
    pricing: {
      '8 × 10 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 8500, premium: 6500 } },
      '10 × 12 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 8500, premium: 6500 } },
      '12 × 14 ft': { area: { luxury: 1, premium: 1 }, price: { luxury: 8500, premium: 6500 } }
    }
  }
];

export const DEFAULT_SINGLE_LINE_ITEMS: SingleLineItem[] = [
  {
    id: 'false-ceiling',
    name: 'False Ceiling',
    selected: false,
    pricePerSqFt: 900
  },
  {
    id: 'ceiling-painting',
    name: 'Ceiling Painting',
    selected: false,
    pricePerSqFt: 200
  },
  {
    id: 'electrical-wiring',
    name: 'Electrical & Wiring',
    selected: false,
    pricePerSqFt: 250
  }
];

export const DEFAULT_SERVICE_ITEMS: ServiceItem[] = [
  // General Services (carpet area based pricing)
  { id: 'electrical', name: 'Electrical & Wiring', selected: false, basePrice: 0, pricePerSqFt: 250, description: 'Electrical work and wiring' },
  { id: 'false-ceiling', name: 'False Ceiling', selected: false, basePrice: 0, pricePerSqFt: 900, description: 'False ceiling installation' },
  { id: 'full-house-painting', name: 'Full House Painting', selected: false, basePrice: 0, pricePerSqFt: 200, description: 'Complete house painting' },
  { id: 'sofa-dining', name: 'Sofa & Dining Combo', selected: false, basePrice: 0, pricePerSqFt: 0, description: 'Sofa and dining table combo' },
  
  // Additional Add-ins with dynamic pricing
  { 
    id: 'sofa-premium', 
    name: 'Sofa (Premium)', 
    selected: false, 
    basePrice: 0, 
    pricePerSqFt: 0, 
    description: 'Premium quality sofa for 3BHK',
    pricing: {
      '2BHK': { 'Premium': 75000, 'Luxury': 90000 },
      '3BHK': { 'Premium': 110000, 'Luxury': 150000 }
    }
  },
  { 
    id: 'dining-table-premium', 
    name: 'Dining Table (Premium)', 
    selected: false, 
    basePrice: 0, 
    pricePerSqFt: 0, 
    description: 'Premium dining table for 3BHK',
    pricing: {
      '2BHK': { 'Premium': 60000, 'Luxury': 80000 },
      '3BHK': { 'Premium': 95000, 'Luxury': 125000 }
    }
  },
  { 
    id: 'carpets-premium', 
    name: 'Carpets (Premium)', 
    selected: false, 
    basePrice: 0, 
    pricePerSqFt: 0, 
    description: 'Premium carpets for 3BHK',
    pricing: {
      '2BHK': { 'Premium': 0, 'Luxury': 10000 },
      '3BHK': { 'Premium': 15000, 'Luxury': 35000 }
    }
  },
  { 
    id: 'designer-lights-premium', 
    name: 'Designer Lights (Premium)', 
    selected: false, 
    basePrice: 0, 
    pricePerSqFt: 0, 
    description: 'Premium designer lights for 3BHK',
    pricing: {
      '2BHK': { 'Premium': 8000, 'Luxury': 15000 },
      '3BHK': { 'Premium': 15000, 'Luxury': 22000 }
    }
  }
]; 