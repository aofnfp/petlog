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
import { VisitType } from '@/types';
import { VISIT_TYPE_LABELS } from '@/constants/vaccines';

const VISIT_TYPES: VisitType[] = [
  'wellness', 'vaccination', 'illness', 'injury', 'dental', 'surgery', 'emergency', 'followup', 'other',
];

export default function AddVetVisitScreen() {
  const router = useRouter();
  const { activePetId, addVetVisit } = usePetStore();

  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitType, setVisitType] = useState<VisitType>('wellness');
  const [clinicName, setClinicName] = useState('');
  const [vetName, setVetName] = useState('');
  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!activePetId) return;
    addVetVisit({
      petId: activePetId,
      visitDate,
      visitType,
      clinicName,
      vetName,
      reason,
      diagnosis,
      treatment,
      cost: cost ? parseFloat(cost) : null,
      followUpDate: null,
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
        <Text style={styles.headerTitle}>Log Vet Visit</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.fieldLabel}>VISIT DATE</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textTertiary}
          value={visitDate}
          onChangeText={setVisitDate}
        />

        <Text style={styles.fieldLabel}>VISIT TYPE</Text>
        <View style={styles.typeRow}>
          {VISIT_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, visitType === t && styles.typeChipActive]}
              onPress={() => setVisitType(t)}
            >
              <Text style={[styles.typeText, visitType === t && styles.typeTextActive]}>
                {VISIT_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>CLINIC NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Happy Paws Vet"
          placeholderTextColor={Colors.textTertiary}
          value={clinicName}
          onChangeText={setClinicName}
        />

        <Text style={styles.fieldLabel}>VET NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Dr. Rivera"
          placeholderTextColor={Colors.textTertiary}
          value={vetName}
          onChangeText={setVetName}
        />

        <Text style={styles.fieldLabel}>REASON / SYMPTOMS</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Why did you visit?"
          placeholderTextColor={Colors.textTertiary}
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <Text style={styles.fieldLabel}>DIAGNOSIS (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Vet's findings"
          placeholderTextColor={Colors.textTertiary}
          value={diagnosis}
          onChangeText={setDiagnosis}
        />

        <Text style={styles.fieldLabel}>TREATMENT (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Prescribed medications or procedures"
          placeholderTextColor={Colors.textTertiary}
          value={treatment}
          onChangeText={setTreatment}
        />

        <Text style={styles.fieldLabel}>COST (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="$0.00"
          placeholderTextColor={Colors.textTertiary}
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
        />

        <Text style={styles.fieldLabel}>NOTES (OPTIONAL)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Additional notes"
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
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  typeText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  typeTextActive: { color: '#FFF' },
});
