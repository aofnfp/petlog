export type Species = 'dog' | 'cat' | 'other';
export type WeightUnit = 'lbs' | 'kg';
export type DoseStatus = 'pending' | 'given' | 'skipped' | 'missed';
export type FeedingStatus = 'pending' | 'fed' | 'missed';
export type MedicationFrequency = 'once_daily' | 'twice_daily' | 'three_times_daily' | 'every_other_day' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type VisitType = 'wellness' | 'vaccination' | 'illness' | 'injury' | 'dental' | 'surgery' | 'emergency' | 'followup' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  dateOfBirth: string | null;
  estimatedAgeMonths: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  photoUri: string | null;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string | null;
  vetName: string;
  clinicName: string;
  lotNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosageAmount: number;
  dosageUnit: string;
  frequency: MedicationFrequency;
  timesOfDay: string[];
  startDate: string;
  endDate: string | null;
  prescribingVet: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  petId: string;
  scheduledAt: string;
  status: DoseStatus;
  loggedAt: string | null;
  skipReason: string;
  createdAt: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  visitDate: string;
  visitType: VisitType;
  clinicName: string;
  vetName: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  cost: number | null;
  followUpDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightEntry {
  id: string;
  petId: string;
  weight: number;
  weightUnit: WeightUnit;
  measuredDate: string;
  notes: string;
  createdAt: string;
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  foodName: string;
  portionSize: number | null;
  portionUnit: string;
  mealTime: string;
  specialInstructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedingLog {
  id: string;
  scheduleId: string;
  petId: string;
  fedAt: string | null;
  scheduledDate: string;
  status: FeedingStatus;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  petId: string;
  type: 'vaccination' | 'medication' | 'vet_visit' | 'weight' | 'milestone';
  title: string;
  subtitle: string;
  date: string;
  sourceId: string;
}
