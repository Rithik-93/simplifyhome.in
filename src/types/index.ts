export interface HomeDetails {
  homeType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '';
  carpetArea: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  selected: boolean;
  length: number;
  width: number;
  pricePerSqFt: number;
  category: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  selected: boolean;
  basePrice: number;
  pricePerSqFt: number;
  description: string;
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
  serviceItems: ServiceItem[];
  userDetails: UserDetails;
  estimate: EstimateItem[];
  finalPrice: number;
}

export const DEFAULT_FURNITURE_ITEMS: FurnitureItem[] = [
  // Foyer & Outside Area
  { id: 'shoe-rack', name: 'Shoe Rack', selected: false, length: 6, width: 2, pricePerSqFt: 1200, category: 'Foyer & Outside Area' },
  { id: 'safety-door', name: 'Safety Door', selected: false, length: 7, width: 3, pricePerSqFt: 800, category: 'Foyer & Outside Area' },
  { id: 'name-plate', name: 'Name Plate Area Panelling', selected: false, length: 3, width: 2, pricePerSqFt: 900, category: 'Foyer & Outside Area' },
  
  // Living Room
  { id: 'tv-unit', name: 'Grand TV Unit', selected: false, length: 8, width: 6, pricePerSqFt: 1500, category: 'Living Room' },
  { id: 'crockery-unit', name: 'Crockery Unit', selected: false, length: 6, width: 8, pricePerSqFt: 1400, category: 'Living Room' },
  { id: 'bar-unit', name: 'Bar Unit', selected: false, length: 4, width: 2, pricePerSqFt: 1600, category: 'Living Room' },
  { id: 'book-shelf', name: 'Book Shelf', selected: false, length: 6, width: 2, pricePerSqFt: 1100, category: 'Living Room' },
  { id: 'wall-paper-living', name: 'Wall Paper', selected: false, length: 12, width: 10, pricePerSqFt: 200, category: 'Living Room' },
  { id: 'temple-design', name: 'Temple Design', selected: false, length: 3, width: 2, pricePerSqFt: 2000, category: 'Living Room' },
  { id: 'sofa-back-wall', name: 'Sofa Back Wall Panelling', selected: false, length: 8, width: 8, pricePerSqFt: 800, category: 'Living Room' },
  { id: 'dining-wall', name: 'Dining Wall Panelling', selected: false, length: 6, width: 8, pricePerSqFt: 800, category: 'Living Room' },
  { id: 'diamond-mirror', name: 'Diamond Mirror Wall', selected: false, length: 6, width: 8, pricePerSqFt: 1200, category: 'Living Room' },
  
  // Bedroom 01
  { id: 'wardrobe', name: 'Wardrobe', selected: false, length: 8, width: 6, pricePerSqFt: 1800, category: 'Bedroom 01' },
  { id: 'loft', name: 'Loft', selected: false, length: 8, width: 2, pricePerSqFt: 1200, category: 'Bedroom 01' },
  { id: 'dressing', name: 'Dressing', selected: false, length: 4, width: 2, pricePerSqFt: 1500, category: 'Bedroom 01' },
  { id: 'bed', name: 'Bed', selected: false, length: 6, width: 6, pricePerSqFt: 1000, category: 'Bedroom 01' },
  { id: 'bed-back-rest', name: 'Bed Back Rest with Fabric', selected: false, length: 6, width: 1, pricePerSqFt: 1500, category: 'Bedroom 01' },
  { id: 'side-table', name: 'Side Table', selected: false, length: 2, width: 1, pricePerSqFt: 1200, category: 'Bedroom 01' },
  { id: 'working-table', name: 'Working Table', selected: false, length: 4, width: 2, pricePerSqFt: 1300, category: 'Bedroom 01' },
  { id: 'mini-tv-unit', name: 'Mini TV Unit', selected: false, length: 4, width: 2, pricePerSqFt: 1100, category: 'Bedroom 01' },
  { id: 'wall-paper-bedroom', name: 'Wall Paper', selected: false, length: 10, width: 8, pricePerSqFt: 200, category: 'Bedroom 01' },
  { id: 'bed-back-wall-laminate', name: 'Bed Back Wall Laminate Panelling', selected: false, length: 6, width: 8, pricePerSqFt: 900, category: 'Bedroom 01' },
];

export const DEFAULT_SERVICE_ITEMS: ServiceItem[] = [
  { id: 'electrical', name: 'Electrical', selected: false, basePrice: 0, pricePerSqFt: 80, description: 'Complete electrical work with Polycab wires' },
  { id: 'false-ceiling', name: 'False Ceiling', selected: false, basePrice: 0, pricePerSqFt: 150, description: 'Gypsum false ceiling with LED lights' },
  { id: 'sofa-dining', name: 'Sofa 5 Seater with Dining 4 Seater', selected: false, basePrice: 85000, pricePerSqFt: 0, description: 'Premium sofa set with dining table' },
  { id: 'full-house-painting', name: 'Full House Painting', selected: false, basePrice: 0, pricePerSqFt: 45, description: 'Asian Royal Paint - Royal Shine' },
]; 