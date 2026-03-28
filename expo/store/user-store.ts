import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DietType, Allergen } from '@/types';

interface UserState extends UserProfile {
  setDietType: (diet: DietType) => void;
  toggleAllergy: (allergen: Allergen) => void;
  setAllergies: (allergies: Allergen[]) => void;
  setCalorieTarget: (target: number | null) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  dietType: 'omnivore',
  allergies: [],
  calorieTarget: 2000,
  hasCompletedOnboarding: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE,
      setDietType: (diet) => set({ dietType: diet }),
      toggleAllergy: (allergen) =>
        set((state) => ({
          allergies: state.allergies.includes(allergen)
            ? state.allergies.filter((a) => a !== allergen)
            : [...state.allergies, allergen],
        })),
      setAllergies: (allergies) => set({ allergies }),
      setCalorieTarget: (target) => set({ calorieTarget: target }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetProfile: () => set(DEFAULT_PROFILE),
    }),
    {
      name: 'mealmate-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
