import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { usePetStore } from '@/store/pet-store';
import { Species } from '@/types';
import { DOG_BREEDS, CAT_BREEDS } from '@/constants/vaccines';

type Step = 'welcome' | 'add-pet' | 'first-record';

export default function OnboardingScreen() {
  const router = useRouter();
  const { addPet, completeOnboarding } = usePetStore();
  const [step, setStep] = useState<Step>('welcome');

  // Pet form state
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddPet = () => {
    if (!petName.trim()) return;
    addPet({
      name: petName.trim(),
      species,
      breed: breed || 'Mixed/Other',
      dateOfBirth: dateOfBirth || null,
      estimatedAgeMonths: null,
      weight: weight ? parseFloat(weight) : null,
      weightUnit: 'lbs',
      photoUri: null,
      notes: '',
    });
    setStep('first-record');
  };

  const handleFinish = (action?: string) => {
    completeOnboarding();
    if (action === 'vaccination') {
      router.replace('/(tabs)');
      setTimeout(() => router.push('/add-vaccination'), 100);
    } else if (action === 'vet-visit') {
      router.replace('/(tabs)');
      setTimeout(() => router.push('/add-vet-visit'), 100);
    } else {
      router.replace('/(tabs)');
    }
  };

  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContent}>
          <View style={styles.iconCircle}>
            <View style={styles.iconInner}>
              <Ionicons name="paw" size={48} color={Colors.accent} />
            </View>
          </View>
          <Text style={styles.headline}>
            Every shot, every pill,{'\n'}every visit.
          </Text>
          <Text style={styles.subtitle}>
            A beautiful health journal for the pets you love. Track vaccinations,
            medications, and vet visits — all in one place.
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep('add-pet')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.privacyNote}>
            No account required. Your data stays on your device.
          </Text>
        </View>
      </View>
    );
  }

  if (step === 'add-pet') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepLabel}>STEP 1 OF 2</Text>
          <Text style={styles.formTitle}>Add your pet</Text>
          <Text style={styles.formSubtitle}>
            Tell us about your furry friend so we can set up their health profile.
          </Text>

          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-outline" size={40} color={Colors.accent} />
          </View>

          <Text style={styles.fieldLabel}>PET NAME</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Bella"
            placeholderTextColor={Colors.textTertiary}
            value={petName}
            onChangeText={setPetName}
          />

          <Text style={styles.fieldLabel}>SPECIES</Text>
          <View style={styles.speciesRow}>
            {(['dog', 'cat', 'other'] as Species[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.speciesButton, species === s && styles.speciesButtonActive]}
                onPress={() => setSpecies(s)}
              >
                <Text
                  style={[styles.speciesText, species === s && styles.speciesTextActive]}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>BREED</Text>
          <TextInput
            style={styles.textInput}
            placeholder={species === 'dog' ? 'Golden Retriever' : species === 'cat' ? 'Domestic Shorthair' : 'Breed'}
            placeholderTextColor={Colors.textTertiary}
            value={breed}
            onChangeText={setBreed}
          />

          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Mar 15, 2024"
                placeholderTextColor={Colors.textTertiary}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.fieldLabel}>WEIGHT</Text>
              <TextInput
                style={styles.textInput}
                placeholder="42 lbs"
                placeholderTextColor={Colors.textTertiary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.primaryButton, !petName.trim() && styles.buttonDisabled]}
            onPress={handleAddPet}
            disabled={!petName.trim()}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // first-record step
  return (
    <View style={styles.container}>
      <View style={styles.firstRecordContent}>
        <Text style={styles.stepLabel}>STEP 2 OF 2</Text>
        <Text style={styles.formTitle}>Add your first record</Text>
        <Text style={styles.formSubtitle}>
          Start tracking {petName}'s health right away, or skip and explore the app first.
        </Text>

        <TouchableOpacity
          style={styles.recordOption}
          onPress={() => handleFinish('vaccination')}
        >
          <View style={[styles.recordIcon, { backgroundColor: Colors.blueLight }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={Colors.blue} />
          </View>
          <View style={styles.recordOptionText}>
            <Text style={styles.recordOptionTitle}>Add a vaccination</Text>
            <Text style={styles.recordOptionSub}>Log shots and set reminders</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordOption}
          onPress={() => handleFinish('vet-visit')}
        >
          <View style={[styles.recordIcon, { backgroundColor: Colors.successLight }]}>
            <Ionicons name="medkit-outline" size={24} color={Colors.success} />
          </View>
          <View style={styles.recordOptionText}>
            <Text style={styles.recordOptionTitle}>Log a vet visit</Text>
            <Text style={styles.recordOptionSub}>Record your last appointment</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => handleFinish()}
        >
          <Text style={styles.skipText}>I'll do this later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    ...Typography.displayLarge,
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  privacyNote: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 12,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  stepLabel: {
    ...Typography.label,
    color: Colors.accent,
    marginBottom: 8,
  },
  formTitle: {
    ...Typography.displayMedium,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  speciesButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  speciesButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  speciesText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  speciesTextActive: {
    color: '#FFFFFF',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfColumn: {
    flex: 1,
  },
  firstRecordContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  recordOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  recordOptionText: {
    flex: 1,
  },
  recordOptionTitle: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  recordOptionSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  skipText: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
});
