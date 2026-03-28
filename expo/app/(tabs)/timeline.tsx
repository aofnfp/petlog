import React, { useState } from 'react';
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
import { VISIT_TYPE_LABELS, FREQUENCY_LABELS } from '@/constants/vaccines';

type FilterType = 'all' | 'vaccines' | 'meds' | 'vet' | 'weight';

const FILTER_COLORS: Record<string, string> = {
  vaccines: Colors.blue,
  meds: Colors.purple,
  vet: Colors.success,
  weight: Colors.orange,
};

export default function TimelineScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { activePetId, vaccinations, medications, vetVisits, weightEntries } = usePetStore();

  const events = buildTimeline(activePetId, vaccinations, medications, vetVisits, weightEntries, filter);

  // Group events by month
  const grouped: Record<string, typeof events> = {};
  events.forEach((e) => {
    const monthKey = new Date(e.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(e);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline</Text>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {(['vaccines', 'meds', 'vet', 'weight'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <View style={[styles.filterDot, { backgroundColor: FILTER_COLORS[f] }]} />
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {Object.entries(grouped).map(([month, items]) => (
          <View key={month}>
            <Text style={styles.monthLabel}>{month.toUpperCase()}</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.eventRow}>
                <View style={[styles.eventDot, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={14} color="#FFF" />
                </View>
                <View style={styles.eventText}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventSub}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {events.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No events yet. Start by adding a record!</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function buildTimeline(
  petId: string | null,
  vaccinations: any[],
  medications: any[],
  vetVisits: any[],
  weightEntries: any[],
  filter: FilterType
) {
  if (!petId) return [];
  const events: any[] = [];

  if (filter === 'all' || filter === 'vaccines') {
    vaccinations
      .filter((v) => v.petId === petId)
      .forEach((v) => {
        events.push({
          id: `vax-${v.id}`,
          type: 'vaccination',
          title: `${v.vaccineName} Vaccination`,
          subtitle: `${formatDate(v.dateAdministered)}${v.clinicName ? ' · ' + v.clinicName : ''}${v.nextDueDate ? ' · Next due ' + formatShortDate(v.nextDueDate) : ''}`,
          date: v.dateAdministered,
          icon: 'shield-checkmark',
          color: Colors.blue,
        });
      });
  }

  if (filter === 'all' || filter === 'meds') {
    medications
      .filter((m) => m.petId === petId)
      .forEach((m) => {
        events.push({
          id: `med-${m.id}`,
          type: 'medication',
          title: `${m.name} started`,
          subtitle: `${m.dosageAmount}${m.dosageUnit} ${FREQUENCY_LABELS[m.frequency] || m.frequency}${m.prescribingVet ? ' · ' + m.prescribingVet : ''}`,
          date: m.startDate,
          icon: 'medical',
          color: Colors.purple,
        });
      });
  }

  if (filter === 'all' || filter === 'vet') {
    vetVisits
      .filter((v) => v.petId === petId)
      .forEach((v) => {
        events.push({
          id: `visit-${v.id}`,
          type: 'vet_visit',
          title: VISIT_TYPE_LABELS[v.visitType] || 'Vet Visit',
          subtitle: `${formatDate(v.visitDate)}${v.vetName ? ' · ' + v.vetName : ''}${v.reason ? ' · ' + v.reason : ''}`,
          date: v.visitDate,
          icon: 'medkit',
          color: Colors.success,
        });
      });
  }

  if (filter === 'all' || filter === 'weight') {
    weightEntries
      .filter((w) => w.petId === petId)
      .forEach((w) => {
        events.push({
          id: `wt-${w.id}`,
          type: 'weight',
          title: `Weight: ${w.weight} ${w.weightUnit}`,
          subtitle: `${formatDate(w.measuredDate)}${w.notes ? ' · ' + w.notes : ''}`,
          date: w.measuredDate,
          icon: 'trending-up',
          color: Colors.orange,
        });
      });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { ...Typography.displayMedium, color: Colors.textPrimary, paddingHorizontal: 20, paddingTop: 60 },
  filterScroll: { marginTop: 16, maxHeight: 44 },
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  filterChipActive: { backgroundColor: Colors.textPrimary, borderColor: Colors.textPrimary },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#FFF' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  monthLabel: { ...Typography.label, color: Colors.textTertiary, marginBottom: 12, marginTop: 16 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: 12,
  },
  eventDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  eventText: { flex: 1 },
  eventTitle: { ...Typography.bodyMedium, fontWeight: '600', color: Colors.textPrimary },
  eventSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 3, lineHeight: 18 },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 40,
  },
  emptyText: { ...Typography.bodyMedium, color: Colors.textTertiary },
});
