import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { usePetStore } from '@/store/pet-store';
import { FREQUENCY_LABELS } from '@/constants/vaccines';

export default function RemindersScreen() {
  const {
    activePetId,
    vaccinations,
    medications,
    medicationDoses,
    feedingSchedules,
    pets,
  } = usePetStore();

  const pet = pets.find((p) => p.id === activePetId);
  const today = new Date().toISOString().split('T')[0];

  // Today's medication reminders
  const activeMeds = medications.filter((m) => m.petId === activePetId && m.isActive);
  const todaysDoses = activeMeds.flatMap((med) =>
    med.timesOfDay.map((time, i) => {
      const given = medicationDoses.filter(
        (d) =>
          d.medicationId === med.id &&
          d.scheduledAt.split('T')[0] === today &&
          d.status === 'given'
      );
      return {
        id: `${med.id}-${i}`,
        medId: med.id,
        petId: med.petId,
        title: `${med.name} ${med.dosageAmount}${med.dosageUnit}`,
        time: time || 'Morning',
        isDone: given.length > i,
        type: 'medication' as const,
      };
    })
  );

  // Upcoming vaccinations
  const upcomingVax = vaccinations
    .filter((v) => v.petId === activePetId && v.nextDueDate)
    .filter((v) => {
      const due = new Date(v.nextDueDate!);
      const now = new Date();
      const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 30 && daysUntil >= -30;
    })
    .sort((a, b) => (a.nextDueDate || '').localeCompare(b.nextDueDate || ''));

  // Overdue items
  const overdueVax = upcomingVax.filter(
    (v) => new Date(v.nextDueDate!) < new Date()
  );

  const upcomingOnly = upcomingVax.filter(
    (v) => new Date(v.nextDueDate!) >= new Date()
  );

  // Feeding schedules
  const activeFeedings = feedingSchedules.filter(
    (f) => f.petId === activePetId && f.isActive
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminders</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overdue */}
        {overdueVax.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: Colors.danger }]}>OVERDUE</Text>
            {overdueVax.map((vax) => (
              <View key={vax.id} style={[styles.card, { borderColor: '#F5D5D2' }]}>
                <View style={[styles.cardIcon, { backgroundColor: Colors.dangerLight }]}>
                  <Ionicons name="alert-circle" size={18} color={Colors.danger} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{vax.vaccineName}</Text>
                  <Text style={[styles.cardSub, { color: Colors.danger }]}>
                    Was due {formatDate(vax.nextDueDate!)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Today */}
        <Text style={styles.sectionLabel}>TODAY</Text>
        {todaysDoses.length > 0 ? (
          todaysDoses.map((dose) => (
            <View key={dose.id} style={styles.card}>
              <TouchableOpacity
                style={[styles.doseCheck, dose.isDone && styles.doseCheckDone]}
                onPress={() => {
                  if (!dose.isDone) {
                    usePetStore.getState().logDose(dose.medId, dose.petId, 'given');
                  }
                }}
              >
                {dose.isDone && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </TouchableOpacity>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, dose.isDone && styles.cardTitleDone]}>
                  {dose.title}
                </Text>
                <Text style={styles.cardSub}>{dose.time} dose{dose.isDone ? ' · Done' : ''}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No medication doses today</Text>
          </View>
        )}

        {activeFeedings.length > 0 && (
          <>
            {activeFeedings.map((feed) => (
              <View key={feed.id} style={styles.card}>
                <View style={[styles.cardIcon, { backgroundColor: Colors.orangeLight }]}>
                  <Ionicons name="restaurant-outline" size={16} color={Colors.orange} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{feed.foodName}</Text>
                  <Text style={styles.cardSub}>
                    {feed.mealTime}{feed.portionSize ? ` · ${feed.portionSize} ${feed.portionUnit}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Upcoming */}
        {upcomingOnly.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>UPCOMING (NEXT 30 DAYS)</Text>
            {upcomingOnly.map((vax) => {
              const daysUntil = Math.ceil(
                (new Date(vax.nextDueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysUntil <= 7;
              return (
                <View key={vax.id} style={styles.card}>
                  <View
                    style={[
                      styles.cardIcon,
                      { backgroundColor: isUrgent ? Colors.warningLight : Colors.blueLight },
                    ]}
                  >
                    <Ionicons
                      name={isUrgent ? 'warning-outline' : 'shield-checkmark-outline'}
                      size={16}
                      color={isUrgent ? Colors.warning : Colors.blue}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{vax.vaccineName}</Text>
                    <Text style={styles.cardSub}>
                      Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''} · {formatDate(vax.nextDueDate!)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {todaysDoses.length === 0 && overdueVax.length === 0 && upcomingOnly.length === 0 && activeFeedings.length === 0 && (
          <View style={[styles.emptyCard, { marginTop: 40 }]}>
            <Ionicons name="checkmark-circle-outline" size={40} color={Colors.accent} />
            <Text style={[styles.emptyText, { marginTop: 12 }]}>All caught up!</Text>
            <Text style={[styles.emptyTextSub]}>
              No reminders right now. Add vaccinations or medications to see reminders here.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    ...Typography.displayMedium,
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  content: { paddingHorizontal: 20 },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 10, marginTop: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { ...Typography.bodyMedium, fontWeight: '600', color: Colors.textPrimary },
  cardTitleDone: { textDecorationLine: 'line-through', color: Colors.textTertiary },
  cardSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
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
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: { ...Typography.bodyMedium, color: Colors.textTertiary },
  emptyTextSub: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', marginTop: 4, lineHeight: 18 },
});
