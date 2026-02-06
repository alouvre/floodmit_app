import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useReports } from "../../context/ReportContext";
import { useRouter } from "expo-router";
import ReportCard from "../../components/reports/ReportCard";

export default function HomeScreen() {
  const { reports } = useReports();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Blue Header Section */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="white" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.locationLabel}>Your Location</Text>
              <View style={styles.locationSelector}>
                <Text style={styles.locationText}>Jakarta, Indonesia</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
              </View>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search for a location.."
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.content}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.dateText}>26/01/2026 16:45:00</Text>
          <Text style={styles.regionTitle}>Jakarta Utara</Text>
          <Text style={styles.statusDesc}>
            Banjir dengan ketinggian 2 meter
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.dotRed} />
              <Text style={styles.statusLabel}>Status: Siaga 1</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Ionicons name="location-sharp" size={14} color="#4A90E2" />
              <Text style={styles.distanceText}>
                1 km dari lokasimu saat ini
              </Text>
            </View>
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuaca hari ini</Text>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
        </View>

        <View style={styles.weatherGrid}>
          <WeatherItem
            label="Temperature"
            value="33.1°C"
            icon="thermometer"
            color="#4A90E2"
          />
          <WeatherItem
            label="Rainfall"
            value="0.0mm"
            icon="water"
            color="#4A90E2"
          />
          <WeatherItem
            label="Humidity"
            value="62%"
            icon="water-percent"
            color="#4A90E2"
          />
          <WeatherItem
            label="Wind Speed"
            value="3.1m/s"
            icon="weather-windy"
            color="#4A90E2"
          />
        </View>

        {/* Report History Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Laporan</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#666" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Cek apakah ada laporan */}
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="message-alert-outline"
              size={80}
              color="#A1CEDC"
            />
            <Text style={styles.emptyTitle}>Tidak ada Laporan Darurat</Text>
            <Text style={styles.emptyDesc}>
              Riwayat laporan darurat Anda akan muncul di sini. Klik tombol
              'Lapor' jika Anda memerlukan bantuan segera.
            </Text>
          </View>
        ) : (
          // 3. Render list laporan menggunakan map
          reports.map((item) => (
            <ReportCard
              key={item.id}
              report={item}
              isAdmin={false} // Mode User
              onPressDetail={() => {
                console.log("Membuka detail laporan:", item.id);
                router.push(`../report/${item.id}`);
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-component for Weather Grid
const WeatherItem = ({ label, value, icon, color }: any) => (
  <View style={styles.weatherCard}>
    <View style={styles.weatherHeader}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text style={styles.weatherLabel}>{label}</Text>
    </View>
    <Text style={styles.weatherValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF" },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: "#4A69E2",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
  },
  headerIcons: { flexDirection: "row", gap: 10 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  locationLabel: { color: "#CCD6FF", fontSize: 12 },
  locationSelector: { flexDirection: "row", alignItems: "center" },
  locationText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  searchBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  content: { flex: 1, padding: 20 },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  dateText: { color: "#999", fontSize: 12, marginBottom: 5 },
  regionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  statusDesc: { fontSize: 14, color: "#444", marginBottom: 15 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: { flexDirection: "row", alignItems: "center" },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginRight: 6,
  },
  statusLabel: { fontSize: 13, fontWeight: "600" },
  distanceBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  distanceText: { fontSize: 12, color: "#666" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginVertical: 20,
  },
  weatherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  weatherCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  weatherHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  weatherLabel: { fontSize: 12, color: "#8F9BB3", fontWeight: "600" },
  weatherValue: { fontSize: 20, fontWeight: "bold", color: "#2E3A59" },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterText: { fontSize: 12, color: "#4A5568" },
  emptyState: { alignItems: "center", marginTop: 20, paddingHorizontal: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 15,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#8F9BB3",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 5,
    lineHeight: 20,
  },
});
