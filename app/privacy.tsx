import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/store/theme-context';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },
    backBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingVertical: 12,
    },
    backText: { fontSize: 15, fontWeight: '500', color: colors.primary },
    title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    updated: { fontSize: 13, color: colors.textSecondary, marginBottom: 24 },
    heading: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 8 },
    body: { fontSize: 14, lineHeight: 22, color: colors.textPrimary, marginBottom: 12 },
    bullet: { fontSize: 14, lineHeight: 22, color: colors.textPrimary, paddingLeft: 16, marginBottom: 4 },
  }), [colors]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.updated}>Last updated: March 28, 2026</Text>

          <Text style={styles.body}>
            FocusFlow is developed by the Abraham Oladotun Foundation NFP ("we", "us", "our").
            This Privacy Policy explains how we handle your information when you use FocusFlow.
          </Text>

          <Text style={styles.heading}>Data We Collect</Text>
          <Text style={styles.body}>
            FocusFlow is designed with privacy first. All your data stays on your device.
          </Text>
          <Text style={styles.bullet}>- Timer settings, session history, tags, and preferences are stored locally on your device using AsyncStorage.</Text>
          <Text style={styles.bullet}>- We do not collect, transmit, or store any personal data on external servers.</Text>
          <Text style={styles.bullet}>- We do not require account creation or login.</Text>

          <Text style={styles.heading}>Third-Party Services</Text>
          <Text style={styles.body}>FocusFlow uses the following third-party services:</Text>
          <Text style={styles.bullet}>- Google AdMob: Displays ads in the free version. AdMob may collect device identifiers and usage data for ad personalization. See Google's Privacy Policy at https://policies.google.com/privacy</Text>
          <Text style={styles.bullet}>- RevenueCat: Manages in-app subscriptions. RevenueCat processes purchase transactions through Apple App Store or Google Play. See RevenueCat's Privacy Policy at https://www.revenuecat.com/privacy</Text>

          <Text style={styles.heading}>Advertising</Text>
          <Text style={styles.body}>
            The free version of FocusFlow displays ads via Google AdMob. You can remove ads by
            subscribing to FocusFlow Premium. We request non-personalized ads by default. On iOS,
            you may be asked for tracking permission under Apple's App Tracking Transparency framework.
          </Text>

          <Text style={styles.heading}>In-App Purchases</Text>
          <Text style={styles.body}>
            FocusFlow offers optional premium subscriptions processed through the Apple App Store
            or Google Play Store. We do not directly handle any payment information. All billing
            is managed by Apple or Google per their respective terms.
          </Text>

          <Text style={styles.heading}>Children's Privacy</Text>
          <Text style={styles.body}>
            FocusFlow is not directed at children under 13. We do not knowingly collect
            personal information from children.
          </Text>

          <Text style={styles.heading}>Data Deletion</Text>
          <Text style={styles.body}>
            You can delete all app data at any time from Settings {">"} Clear All Data.
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
      </SafeAreaView>
    </View>
  );
}
