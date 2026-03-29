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
import { MedicationFrequency } from '@/types';
import { FREQUENCY_LABELS } from '@/constants/vaccines';

const FREQUENCIES: MedicationFrequency[] = [
  'once_daily', 'twice_daily', 'three_times_daily', 'weekly', 'monthly',
];

const DOSAGE_UNITS = ['mg', 'ml', 'tablets', 'drops', 'capsules'];

export default function AddMedicationScreen() {
  const router = useRouter();
  const { activePetId, addMedication } = usePetStore();

  const [name, setName] = useState('');
  const [dosageAmount, setDosageAmount] = useState('');
  const [dosageUnit, setDosageUnit] = useState('mg');
  const [frequency, setFrequency] = useState<MedicationFrequency>('once_daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [prescribingVet, setPrescribingVet] = useState('');
  const [notes, setNotes] = useState('');

  const getDefaultTimes = (freq: MedicationFrequency): string[] => {
    switch (freq) {
      case 'twice_daily': return ['8:00 AM', '6:00 PM'];
      case 'three_times_daily': return ['8:00 AM', '1:00 PM', '8:00 PM'];
      default: return ['8:00 AM'];
    }
  };

  const handleSave = () => {
    if (!name.trim() || !dosageAmount || !activePetId) return;
    addMedication({
      petId: activePetId,
      name: name.trim(),
      dosageAmount: parseFloat(dosageAmount),
      dosageUnit,
      frequency,
      timesOfDay: getDefaultTimes(frequency),
      startDate,
      endDate: endDate || null,
      prescribingVet,
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
        <Text style={styles.headerTitle}>Add Medication</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!name.trim() || !dosageAmount}
        >
          <Text style={[styles.saveText, (!name.trim() || !dosageAmount) && { opacity: 0.4 }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.fieldLabel}>MEDICATION NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Carprofen"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>DOSAGE</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              placeholderTextColor={Colors.textTertiary}
              value={dosageAmount}
              onChangeText={setDosageAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>UNIT</Text>
            <View style={styles.unitRow}>
              {DOSAGE_UNITS.slice(0, 3).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitChip, dosageUnit === u && styles.unitChipActive]}
                  onPress={() => setDosageUnit(u)}
                >
                  <Text style={[styles.unitText, dosageUnit === u && styles.unitTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.fieldLabel}>FREQUENCY</Text>
        <View style={styles.freqRow}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.presetChip, frequency === f && styles.presetChipActive]}
              onPress={() => setFrequency(f)}
            >
              <Text style={[styles.presetText, frequency === f && styles.presetTextActive]}>
                {FREQUENCY_LABELS[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>START DATE</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textTertiary}
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.fieldLabel}>END DATE (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Leave blank for ongoing"
          placeholderTextColor={Colors.textTertiary}
          value={endDate}
          onChangeText={setEndDate}
        />

        <Text style={styles.fieldLabel}>PRESCRIBING VET (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Dr. Rivera"
          placeholderTextColor={Colors.textTertiary}
          value={prescribingVet}
          onChangeText={setPrescribingVet}
        />

        <Text style={styles.fieldLabel}>NOTES (OPTIONAL)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="e.g. Give with food"
          placeholderTextColor={Colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
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
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  twoCol: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  unitRow: { flexDirection: 'row', gap: 6 },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  unitText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  unitTextActive: { color: '#FFF' },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  presetText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  presetTextActive: { color: '#FFF' },
});
