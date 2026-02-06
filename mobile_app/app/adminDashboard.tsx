import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useReports } from "../context/ReportContext";
import { useWaterLevel, WaterStation } from "../context/WaterLevelContext";
import ReportCard from "../components/reports/ReportCard";

// Sub-komponen Item Menu
const MenuLink = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Feather name={icon} size={20} color="#2E3A59" />
    <Text style={styles.menuLabel}>{label}</Text>
    <Feather name="chevron-right" size={16} color="#BDBDBD" />
  </TouchableOpacity>
);

export default function AdminDashboard() {
  const { reports } = useReports();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const adminName = "Zavran";
  const { stations: waterData, loading } = useWaterLevel();

  // Menghitung statistik berdasarkan status laporan
  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const respondedCount = reports.filter((r) => r.status === "Responded").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Blue Header Section */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="grid-outline" size={24} color="white" />
          </TouchableOpacity>

          <Modal
            animationType="none"
            transparent={true}
            visible={menuVisible}
            onRequestClose={() => setMenuVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.sidebarContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                  {/* Profile Section */}
                  <View style={styles.profileSection}>
                    <View style={styles.avatarCircle}>
                      <Ionicons name="person" size={40} color="#4A69E2" />
                    </View>
                    <Text style={styles.adminTitle}>Admin {adminName}</Text>
                    <Text style={styles.adminRole}>Super Admin</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Menu Items */}
                  <View style={styles.menuList}>
                    <MenuLink
                      icon="home"
                      label="Dashboard"
                      onPress={() => setMenuVisible(false)}
                    />
                    <MenuLink
                      icon="users"
                      label="Data Pintu Air Jakarta"
                      onPress={() => {}}
                    />
                    <MenuLink
                      icon="settings"
                      label="Pengaturan"
                      onPress={() => {}}
                    />

                    <View style={styles.logoutContainer}>
                      <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => router.replace("/onboarding")}
                      >
                        <Feather name="log-out" size={20} color="#FF4D4D" />
                        <Text style={styles.logoutText}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </SafeAreaView>
              </View>
              {/* Area transparan untuk menutup modal saat diklik di luar */}
              <Pressable
                style={styles.closeArea}
                onPress={() => setMenuVisible(false)}
              />
            </View>
          </Modal>

          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Monitoring Card (Water Level) */}
        <View style={styles.monitoringCard}>
          <View style={styles.cardHeader}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>Prioritas Tinggi</Text>
            </View>
            <Text style={styles.timeText}>16:45 WIB</Text>
          </View>

          <Text style={styles.locationTitle}>Jakarta Utara</Text>
          <Text style={styles.subTitle}>Pintu Air Utama</Text>

          {/* Water Level Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperItem}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>↑ 205cm</Text>
              </View>
              <View style={[styles.dot, styles.dotActive]} />
              <Text style={styles.stationName}>P.A. Marina{"\n"}Ancol</Text>
            </View>
            {/* 1. Render Garis Latar Belakang (Diletakkan pertama agar berada di layer bawah) */}
            {waterData.length > 1 && <View style={styles.stepperLine} />}

            {/* 2. Loop Data Pintu Air secara Dinamis */}
            {waterData.map((station: WaterStation, index: number) => (
              <TouchableOpacity
                key={station.id}
                style={styles.stepperItem}
                onPress={() =>
                  router.push({
                    pathname: "/admin/statistics/[id]",
                    params: { id: station.id },
                  })
                }
              >
                {/* Badge Angka/Level */}
                <View
                  style={[
                    styles.levelBadge,
                    station.currentLevel > 200 && {
                      borderColor: "#FF4D4D",
                      backgroundColor: "#FFF5F5",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelText,
                      station.currentLevel > 200 && { color: "#FF4D4D" },
                    ]}
                  >
                    ↑ {station.currentLevel}cm
                  </Text>
                </View>

                {/* Titik (Dot) */}
                <View
                  style={[
                    styles.dot,
                    station.currentLevel > 200 && styles.dotActive,
                  ]}
                />

                {/* Nama Stasiun */}
                <Text style={styles.stationName}>
                  {station.name.replace(" ", "\n")}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.stepperLine} />
            <View style={styles.stepperItem}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>↑ 205cm</Text>
              </View>
              <View style={styles.dot} />
              <Text style={styles.stationName}>Pompa{"\n"}Pasar Ikan</Text>
            </View>
            <View style={styles.stepperLine} />
            <View style={styles.stepperItem}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>↑ 205cm</Text>
              </View>
              <View style={styles.dot} />
              <Text style={styles.stationName}>Rumah{"\n"}Pompa Pluit</Text>
            </View>
          </View>

          {/* Pagination dots for card */}
          <View style={styles.cardPagination}>
            <View style={[styles.cardDot, styles.cardDotActive]} />
            {[...Array(6)].map((_, i) => (
              <View key={i} style={styles.cardDot} />
            ))}
          </View>
        </View>

        {/* Statistics Grid */}
        <Text style={styles.sectionTitle}>
          Statistik Laporan{" "}
          <Ionicons name="information-circle-outline" size={16} />
        </Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statsCard, { borderColor: "#E2E8F0" }]}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsLabel}>Total Reports</Text>
              <MaterialCommunityIcons
                name="chart-bar"
                size={18}
                color="#718096"
              />
            </View>
            <Text style={styles.statsValue}>{totalReports}</Text>
          </View>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: "#FEFCE8", borderColor: "#FEF08A" },
            ]}
          >
            <View style={styles.statsHeader}>
              <Text style={[styles.statsLabel, { color: "#854D0E" }]}>
                Pending
              </Text>
              <Ionicons name="close-circle-outline" size={18} color="#854D0E" />
            </View>
            <Text style={[styles.statsValue, { color: "#854D0E" }]}>
              {pendingCount}
            </Text>
          </View>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
            ]}
          >
            <View style={styles.statsHeader}>
              <Text style={[styles.statsLabel, { color: "#1E40AF" }]}>
                Responded
              </Text>
              <Ionicons name="time-outline" size={18} color="#1E40AF" />
            </View>
            <Text style={[styles.statsValue, { color: "#1E40AF" }]}>
              {respondedCount}
            </Text>
          </View>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
            ]}
          >
            <View style={styles.statsHeader}>
              <Text style={[styles.statsLabel, { color: "#166534" }]}>
                Resolved
              </Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#166534"
              />
            </View>
            <Text style={[styles.statsValue, { color: "#166534" }]}>
              {resolvedCount}
            </Text>
          </View>
        </View>

        {/* Incoming Reports Section */}
        <View style={styles.reportsHeader}>
          <Text style={styles.sectionTitle}>Laporan Masuk</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={16} color="#4A5568" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* List Laporan yang masuk dari User */}
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="message-off-outline"
              size={80}
              color="#BFDBFE"
            />
            <Text style={styles.emptyTitle}>Tidak ada Laporan Masuk</Text>
            <Text style={styles.emptyDesc}>
              Semua laporan telah teratasi. Belum ada laporan baru yang masuk.
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isAdmin={true}
              onPressDetail={() => {
                router.push(`../admin/report/${report.id}`);
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  headerBackground: {
    backgroundColor: "#4A69E2",
    height: 160,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  headerIcon: { padding: 8 },
  content: { flex: 1, marginTop: -60, paddingHorizontal: 20 },
  monitoringCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  priorityBadge: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  priorityText: { color: "#C53030", fontSize: 12, fontWeight: "bold" },
  timeText: { color: "#A0AEC0", fontSize: 12 },
  locationTitle: { fontSize: 26, fontWeight: "bold", color: "#2D3748" },
  subTitle: { fontSize: 14, color: "#4A5568", marginBottom: 20 },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stepperItem: { alignItems: "center", flex: 1 },
  levelBadge: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FEB2B2",
    marginBottom: 8,
  },
  levelText: { color: "#C53030", fontSize: 10, fontWeight: "bold" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4A69E2",
    backgroundColor: "white",
  },
  dotActive: { backgroundColor: "#4A69E2" },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginTop: 22,
  },
  stationName: {
    fontSize: 10,
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
  },
  cardPagination: { flexDirection: "row", justifyContent: "center", gap: 6 },
  cardDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E2E8F0" },
  cardDotActive: { backgroundColor: "#4A69E2" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginVertical: 20,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statsCard: {
    width: "48%",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "white",
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsLabel: { fontSize: 12, color: "#718096", fontWeight: "600" },
  statsValue: { fontSize: 24, fontWeight: "bold", color: "#2D3748" },
  reportsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterText: { fontSize: 12, color: "#4A5568" },
  emptyState: { alignItems: "center", marginTop: 20, paddingBottom: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginTop: 15,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeArea: {
    flex: 1, // Area sebelah kiri yang kosong
  },
  sidebarContainer: {
    width: "75%", // Lebar sidebar dari kanan
    backgroundColor: "white",
    height: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  profileSection: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#F8F9FF",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#4A69E2",
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  adminRole: {
    fontSize: 12,
    color: "#8F9BB3",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
  },
  menuList: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 5,
  },
  menuLabel: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: "#2E3A59",
    fontWeight: "500",
  },
  logoutContainer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  logoutText: {
    color: "#FF4D4D",
    fontWeight: "bold",
    fontSize: 16,
  },
});
