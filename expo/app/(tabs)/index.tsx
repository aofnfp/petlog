import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { usePetStore } from '@/store/pet-store';

export default function HomeScreen() {
  const router = useRouter();
  const {
    pets,
    activePetId,
    vaccinations,
    medications,
    vetVisits,
    weightEntries,
    medicationDoses,
    setActivePet,
  } = usePetStore();

  const pet = pets.find((p) => p.id === activePetId);
  if (!pet) return null;

  const petVaccinations = vaccinations.filter((v) => v.petId === pet.id);
  const petMedications = medications.filter((m) => m.petId === pet.id && m.isActive);
  const petVisits = vetVisits.filter((v) => v.petId === pet.id);
  const petWeights = weightEntries
    .filter((w) => w.petId === pet.id)
    .sort((a, b) => b.measuredDate.localeCompare(a.measuredDate));

  const latestWeight = petWeights[0]?.weight ?? pet.weight;
  const daysSinceLastVisit = petVisits.length > 0
    ? Math.floor(
        (Date.now() - new Date(petVisits.sort((a, b) => b.visitDate.localeCompare(a.visitDate))[0].visitDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const petAge = pet.dateOfBirth
    ? `${Math.floor((Date.now() - new Date(pet.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))} years`
    : pet.estimatedAgeMonths
    ? `${Math.floor(pet.estimatedAgeMonths / 12)} years`
    : '';

  // Upcoming vaccinations (due within 30 days)
  const upcomingVax = petVaccinations
    .filter((v) => v.nextDueDate && new Date(v.nextDueDate) > new Date())
    .sort((a, b) => (a.nextDueDate || '').localeCompare(b.nextDueDate || ''))
    .slice(0, 2);

  // Recent activity
  const recentActivity = [
    ...petVaccinations.map((v) => ({
      type: 'vaccination' as const,
      title: `${v.vaccineName} Vaccination`,
      subtitle: `${formatDate(v.dateAdministered)}${v.clinicName ? ' · ' + v.clinicName : ''}`,
      date: v.dateAdministered,
      icon: 'shield-checkmark' as const,
      color: Colors.blue,
    })),
    ...petVisits.map((v) => ({
      type: 'vet_visit' as const,
      title: `${v.visitType.charAt(0).toUpperCase() + v.visitType.slice(1)} visit`,
      subtitle: `${formatDate(v.visitDate)}${v.vetName ? ' · ' + v.vetName : ''}`,
      date: v.visitDate,
      icon: 'medkit' as const,
      color: Colors.success,
    })),
    ...petWeights.map((w) => ({
      type: 'weight' as const,
      title: `Weight logged — ${w.weight} ${w.weightUnit}`,
      subtitle: `${formatDate(w.measuredDate)}${w.notes ? ' · ' + w.notes : ''}`,
      date: w.measuredDate,
      icon: 'trending-up' as const,
      color: Colors.orange,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Pet Profile Header */}
      <View style={styles.header}>
        <View style={styles.petInfo}>
          <View style={styles.petAvatar}>
            <Ionicons name="paw" size={24} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>
              {pet.breed}{petAge ? ` · ${petAge}` : ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{latestWeight || '—'}</Text>
          <Text style={styles.statLabel}>LBS</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.accentLight }]}>
          <Text style={[styles.statNumber, { color: Colors.accent }]}>{petVaccinations.length}</Text>
          <Text style={styles.statLabel}>VACCINES</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.purpleLight }]}>
          <Text style={[styles.statNumber, { color: Colors.purple }]}>{petMedications.length}</Text>
          <Text style={styles.statLabel}>ACTIVE{'\n'}MEDS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{daysSinceLastVisit ?? '—'}</Text>
          <Text style={styles.statLabel}>DAYS AGO</Text>
        </View>
      </View>

      {/* Upcoming */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>UPCOMING</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/records' as any)}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {upcomingVax.length > 0 ? (
        upcomingVax.map((vax) => {
          const daysUntil = Math.ceil(
            (new Date(vax.nextDueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return (
            <View key={vax.id} style={styles.upcomingCard}>
              <View style={[styles.upcomingIcon, { backgroundColor: Colors.warningLight }]}>
                <Ionicons name="time-outline" size={20} color={Colors.warning} />
              </View>
              <View style={styles.upcomingText}>
                <Text style={styles.upcomingTitle}>{vax.vaccineName} due</Text>
                <Text style={styles.upcomingSubtitle}>
                  In {daysUntil} days · {formatDate(vax.nextDueDate!)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </View>
          );
        })
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming vaccinations</Text>
        </View>
      )}

      {/* Today's Medications */}
      {petMedications.length > 0 && (
        <>
          {petMedications.slice(0, 2).map((med) => {
            const todayDoses = medicationDoses.filter(
              (d) =>
                d.medicationId === med.id &&
                d.scheduledAt.split('T')[0] === new Date().toISOString().split('T')[0]
            );
            const isDone = todayDoses.some((d) => d.status === 'given');
            return (
              <View key={med.id} style={styles.medCard}>
                <View style={[styles.upcomingIcon, { backgroundColor: Colors.purpleLight }]}>
                  <Ionicons name="medical" size={20} color={Colors.purple} />
                </View>
                <View style={styles.upcomingText}>
                  <Text style={styles.upcomingTitle}>
                    {med.name} {med.dosageAmount}{med.dosageUnit}
                  </Text>
                  <Text style={styles.upcomingSubtitle}>
                    {med.timesOfDay[0] || 'Daily'} dose
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.checkbox, isDone && styles.checkboxDone]}
                  onPress={() => {
                    if (!isDone) {
                      usePetStore.getState().logDose(med.id, pet.id, 'given');
                    }
                  }}
                >
                  {isDone && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/timeline')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentActivity.length > 0 ? (
        recentActivity.map((item, index) => (
          <View key={index} style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={14} color="#FFF" />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No activity yet. Start by adding a record!</Text>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  petInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  petAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petName: { ...Typography.titleLarge, color: Colors.textPrimary },
  petBreed: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    ...Typography.displaySmall,
    color: Colors.textPrimary,
    fontSize: 26,
    lineHeight: 30,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textTertiary,
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: { ...Typography.label, color: Colors.textSecondary },
  viewAll: { ...Typography.bodySmall, color: Colors.accent, fontWeight: '600' },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  upcomingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingText: { flex: 1 },
  upcomingTitle: { ...Typography.titleMedium, color: Colors.textPrimary, fontSize: 15 },
  upcomingSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkbox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  activityDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: { flex: 1 },
  activityTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '600' },
  activitySubtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  emptyText: { ...Typography.bodyMedium, color: Colors.textTertiary },
});
