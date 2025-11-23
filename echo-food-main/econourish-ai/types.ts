export enum ConsumptionCategory {
  Produce = 'Produce',
  Dairy = 'Dairy',
  Protein = 'Protein',
  Grains = 'Grains',
  Snacks = 'Snacks',
  Other = 'Other',
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string; // YYYY-MM-DD
  category: ConsumptionCategory | string;
  addedDate: string;
}

export interface ConsumptionLog {
  date: string;
  category: string;
  wasted: boolean;
  amount: number; // arbitrary units or grams
}

export interface MealPlanDay {
  day: string;
  meals: {
    type: 'Breakfast' | 'Lunch' | 'Dinner';
    name: string;
    ingredients: string[];
    costEstimate: number;
    nutritionFocus: string;
  }[];
}

export interface SustainabilityMetrics {
  sdgScore: number; // 0-100
  wasteProjectionKg: number;
  moneySaved: number;
  suggestions: string[];
  weeklyTrends: { day: string; consumption: number; waste: number }[];
  categoryBreakdown: { name: string; value: number }[];
}

export interface CommunityPost {
  id: string;
  title: string;
  distance: string;
  type: 'Surplus' | 'Request';
  items: string[];
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}