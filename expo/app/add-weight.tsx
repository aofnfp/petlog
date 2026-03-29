import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

export default function AddWeightScreen() {
  const router = useRouter();
  const { activePetId, weightUnit, addWeightEntry, pets, updatePet } = usePetStore();

  const [weight, setWeight] = useState('');
  const [measuredDate, setMeasuredDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!weight || !activePetId) return;
    const weightNum = parseFloat(weight);
    addWeightEntry({
      petId: activePetId,
      weight: weightNum,
      weightUnit,
      measuredDate,
      notes,
    });
    // Also update pet profile weight
    updatePet(activePetId, { weight: weightNum, weightUnit });
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
        <Text style={styles.headerTitle}>Log Weight</Text>
        <TouchableOpacity onPress={handleSave} disabled={!weight}>
          <Text style={[styles.saveText, !weight && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            placeholder="0.0"
            placeholderTextColor={Colors.textTertiary}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            autoFocus
          />
          <Text style={styles.weightUnitLabel}>{weightUnit}</Text>
        </View>

        <Text style={styles.fieldLabel}>DATE</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textTertiary}
          value={measuredDate}
          onChangeText={setMeasuredDate}
        />

        <Text style={styles.fieldLabel}>NOTES (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Vet scale, after grooming"
          placeholderTextColor={Colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
        />
      </View>
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
  content: { paddingHorizontal: 20, paddingTop: 40 },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 40,
  },
  weightInput: {
    ...Typography.displayLarge,
    fontSize: 64,
    color: Colors.textPrimary,
    textAlign: 'center',
    minWidth: 120,
  },
  weightUnitLabel: {
    ...Typography.displaySmall,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
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
});
