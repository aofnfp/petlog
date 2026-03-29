import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={18} color={Colors.accent} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: March 29, 2026</Text>

        <Text style={styles.body}>
          PetLog is developed by the Abraham Oladotun Foundation NFP ("we", "us",
          "our"). This Privacy Policy explains how we handle your information when you
          use PetLog.
        </Text>

        <Text style={styles.heading}>Data We Collect</Text>
        <Text style={styles.body}>
          PetLog is designed with privacy first. All your data stays on your device.
        </Text>
        <Text style={styles.bullet}>
          - Pet profiles, health records, vaccination schedules, medication logs, vet
          visits, and weight history are stored locally on your device.
        </Text>
        <Text style={styles.bullet}>
          - We do not collect, transmit, or store any personal data on external servers.
        </Text>
        <Text style={styles.bullet}>
          - We do not require account creation or login.
        </Text>

        <Text style={styles.heading}>Sensitive Data</Text>
        <Text style={styles.body}>
          PetLog stores pet health information you provide, including vaccination
          records, medication schedules, and veterinary visit history. This data is kept
          exclusively on your device and is never transmitted to our servers or any third
          party. You may delete this data at any time from Settings.
        </Text>

        <Text style={styles.heading}>Third-Party Services</Text>
        <Text style={styles.body}>
          PetLog uses the following third-party services:
        </Text>
        <Text style={styles.bullet}>
          - Google AdMob: Displays ads in the free version. AdMob may collect device
          identifiers and usage data for ad personalization. See Google's Privacy Policy
          at https://policies.google.com/privacy
        </Text>
        <Text style={styles.bullet}>
          - RevenueCat: Manages in-app subscriptions. RevenueCat processes purchase
          transactions through Apple App Store or Google Play. See RevenueCat's Privacy
          Policy at https://www.revenuecat.com/privacy
        </Text>

        <Text style={styles.heading}>Advertising</Text>
        <Text style={styles.body}>
          The free version of PetLog displays ads via Google AdMob. You can remove ads
          by subscribing to PetLog Premium. We request non-personalized ads by default.
          On iOS, you may be asked for tracking permission under Apple's App Tracking
          Transparency framework.
        </Text>

        <Text style={styles.heading}>In-App Purchases</Text>
        <Text style={styles.body}>
          PetLog offers optional premium subscriptions processed through the Apple App
          Store or Google Play Store. We do not directly handle any payment information.
          All billing is managed by Apple or Google per their respective terms.
        </Text>

        <Text style={styles.heading}>Children's Privacy</Text>
        <Text style={styles.body}>
          PetLog is not directed at children under 13. We do not knowingly collect
          personal information from children.
        </Text>

        <Text style={styles.heading}>Data Deletion</Text>
        <Text style={styles.body}>
          You can delete all app data at any time from Settings {'>'} Delete All Data.
          Uninstalling the app removes all locally stored data.
        </Text>

        <Text style={styles.heading}>Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy from time to time. The updated version will
          be indicated by the "Last updated" date at the top of this page.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.body}>
          If you have questions about this Privacy Policy, contact us at:
          privacy@abrahamoladotun.org
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    minHeight: 44,
  },
  backText: {
    ...Typography.bodyMedium,
    fontWeight: '500',
    color: Colors.accent,
  },
  title: {
    ...Typography.displaySmall,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  updated: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: 24,
  },
  heading: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  body: {
    ...Typography.bodyMedium,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  bullet: {
    ...Typography.bodyMedium,
    lineHeight: 22,
    color: Colors.textPrimary,
    paddingLeft: 16,
    marginBottom: 4,
  },
});
