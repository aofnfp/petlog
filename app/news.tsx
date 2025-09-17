import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HamburgerHeader from "@/components/HamburgerHeader";
import { colors } from "@/constants/colors";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

export default function NewsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <HamburgerHeader title="News" navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>News & Updates</Text>
        <Text style={styles.subtitle}>Stay updated with the latest features</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});