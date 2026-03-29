import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { usePetStore } from '@/store/pet-store';
import { getPresetsForSpecies } from '@/constants/vaccines';

export default function AddVaccinationScreen() {
  const router = useRouter();
  const { activePetId, pets, addVaccination } = usePetStore();
  const pet = pets.find((p) => p.id === activePetId);

  const presets = pet ? getPresetsForSpecies(pet.species) : [];

  const [vaccineName, setVaccineName] = useState('');
  const [dateAdministered, setDateAdministered] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [nextDueDate, setNextDueDate] = useState('');
  const [vetName, setVetName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [notes, setNotes] = useState('');

  const selectPreset = (preset: typeof presets[0]) => {
    setVaccineName(preset.name);
    const due = new Date(dateAdministered);
    due.setMonth(due.getMonth() + preset.intervalMonths);
    setNextDueDate(due.toISOString().split('T')[0]);
  };

  const handleSave = () => {
    if (!vaccineName.trim() || !activePetId) return;
    addVaccination({
      petId: activePetId,
      vaccineName: vaccineName.trim(),
      dateAdministered,
      nextDueDate: nextDueDate || null,
      vetName,
      clinicName,
      lotNumber,
      notes,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vaccination</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!vaccineName.trim()}
        >
          <Text style={[styles.saveText, !vaccineName.trim() && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Presets */}
        {presets.length > 0 && (
          <>
            <Text style={styles.fieldLabel}>COMMON VACCINES</Text>
            <View style={styles.presetRow}>
              {presets.map((p) => (
                <TouchableOpacity
                  key={p.name}
                  style={[styles.presetChip, vaccineName === p.name && styles.presetChipActive]}
                  onPress={() => selectPreset(p)}
                >
                  <Text style={[styles.presetText, vaccineName === p.name && styles.presetTextActive]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.fieldLabel}>VACCINE NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Rabies"
          placeholderTextColor={Colors.textTertiary}
          value={vaccineName}
          onChangeText={setVaccineName}
        />

        <Text style={styles.fieldLabel}>DATE ADMINISTERED</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textTertiary}
          value={dateAdministered}
          onChangeText={setDateAdministered}
        />

        <Text style={styles.fieldLabel}>NEXT DUE DATE</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (auto-calculated)"
          placeholderTextColor={Colors.textTertiary}
          value={nextDueDate}
          onChangeText={setNextDueDate}
        />

        <Text style={styles.fieldLabel}>VET / CLINIC NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Happy Paws Vet"
          placeholderTextColor={Colors.textTertiary}
          value={clinicName}
          onChangeText={setClinicName}
        />

        <Text style={styles.fieldLabel}>LOT NUMBER (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="For recall tracking"
          placeholderTextColor={Colors.textTertiary}
          value={lotNumber}
          onChangeText={setLotNumber}
        />

        <Text style={styles.fieldLabel}>NOTES (OPTIONAL)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Any additional notes"
          placeholderTextColor={Colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { ...Typography.titleMedium, color: Colors.textPrimary },
  saveText: { ...Typography.titleMedium, color: Colors.accent },
  content: { paddingHorizontal: 20 },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8, marginTop: 20 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  presetText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  presetTextActive: { color: '#FFF' },
});
