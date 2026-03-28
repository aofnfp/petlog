import { SEED_RECIPES } from '@/constants/recipes';
import { Recipe, MealPlan, MealPlanItem, GroceryItem, UserProfile, MealType, IngredientCategory } from '@/types';

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function filterRecipes(recipes: Recipe[], profile: UserProfile): Recipe[] {
  return recipes.filter((recipe) => {
    // Exclude recipes with user's allergens
    for (const allergen of profile.allergies) {
      if (recipe.allergens.includes(allergen)) return false;
    }
    // Match dietary tags
    if (profile.dietType !== 'omnivore') {
      if (!recipe.dietaryTags.includes(profile.dietType)) return false;
    }
    return true;
  });
}

export function generateMealPlan(profile: UserProfile): MealPlan {
  const eligible = filterRecipes(SEED_RECIPES, profile);
  const breakfasts = shuffleArray(eligible.filter((r) => r.mealType === 'breakfast'));
  const lunches = shuffleArray(eligible.filter((r) => r.mealType === 'lunch'));
  const dinners = shuffleArray(eligible.filter((r) => r.mealType === 'dinner'));

  const items: MealPlanItem[] = [];
  for (let day = 0; day < 7; day++) {
    const pickRecipe = (pool: Recipe[], mealType: MealType) => {
      const recipe = pool[day % pool.length];
      items.push({ dayOfWeek: day, mealType, recipeId: recipe.id });
    };
    if (breakfasts.length > 0) pickRecipe(breakfasts, 'breakfast');
    if (lunches.length > 0) pickRecipe(lunches, 'lunch');
    if (dinners.length > 0) pickRecipe(dinners, 'dinner');
  }

  const monday = getMonday(new Date());
  return {
    id: `plan-${Date.now()}`,
    weekStartDate: monday.toISOString().split('T')[0],
    items,
    createdAt: new Date().toISOString(),
  };
}

export function getSwapAlternatives(
  currentRecipeId: string,
  mealType: MealType,
  profile: UserProfile,
  count = 3
): Recipe[] {
  const eligible = filterRecipes(SEED_RECIPES, profile).filter(
    (r) => r.mealType === mealType && r.id !== currentRecipeId
  );
  return shuffleArray(eligible).slice(0, count);
}

export function generateGroceryList(plan: MealPlan): GroceryItem[] {
  const aggregated: Record<string, GroceryItem> = {};

  for (const item of plan.items) {
    const recipe = SEED_RECIPES.find((r) => r.id === item.recipeId);
    if (!recipe) continue;

    for (const ing of recipe.ingredients) {
      if (ing.isOptional) continue;
      const key = ing.name.toLowerCase();
      if (aggregated[key]) {
        aggregated[key].quantity += ing.quantity;
        aggregated[key].recipeCount += 1;
      } else {
        aggregated[key] = {
          id: `gi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          ingredientName: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category,
          isChecked: false,
          isManual: false,
          recipeCount: 1,
        };
      }
    }
  }

  return Object.values(aggregated).sort((a, b) => {
    const catOrder: IngredientCategory[] = ['produce', 'dairy', 'meat', 'seafood', 'grains', 'bakery', 'canned', 'spices', 'condiments', 'frozen', 'other'];
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
  });
}

export function getRecipeById(id: string): Recipe | undefined {
  return SEED_RECIPES.find((r) => r.id === id);
}
