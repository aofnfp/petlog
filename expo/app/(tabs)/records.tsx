import React, { useState } from 'react';
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
import { FREQUENCY_LABELS } from '@/constants/vaccines';

type RecordTab = 'vaccinations' | 'medications' | 'weight';

export default function RecordsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RecordTab>('vaccinations');
  const { activePetId, vaccinations, medications, weightEntries, medicationDoses } = usePetStore();

  const petVax = vaccinations
    .filter((v) => v.petId === activePetId)
    .sort((a, b) => b.dateAdministered.localeCompare(a.dateAdministered));

  const petMeds = medications.filter((m) => m.petId === activePetId);
  const activeMeds = petMeds.filter((m) => m.isActive);
  const petWeights = weightEntries
    .filter((w) => w.petId === activePetId)
    .sort((a, b) => b.measuredDate.localeCompare(a.measuredDate));

  const upcomingVax = petVax.filter((v) => v.nextDueDate && new Date(v.nextDueDate) > new Date());
  const overdueVax = petVax.filter(
    (v) => v.nextDueDate && new Date(v.nextDueDate) < new Date()
  );
  const completedVax = petVax.filter((v) => !v.nextDueDate || !overdueVax.includes(v));

  const getAddRoute = () => {
    if (activeTab === 'vaccinations') return '/add-vaccination';
    if (activeTab === 'medications') return '/add-medication';
    return '/add-weight';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Records</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push(getAddRoute() as any)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        {(['vaccinations', 'medications', 'weight'] as RecordTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'vaccinations' && (
          <>
            {overdueVax.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>OVERDUE</Text>
                {overdueVax.map((vax) => (
                  <View key={vax.id} style={[styles.vaxCard, { backgroundColor: Colors.dangerLight, borderColor: '#F5D5D2' }]}>
                    <View style={[styles.vaxIcon, { backgroundColor: Colors.dangerLight }]}>
                      <Ionicons name="alert-circle" size={18} color={Colors.danger} />
                    </View>
                    <View style={styles.vaxText}>
                      <Text style={[styles.vaxName, { color: Colors.danger }]}>
                        {vax.vaccineName} — Overdue
                      </Text>
                      <Text style={styles.vaxSub}>Was due {formatDate(vax.nextDueDate!)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                  </View>
                ))}
              </>
            )}

            {upcomingVax.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>UPCOMING</Text>
                {upcomingVax.map((vax) => {
                  const daysUntil = Math.ceil(
                    (new Date(vax.nextDueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <View key={vax.id} style={styles.vaxCard}>
                      <View style={[styles.vaxIcon, { backgroundColor: Colors.blueLight }]}>
                        <Ionicons name="shield-checkmark" size={16} color={Colors.blue} />
                      </View>
                      <View style={styles.vaxText}>
                        <Text style={styles.vaxName}>{vax.vaccineName}</Text>
                        <Text style={[styles.vaxSub, { color: Colors.accent }]}>
                          Due in {daysUntil} days · {formatDate(vax.nextDueDate!)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                    </View>
                  );
                })}
              </>
            )}

            <Text style={styles.sectionLabel}>COMPLETED</Text>
            {petVax.length > 0 ? (
              petVax.map((vax) => (
                <View key={vax.id} style={styles.vaxCard}>
                  <View style={[styles.vaxIcon, { backgroundColor: Colors.successLight }]}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                  <View style={styles.vaxText}>
                    <Text style={styles.vaxName}>{vax.vaccineName}</Text>
                    <Text style={styles.vaxSub}>
                      {formatDate(vax.dateAdministered)}{vax.clinicName ? ' · ' + vax.clinicName : ''}
                    </Text>
                  </View>
                  {vax.nextDueDate && (
                    <View style={styles.nextBadge}>
                      <Text style={styles.nextBadgeText}>Next: {formatShortDate(vax.nextDueDate)}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No vaccinations logged yet</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'medications' && (
          <>
            {/* Today's Doses */}
            {activeMeds.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>TODAY'S DOSES</Text>
                {activeMeds.map((med) => {
                  const todayDoses = medicationDoses.filter(
                    (d) =>
                      d.medicationId === med.id &&
                      d.scheduledAt.split('T')[0] === new Date().toISOString().split('T')[0] &&
                      d.status === 'given'
                  );
                  return med.timesOfDay.map((time, i) => {
                    const isDone = todayDoses.length > i;
                    return (
                      <View key={`${med.id}-${i}`} style={styles.doseCard}>
                        <TouchableOpacity
                          style={[styles.doseCheck, isDone && styles.doseCheckDone]}
                          onPress={() => {
                            if (!isDone) {
                              usePetStore.getState().logDose(med.id, med.petId, 'given');
                            }
                          }}
                        >
                          {isDone && <Ionicons name="checkmark" size={14} color="#FFF" />}
                        </TouchableOpacity>
                        <View style={styles.doseText}>
                          <Text style={[styles.vaxName, isDone && styles.doseNameDone]}>
                            {med.name} {med.dosageAmount}{med.dosageUnit}
                          </Text>
                          <Text style={styles.vaxSub}>
                            {time || 'Morning'}{isDone ? ' · Given' : ''}
                          </Text>
                        </View>
                      </View>
                    );
                  });
                })}
              </>
            )}

            <Text style={styles.sectionLabel}>ACTIVE MEDICATIONS</Text>
            {activeMeds.length > 0 ? (
              activeMeds.map((med) => {
                const streak = medicationDoses.filter(
                  (d) => d.medicationId === med.id && d.status === 'given'
                ).length;
                return (
                  <View key={med.id} style={styles.medCardRecord}>
                    <View style={[styles.vaxIcon, { backgroundColor: Colors.purpleLight }]}>
                      <Ionicons name="medical" size={16} color={Colors.purple} />
                    </View>
                    <View style={styles.vaxText}>
                      <Text style={styles.vaxName}>{med.name}</Text>
                      <Text style={styles.vaxSub}>
                        {med.dosageAmount}{med.dosageUnit} · {FREQUENCY_LABELS[med.frequency] || med.frequency}
                        {med.notes ? ` · ${med.notes}` : ''}
                      </Text>
                      <View style={styles.streakRow}>
                        <View style={styles.streakBar}>
                          <View style={[styles.streakFill, { width: `${Math.min(streak * 7, 100)}%` }]} />
                        </View>
                        <Text style={styles.streakText}>{streak}-day streak</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active medications</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'weight' && (
          <>
            {petWeights.length > 0 && (
              <>
                <View style={styles.weightHeader}>
                  <Text style={styles.weightCurrent}>{petWeights[0].weight.toFixed(1)}</Text>
                  <View style={styles.stableBadge}>
                    <Ionicons name="trending-up" size={14} color={Colors.accent} />
                    <Text style={styles.stableBadgeText}>Stable</Text>
                  </View>
                </View>
                <Text style={styles.weightUnit}>
                  {petWeights[0].weightUnit} · {formatDate(petWeights[0].measuredDate)}
                </Text>

                {/* Simple chart placeholder */}
                <View style={styles.chartPlaceholder}>
                  <View style={styles.chartBar} />
                  <Text style={styles.chartLabel}>Weight trend</Text>
                </View>
              </>
            )}

            <Text style={styles.sectionLabel}>HISTORY</Text>
            {petWeights.length > 0 ? (
              petWeights.map((w, i) => {
                const prev = petWeights[i + 1];
                const diff = prev ? w.weight - prev.weight : 0;
                return (
                  <View key={w.id} style={styles.weightRow}>
                    <Text style={styles.weightValue}>{w.weight.toFixed(1)} {w.weightUnit}</Text>
                    <Text style={styles.weightDate}>{formatDate(w.measuredDate)}</Text>
                    <Text
                      style={[
                        styles.weightDiff,
                        { color: diff > 0 ? Colors.accent : diff < 0 ? Colors.danger : Colors.textTertiary },
                      ]}
                    >
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No weight entries yet</Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 16,
  },
  title: { ...Typography.displayMedium, color: Colors.textPrimary },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabText: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: '#FFF' },
  content: { paddingHorizontal: 20 },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  vaxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vaxIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vaxText: { flex: 1 },
  vaxName: { ...Typography.bodyMedium, fontWeight: '600', color: Colors.textPrimary },
  vaxSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  nextBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nextBadgeText: { ...Typography.caption, color: Colors.accent, fontWeight: '600', fontSize: 11 },
  doseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  doseCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doseCheckDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  doseText: { flex: 1 },
  doseNameDone: { textDecorationLine: 'line-through', color: Colors.textTertiary },
  medCardRecord: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  streakBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
  },
  streakFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.purple,
  },
  streakText: { ...Typography.caption, color: Colors.purple, fontWeight: '600', fontSize: 11 },
  weightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  weightCurrent: { ...Typography.displayLarge, color: Colors.textPrimary, fontSize: 48 },
  stableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  stableBadgeText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },
  weightUnit: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4 },
  chartPlaceholder: {
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartBar: {
    width: '60%',
    height: 3,
    backgroundColor: Colors.orangeLight,
    borderRadius: 2,
  },
  chartLabel: { ...Typography.caption, color: Colors.textTertiary, marginTop: 8 },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  weightValue: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.textPrimary, width: 90 },
  weightDate: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
  weightDiff: { ...Typography.bodySmall, fontWeight: '600', width: 50, textAlign: 'right' },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: { ...Typography.bodyMedium, color: Colors.textTertiary },
});
