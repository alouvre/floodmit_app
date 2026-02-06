import React from "react";
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
import { useReports } from "../../context/ReportContext";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { reports } = useReports();

  // const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  // const [isPlaying, setIsPlaying] = React.useState(false);

  // 1. Cari data laporan
  const report = reports.find((r) => r.id === id);

  // 2. Inisialisasi Player dengan Objek Source
  const player = useAudioPlayer(
    report?.voiceUri ? { uri: report.voiceUri } : null
  );

  // 3. Gunakan hook status untuk memantau playback secara reaktif
  const status = useAudioPlayerStatus(player);
  const totalBars = 30; // Jumlah bar vertikal

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

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text>Laporan tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#4A69E2", marginTop: 10 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Fungsi Toggle Playback
  const togglePlayback = () => {
    if (!report.voiceUri) {
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

  const statusContent = {
    Pending: {
      text: "Laporan diterima. Mohon tunggu, petugas sedang memverifikasi data Anda.",
      color: "#854D0E",
      bg: "#FEFCE8",
      icon: "information-circle",
    },
    Responded: {
      text: "Laporan diproses. Tim relawan terdekat sedang menuju ke lokasi Anda.",
      color: "#1E40AF",
      bg: "#EFF6FF",
      icon: "navigate-circle",
    },
    Resolved: {
      text: "Laporan selesai ditangani. Terima kasih telah membantu kami mempercepat evakuasi.",
      color: "#166534",
      bg: "#F0FDF4",
      icon: "checkmark-circle",
    },
  } as const;

  // Ambil konten sesuai status laporan saat ini
  const currentStatus = statusContent[report.status] || statusContent.Pending;

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
          {/* Status Alert Box Dinamis */}
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
              size={22}
              color={currentStatus.color}
            />
            <Text
              style={[styles.statusAlertText, { color: currentStatus.color }]}
            >
              {currentStatus.text}
            </Text>
          </View>

          {/* Form Fields (Read-Only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Your Name</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.inputText}>
                {report.title.split(" - ")[1] || "User"}
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Type of Emergency</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.inputText}>
                {report.title.split(" - ")[0] || "Emergency"}
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Additional Comments</Text>
            <View style={[styles.readOnlyInput, styles.textArea]}>
              <Text style={styles.inputText}>{report.description}</Text>
            </View>
          </View>

          {/* Voice Recording Section */}
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
                // <View style={styles.waveformPlaceholder}>
                //   <View style={styles.waveformLine} />
                // </View>
                <View style={styles.waveform} />
              )}
              <Text style={styles.duration}>
                {report.voiceUri
                  ? formatTime(status.currentTime * 1000)
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>GPS Coordinates</Text>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#666"
              />
            </View>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A69E2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#4A69E2",
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
  },
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
  fieldGroup: { marginBottom: 10 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readOnlyInput: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },
  inputText: { fontSize: 14, color: "#4A5568" },
  textArea: { minHeight: 80 },
  voicePlayer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
  waveformLine: {
    height: 2,
    width: "100%",
    borderRadius: 1,
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
    justifyContent: "center",
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
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
