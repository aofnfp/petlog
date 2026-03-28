import { Species } from '@/types';

export interface VaccinePreset {
  name: string;
  species: Species[];
  intervalMonths: number;
}

export const VACCINE_PRESETS: VaccinePreset[] = [
  // Dogs
  { name: 'Rabies', species: ['dog', 'cat'], intervalMonths: 12 },
  { name: 'DHPP (Distemper/Parvo)', species: ['dog'], intervalMonths: 12 },
  { name: 'Bordetella', species: ['dog'], intervalMonths: 12 },
  { name: 'Leptospirosis', species: ['dog'], intervalMonths: 12 },
  { name: 'Canine Influenza', species: ['dog'], intervalMonths: 12 },
  { name: 'Lyme Disease', species: ['dog'], intervalMonths: 12 },
  // Cats
  { name: 'FVRCP', species: ['cat'], intervalMonths: 36 },
  { name: 'FeLV (Feline Leukemia)', species: ['cat'], intervalMonths: 12 },
  { name: 'FIV', species: ['cat'], intervalMonths: 12 },
];

export const getPresetsForSpecies = (species: Species): VaccinePreset[] =>
  VACCINE_PRESETS.filter((v) => v.species.includes(species));

export const DOG_BREEDS = [
  'Mixed/Other', 'Labrador Retriever', 'Golden Retriever', 'German Shepherd',
  'French Bulldog', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Dachshund',
  'Yorkshire Terrier', 'Boxer', 'Siberian Husky', 'Great Dane', 'Doberman Pinscher',
  'Australian Shepherd', 'Cavalier King Charles', 'Shih Tzu', 'Boston Terrier',
  'Pomeranian', 'Havanese', 'Bernese Mountain Dog', 'Cocker Spaniel', 'Border Collie',
  'Chihuahua', 'Maltese', 'Corgi', 'Pit Bull', 'Miniature Schnauzer', 'Samoyed',
];

export const CAT_BREEDS = [
  'Mixed/Other', 'Domestic Shorthair', 'Domestic Longhair', 'Siamese', 'Persian',
  'Maine Coon', 'Ragdoll', 'Bengal', 'Abyssinian', 'British Shorthair',
  'Scottish Fold', 'Sphynx', 'Russian Blue', 'Burmese', 'Birman',
  'Norwegian Forest', 'Turkish Angora', 'Devon Rex', 'Cornish Rex', 'Tonkinese',
];

export const VISIT_TYPE_LABELS: Record<string, string> = {
  wellness: 'Wellness Check',
  vaccination: 'Vaccination',
  illness: 'Illness',
  injury: 'Injury',
  dental: 'Dental',
  surgery: 'Surgery',
  emergency: 'Emergency',
  followup: 'Follow-up',
  other: 'Other',
};

export const FREQUENCY_LABELS: Record<string, string> = {
  once_daily: 'Once daily',
  twice_daily: 'Twice daily',
  three_times_daily: '3x daily',
  every_other_day: 'Every other day',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
  custom: 'Custom',
};
