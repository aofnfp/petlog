import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlan, GroceryItem, MealPlanItem, MealType } from '@/types';
import { generateMealPlan, generateGroceryList, getRecipeById } from '@/lib/plan-generator';
import { useUserStore } from './user-store';

interface MealState {
  currentPlan: MealPlan | null;
  groceryItems: GroceryItem[];
  favorites: string[]; // recipe IDs
  planHistory: MealPlan[];
  selectedDay: number; // 0=Mon to 6=Sun

  generateNewPlan: () => void;
  swapMeal: (dayOfWeek: number, mealType: MealType, newRecipeId: string) => void;
  toggleGroceryItem: (id: string) => void;
  addManualGroceryItem: (name: string, quantity: number, unit: string) => void;
  clearCheckedGrocery: () => void;
  toggleFavorite: (recipeId: string) => void;
  setSelectedDay: (day: number) => void;
  deleteAllData: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      groceryItems: [],
      favorites: [],
      planHistory: [],
      selectedDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, // Mon=0

      generateNewPlan: () => {
        const userState = useUserStore.getState();
        const plan = generateMealPlan({
          dietType: userState.dietType,
          allergies: userState.allergies,
          calorieTarget: userState.calorieTarget,
          hasCompletedOnboarding: userState.hasCompletedOnboarding,
        });
        const grocery = generateGroceryList(plan);
        set((state) => ({
          currentPlan: plan,
          groceryItems: grocery,
          planHistory: [plan, ...state.planHistory].slice(0, 12),
        }));
      },

      swapMeal: (dayOfWeek, mealType, newRecipeId) => {
        set((state) => {
          if (!state.currentPlan) return state;
          const items = state.currentPlan.items.map((item) =>
            item.dayOfWeek === dayOfWeek && item.mealType === mealType
              ? { ...item, recipeId: newRecipeId }
              : item
          );
          const updatedPlan = { ...state.currentPlan, items };
          return {
            currentPlan: updatedPlan,
            groceryItems: generateGroceryList(updatedPlan),
          };
        });
      },

      toggleGroceryItem: (id) =>
        set((state) => ({
          groceryItems: state.groceryItems.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
          ),
        })),

      addManualGroceryItem: (name, quantity, unit) =>
        set((state) => ({
          groceryItems: [
            {
              id: `manual-${Date.now()}`,
              ingredientName: name,
              quantity,
              unit,
              category: 'other',
              isChecked: false,
              isManual: true,
              recipeCount: 0,
            },
            ...state.groceryItems,
          ],
        })),

      clearCheckedGrocery: () =>
        set((state) => ({
          groceryItems: state.groceryItems.filter((item) => !item.isChecked),
        })),

      toggleFavorite: (recipeId) =>
        set((state) => ({
          favorites: state.favorites.includes(recipeId)
            ? state.favorites.filter((id) => id !== recipeId)
            : [...state.favorites, recipeId],
        })),

      setSelectedDay: (day) => set({ selectedDay: day }),

      deleteAllData: () =>
        set({
          currentPlan: null,
          groceryItems: [],
          favorites: [],
          planHistory: [],
          selectedDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
        }),
    }),
    {
      name: 'mealmate-meals',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
