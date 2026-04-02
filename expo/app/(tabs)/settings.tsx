import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { usePetStore } from '@/store/pet-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { pets, weightUnit, setWeightUnit, deleteAllData } = usePetStore();

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all pets and health records. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => deleteAllData(),
        },
      ]
    );
  };

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, 'This feature is coming soon in a future update.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Premium Banner — clearly labeled as coming soon */}
        <View style={styles.premiumBanner}>
          <View style={styles.premiumHeader}>
            <Ionicons name="star" size={20} color="#F5C842" />
            <Text style={styles.premiumTitle}>PetLog Premium</Text>
          </View>
          <Text style={styles.premiumDesc}>
            Unlimited pets, health reports, document storage, and no ads. Coming soon!
          </Text>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => showComingSoon('PetLog Premium')}
            accessibilityLabel="PetLog Premium coming soon"
            accessibilityRole="button"
          >
            <Text style={styles.premiumButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Profiles */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => router.push('/(tabs)')}
            accessibilityLabel="View pet profiles"
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="paw" size={16} color={Colors.accent} />
            </View>
            <Text style={styles.rowLabel}>Pet Profiles</Text>
            <Text style={styles.rowValue}>{pets.length} pet{pets.length !== 1 ? 's' : ''}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => showComingSoon('Add New Pet')}
            accessibilityLabel="Add new pet, premium feature coming soon"
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="add" size={16} color={Colors.accent} />
            </View>
            <Text style={styles.rowLabel}>Add New Pet</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>SOON</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => setWeightUnit(weightUnit === 'lbs' ? 'kg' : 'lbs')}
            accessibilityLabel={`Weight unit, currently ${weightUnit}. Tap to toggle.`}
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.orangeLight }]}>
              <Ionicons name="trending-up" size={16} color={Colors.orange} />
            </View>
            <Text style={styles.rowLabel}>Weight Unit</Text>
            <Text style={styles.rowValue}>{weightUnit}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => showComingSoon('Notifications')}
            accessibilityLabel="Notifications, coming soon"
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.warningLight }]}>
              <Ionicons name="notifications-outline" size={16} color={Colors.warning} />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>SOON</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => showComingSoon('Reminder Times')}
            accessibilityLabel="Reminder times, coming soon"
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.blueLight }]}>
              <Ionicons name="time-outline" size={16} color={Colors.blue} />
            </View>
            <Text style={styles.rowLabel}>Reminder Times</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>SOON</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => router.push('/privacy')}
            accessibilityLabel="Privacy Policy"
            accessibilityRole="link"
          >
            <Text style={styles.rowLabelPlain}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() =>
              Alert.alert(
                'About PetLog',
                'PetLog v1.0\n\nA beautiful health journal for the pets you love. Track vaccinations, medications, and vet visits — all in one place.\n\nBy Abraham Oladotun Foundation NFP.'
              )
            }
            accessibilityLabel="About PetLog, version 1.0"
            accessibilityRole="button"
          >
            <Text style={styles.rowLabelPlain}>About PetLog</Text>
            <Text style={styles.rowValue}>v1.0</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleDeleteAll}
          accessibilityLabel="Delete all data"
          accessibilityRole="button"
        >
          <Text style={styles.deleteText}>Delete All Data</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          PetLog is a health record tracker, not a substitute for veterinary advice.
          Always follow your veterinarian's instructions.
        </Text>

        <Text style={styles.brandingText}>App by aoftech</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
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
  premiumBanner: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  premiumTitle: { ...Typography.titleMedium, color: '#FFF' },
  premiumDesc: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  premiumButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  premiumButtonText: { ...Typography.titleMedium, color: Colors.accent, fontSize: 15 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1, fontWeight: '500' },
  rowLabelPlain: { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1 },
  rowValue: { ...Typography.bodySmall, color: Colors.textTertiary, marginRight: 6 },
  comingSoonBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  comingSoonBadgeText: { ...Typography.label, color: Colors.accent, fontSize: 9 },
  deleteText: {
    ...Typography.bodyMedium,
    color: Colors.danger,
    textAlign: 'center',
    paddingVertical: 16,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
    marginTop: 8,
  },
  brandingText: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 24,
  },
});
