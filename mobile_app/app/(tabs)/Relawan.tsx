import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RelawanScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Ikon Placeholder sesuai tema */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={80}
            color="#4A69E2"
          />
        </View>

        <Text style={styles.title}>Fitur Relawan</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Segera Hadir</Text>
        </View>

        <Text style={styles.description}>
          Fitur manajemen dan pendaftaran relawan saat ini sedang dalam tahap
          pengembangan.
          {"\n\n"}
          Kami berencana menambahkan fitur ini setelah fase **MVP (Minimum
          Viable Product)** berjalan dengan stabil untuk memastikan koordinasi
          bantuan yang lebih efektif.
        </Text>

        <View style={styles.footerInfo}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color="#8F9BB3"
          />
          <Text style={styles.footerText}>
            Pantau pembaruan sistem secara berkala.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF", // Background konsisten dengan Beranda
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#EBF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#4A69E2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  description: {
    textAlign: "center",
    color: "#8F9BB3",
    fontSize: 15,
    lineHeight: 24,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 6,
  },
  footerText: {
    color: "#8F9BB3",
    fontSize: 12,
  },
});
