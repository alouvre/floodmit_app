import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useReports } from "../../../context/ReportContext";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

export default function AdminReportDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { reports, updateReportStatus } = useReports();

  // Cari data laporan
  const report = reports.find((r) => r.id === id);

  // State untuk input admin
  const [selectedNeed, setSelectedNeed] = useState(
    report?.typeOfNeed || "Shelter"
  );

  // Audio player initialization
  const player = useAudioPlayer(
    report?.voiceUri ? { uri: report.voiceUri } : null
  );
  const status = useAudioPlayerStatus(player);
  const totalBars = 30;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const WaveformProgress = () => {
    const progress =
      status.duration > 0 ? status.currentTime / status.duration : 0;
    const activeBars = Math.floor(progress * totalBars);

    return (
      <View style={styles.waveformRow}>
        {[...Array(totalBars)].map((_, i) => {
          const isActive = i < activeBars;
          const isActiveEdge = i === activeBars && status.playing;
          return (
            <View
              key={i}
              style={[
                styles.staticBar,
                {
                  backgroundColor: isActive ? "#4A69E2" : "#E4E9F2",
                  height: isActiveEdge
                    ? 20 + Math.sin(Date.now() / 100 + i * 0.5) * 10
                    : 10 + Math.sin(i * 0.5) * 8,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const togglePlayback = () => {
    if (!report?.voiceUri) {
      alert("Tidak ada rekaman suara.");
      return;
    }

    if (status.playing) {
      player.pause();
    } else {
      if (status.playbackState === "ended") {
        player.seekTo(0);
      }
      player.play();
    }
  };

  if (!report) return <Text>Loading...</Text>;

  // Data Admin (Bisa diambil dari AuthContext jika ada)
  const activeAdmin = "Admin A";
  const timeInfo = report.timestamp.split(" ")[1] || "14:20"; // Mengambil jam dari timestamp

  // Objek pemetaan untuk konten alert berdasarkan status
  const statusContent = {
    Pending: {
      text: `Laporan diterima. Segera verifikasi data pelapor. Sedang diproses oleh ${activeAdmin}.`,
      color: "#854D0E",
      bg: "#FEFCE8",
      icon: "alert-circle",
    },
    Responded: {
      text: `Laporan sedang ditangani. Tim lapangan telah dikirim ke titik lokasi. Direspon oleh ${activeAdmin} pada ${timeInfo} WIB.`,
      color: "#1E40AF",
      bg: "#EFF6FF",
      icon: "navigate-circle",
    },
    Resolved: {
      text: `Penanganan bencana di titik ini telah berakhir. Diselesaikan oleh ${activeAdmin} pada ${timeInfo} WIB.`,
      color: "#166534",
      bg: "#F0FDF4",
      icon: "checkmark-done-circle",
    },
  } as const;

  // Ambil konten sesuai status laporan saat ini
  const currentStatus = statusContent[report.status] || statusContent.Pending;

  const handleUpdateStatus = (newStatus: "Responded" | "Resolved") => {
    // Fungsi ini harus mengupdate data di context
    updateReportStatus(report.id, newStatus, selectedNeed);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Laporan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.detailCard}>
          {/* Status Alert Box Statis */}
          <View
            style={[
              styles.statusAlert,
              {
                backgroundColor: currentStatus.bg,
                borderLeftColor: currentStatus.color,
              },
            ]}
          >
            <Ionicons
              name={currentStatus.icon}
              size={20}
              color={currentStatus.color}
            />
            <Text
              style={[styles.statusAlertText, { color: currentStatus.color }]}
            >
              {currentStatus.text}
            </Text>
          </View>

          {/* Informasi Pelapor (Read Only) */}
          <View style={styles.fieldGroup}>
            <InfoField
              label="Your Name"
              value={report.title.split(" - ")[1] || "Zavran Ronaldo Messi"}
            />
          </View>
          <View style={styles.fieldGroup}>
            <InfoField
              label="Type of Emergency"
              value={report.title.split(" - ")[0]}
            />
          </View>
          <View style={styles.fieldGroup}>
            <InfoField
              label="Additional Comments"
              value={report.description}
              isTextArea
            />
          </View>

          {/* Voice Recording */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Voice Recordings</Text>
            <View style={styles.voicePlayer}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayback}
                disabled={!report.voiceUri}
              >
                <Ionicons
                  name={status.playing ? "pause-circle" : "play-circle"}
                  size={24}
                  color={report.voiceUri ? "#4A69E2" : "#CCC"}
                />
              </TouchableOpacity>
              {report.voiceUri ? (
                <WaveformProgress />
              ) : (
                <View style={styles.waveform} />
              )}
              <Text style={styles.duration}>
                {report.voiceUri
                  ? formatTime(status.currentTime * 1000)
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Lokasi & Tombol Rute */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>GPS Coordinates</Text>
            <View style={styles.locationRow}>
              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateText}>-6.129121, 106.83335</Text>
              </View>
              <TouchableOpacity style={styles.routeButton}>
                <MaterialCommunityIcons
                  name="arrow-up-right-bold"
                  size={18}
                  color="white"
                />
                <Text style={styles.routeButtonText}>Lihat Rute</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Sembunyikan kontrol jika sudah Resolved */}
          {report.status !== "Resolved" && (
            <>
              <View style={styles.divider} />
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Type of Need</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedNeed}
                    onValueChange={(itemValue) => setSelectedNeed(itemValue)}
                    enabled={report.status === "Pending"} // Picker terkunci jika sudah direspon
                  >
                    <Picker.Item label="Shelter" value="Shelter" />
                    <Picker.Item label="Food Supplies" value="Food Supplies" />
                    <Picker.Item
                      label="Medical Support"
                      value="Medical Support"
                    />
                    <Picker.Item label="Evacuation" value="Evacuation" />
                  </Picker>
                </View>
              </View>

              {report.status === "Pending" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.respondBtn]}
                  onPress={() => handleUpdateStatus("Responded")}
                >
                  <Text style={styles.actionBtnText}>Mark as Responded</Text>
                </TouchableOpacity>
              )}

              {report.status === "Responded" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.resolveBtn]}
                  onPress={() => handleUpdateStatus("Resolved")}
                >
                  <Text style={[styles.actionBtnText, { color: "#166534" }]}>
                    Mark as Resolved
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-komponen Input
const InfoField = ({ label, value, isTextArea }: any) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.readOnlyInput, isTextArea && { height: 100 }]}>
      <Text style={styles.inputText}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A69E2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  fieldGroup: { marginBottom: 10 },
  scrollContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: "100%",
  },
  detailCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusAlert: {
    flexDirection: "row",
    backgroundColor: "#FEFCE8",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#854D0E",
    marginBottom: 20,
  },
  statusAlertText: {
    flex: 1,
    fontSize: 13,
    color: "#854D0E",
    marginLeft: 10,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 8,
  },
  readOnlyInput: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },
  inputText: { fontSize: 13, color: "#4A5568" },
  voicePlayer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 10,
  },
  playButton: { padding: 5 },
  waveform: {
    flex: 1,
    height: 2,
    backgroundColor: "#E4E9F2",
    marginHorizontal: 15,
    borderStyle: "dotted",
    borderWidth: 1,
  },
  waveformRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginHorizontal: 15,
  },
  staticBar: {
    width: 5,
    borderRadius: 2,
  },
  duration: { fontSize: 12, color: "#4A5568" },
  locationRow: { flexDirection: "row", gap: 10 },
  coordinateBox: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },
  coordinateText: { fontSize: 13, color: "#4A69E2", fontWeight: "600" },
  routeButton: {
    backgroundColor: "#4A69E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 5,
  },
  routeButtonText: { color: "white", fontWeight: "bold", fontSize: 13 },
  divider: { height: 1, backgroundColor: "#E4E9F2", marginVertical: 12 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    marginBottom: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  respondBtn: { backgroundColor: "#4A69E2" },
  resolveBtn: { backgroundColor: "#B2DFD6" }, // Hijau pudar sesuai gambar
  actionBtnText: { color: "white", fontWeight: "bold", fontSize: 15 },
});
