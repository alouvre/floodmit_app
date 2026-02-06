import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useWaterLevel } from "@/context/WaterLevelContext";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

export default function WaterLevelDetail() {
  const { id } = useLocalSearchParams();
  const { stations, loading } = useWaterLevel();
  const router = useRouter();

  // 1. Cari data berdasarkan ID
  const station = stations.find((s) => s.id === id);

  // 2. Loading State
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A69E2" />
      </View>
    );
  }

  // 3. Error State (Data tidak ditemukan)
  if (!station) {
    return (
      <View style={styles.center}>
        <Text>Data Pintu Air tidak ditemukan.</Text>
      </View>
    );
  }

  // 4. Transformasi Data untuk Grafik
  const chartData = {
    labels: station.history.map((h) => h.time),
    datasets: [{ data: station.history.map((h) => h.level) }],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.stationName}>{station.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{station.status}</Text>
        </View>
      </View>

      {/* Main Stat Card */}
      <View style={styles.currentLevelCard}>
        <Text style={styles.label}>Tinggi Air Terkini</Text>
        <Text style={styles.bigValue}>
          {station.currentLevel} <Text style={styles.unit}>cm</Text>
        </Text>
      </View>

      {/* Grafik Statistik */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Tren 24 Jam Terakhir</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier // Membuat garis melengkung (smooth)
          style={styles.chartStyle}
        />
      </View>

      {/* Ringkasan Riwayat (List) */}
      <View style={styles.historyList}>
        <Text style={styles.sectionTitle}>Riwayat Per Jam</Text>
        {station.history
          .slice()
          .reverse()
          .map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyTime}>{item.time}</Text>
              <Text style={styles.historyLevel}>{item.level} cm</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

// Konfigurasi Visual Grafik
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 105, 226, ${opacity})`, // Warna Biru Utama
  labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#4A69E2",
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 25 },
  stationName: { fontSize: 24, fontWeight: "bold", color: "#2D3748" },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 5,
  },
  statusText: { color: "#2B6CB0", fontWeight: "bold", fontSize: 12 },
  currentLevelCard: {
    backgroundColor: "#4A69E2",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  label: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  bigValue: { color: "white", fontSize: 42, fontWeight: "bold" },
  unit: { fontSize: 18, fontWeight: "normal" },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4A5568",
  },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
  historyList: { marginBottom: 40 },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  historyTime: { color: "#718096" },
  historyLevel: { fontWeight: "bold", color: "#2D3748" },
});
