import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pet,
  Vaccination,
  Medication,
  MedicationDose,
  VetVisit,
  WeightEntry,
  FeedingSchedule,
  FeedingLog,
  Species,
  WeightUnit,
  MedicationFrequency,
  VisitType,
  DoseStatus,
} from '@/types';

interface PetState {
  hasCompletedOnboarding: boolean;
  pets: Pet[];
  activePetId: string | null;
  vaccinations: Vaccination[];
  medications: Medication[];
  medicationDoses: MedicationDose[];
  vetVisits: VetVisit[];
  weightEntries: WeightEntry[];
  feedingSchedules: FeedingSchedule[];
  feedingLogs: FeedingLog[];
  weightUnit: WeightUnit;

  // Onboarding
  completeOnboarding: () => void;

  // Pet CRUD
  addPet: (pet: Omit<Pet, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => string;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  setActivePet: (id: string) => void;

  // Vaccinations
  addVaccination: (vax: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVaccination: (id: string, updates: Partial<Vaccination>) => void;
  deleteVaccination: (id: string) => void;

  // Medications
  addMedication: (med: Omit<Medication, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  discontinueMedication: (id: string) => void;
  logDose: (medicationId: string, petId: string, status: DoseStatus, skipReason?: string) => void;

  // Vet Visits
  addVetVisit: (visit: Omit<VetVisit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVetVisit: (id: string, updates: Partial<VetVisit>) => void;
  deleteVetVisit: (id: string) => void;

  // Weight
  addWeightEntry: (entry: Omit<WeightEntry, 'id' | 'createdAt'>) => void;
  deleteWeightEntry: (id: string) => void;

  // Feeding
  addFeedingSchedule: (schedule: Omit<FeedingSchedule, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateFeedingSchedule: (id: string, updates: Partial<FeedingSchedule>) => void;
  deleteFeedingSchedule: (id: string) => void;
  logFeeding: (scheduleId: string, petId: string) => void;

  // Settings
  setWeightUnit: (unit: WeightUnit) => void;
  deleteAllData: () => void;
}

const now = () => new Date().toISOString();
const uuid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      pets: [],
      activePetId: null,
      vaccinations: [],
      medications: [],
      medicationDoses: [],
      vetVisits: [],
      weightEntries: [],
      feedingSchedules: [],
      feedingLogs: [],
      weightUnit: 'lbs',

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      addPet: (pet) => {
        const id = uuid();
        const newPet: Pet = {
          ...pet,
          id,
          isActive: true,
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          pets: [...state.pets, newPet],
          activePetId: state.activePetId || id,
        }));
        return id;
      },

      updatePet: (id, updates) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: now() } : p
          ),
        })),

      deletePet: (id) =>
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== id),
          activePetId: state.activePetId === id
            ? state.pets.find((p) => p.id !== id)?.id || null
            : state.activePetId,
          vaccinations: state.vaccinations.filter((v) => v.petId !== id),
          medications: state.medications.filter((m) => m.petId !== id),
          medicationDoses: state.medicationDoses.filter((d) => d.petId !== id),
          vetVisits: state.vetVisits.filter((v) => v.petId !== id),
          weightEntries: state.weightEntries.filter((w) => w.petId !== id),
          feedingSchedules: state.feedingSchedules.filter((f) => f.petId !== id),
          feedingLogs: state.feedingLogs.filter((f) => f.petId !== id),
        })),

      setActivePet: (id) => set({ activePetId: id }),

      addVaccination: (vax) =>
        set((state) => ({
          vaccinations: [
            ...state.vaccinations,
            { ...vax, id: uuid(), createdAt: now(), updatedAt: now() },
          ],
        })),

      updateVaccination: (id, updates) =>
        set((state) => ({
          vaccinations: state.vaccinations.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: now() } : v
          ),
        })),

      deleteVaccination: (id) =>
        set((state) => ({
          vaccinations: state.vaccinations.filter((v) => v.id !== id),
        })),

      addMedication: (med) =>
        set((state) => ({
          medications: [
            ...state.medications,
            { ...med, id: uuid(), isActive: true, createdAt: now(), updatedAt: now() },
          ],
        })),

      updateMedication: (id, updates) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: now() } : m
          ),
        })),

      discontinueMedication: (id) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, isActive: false, endDate: now().split('T')[0], updatedAt: now() } : m
          ),
        })),

      logDose: (medicationId, petId, status, skipReason = '') =>
        set((state) => ({
          medicationDoses: [
            ...state.medicationDoses,
            {
              id: uuid(),
              medicationId,
              petId,
              scheduledAt: now(),
              status,
              loggedAt: status === 'given' ? now() : null,
              skipReason,
              createdAt: now(),
            },
          ],
        })),

      addVetVisit: (visit) =>
        set((state) => ({
          vetVisits: [
            ...state.vetVisits,
            { ...visit, id: uuid(), createdAt: now(), updatedAt: now() },
          ],
        })),

      updateVetVisit: (id, updates) =>
        set((state) => ({
          vetVisits: state.vetVisits.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: now() } : v
          ),
        })),

      deleteVetVisit: (id) =>
        set((state) => ({
          vetVisits: state.vetVisits.filter((v) => v.id !== id),
        })),

      addWeightEntry: (entry) =>
        set((state) => ({
          weightEntries: [
            ...state.weightEntries,
            { ...entry, id: uuid(), createdAt: now() },
          ],
        })),

      deleteWeightEntry: (id) =>
        set((state) => ({
          weightEntries: state.weightEntries.filter((w) => w.id !== id),
        })),

      addFeedingSchedule: (schedule) =>
        set((state) => ({
          feedingSchedules: [
            ...state.feedingSchedules,
            { ...schedule, id: uuid(), isActive: true, createdAt: now(), updatedAt: now() },
          ],
        })),

      updateFeedingSchedule: (id, updates) =>
        set((state) => ({
          feedingSchedules: state.feedingSchedules.map((f) =>
            f.id === id ? { ...f, ...updates, updatedAt: now() } : f
          ),
        })),

      deleteFeedingSchedule: (id) =>
        set((state) => ({
          feedingSchedules: state.feedingSchedules.filter((f) => f.id !== id),
          feedingLogs: state.feedingLogs.filter((l) => l.scheduleId !== id),
        })),

      logFeeding: (scheduleId, petId) =>
        set((state) => ({
          feedingLogs: [
            ...state.feedingLogs,
            {
              id: uuid(),
              scheduleId,
              petId,
              fedAt: now(),
              scheduledDate: now().split('T')[0],
              status: 'fed',
              createdAt: now(),
            },
          ],
        })),

      setWeightUnit: (unit) => set({ weightUnit: unit }),

      deleteAllData: () =>
        set({
          hasCompletedOnboarding: false,
          pets: [],
          activePetId: null,
          vaccinations: [],
          medications: [],
          medicationDoses: [],
          vetVisits: [],
          weightEntries: [],
          feedingSchedules: [],
          feedingLogs: [],
        }),
    }),
    {
      name: 'petlog-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
