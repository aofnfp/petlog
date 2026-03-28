export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'pescatarian' | 'paleo' | 'gluten-free';

export type Allergen = 'nuts' | 'dairy' | 'eggs' | 'shellfish' | 'soy' | 'gluten' | 'fish' | 'sesame';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'grains'
  | 'canned'
  | 'spices'
  | 'condiments'
  | 'frozen'
  | 'bakery'
  | 'other';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  isOptional: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  mealType: MealType;
  dietaryTags: DietType[];
  allergens: Allergen[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string | null;
  source: 'curated' | 'ai_generated';
}

export interface MealPlanItem {
  dayOfWeek: number; // 0=Mon, 6=Sun
  mealType: MealType;
  recipeId: string;
}

export interface MealPlan {
  id: string;
  weekStartDate: string;
  items: MealPlanItem[];
  createdAt: string;
}

export interface GroceryItem {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  isChecked: boolean;
  isManual: boolean;
  recipeCount: number;
}

export interface UserProfile {
  dietType: DietType;
  allergies: Allergen[];
  calorieTarget: number | null;
  hasCompletedOnboarding: boolean;
}

export const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
