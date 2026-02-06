import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { useRouter, Stack } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useReports } from "../context/ReportContext";

const WaveformBar = ({
  active,
  volumeLevel,
  index,
}: {
  active: boolean;
  volumeLevel: number;
  index: number;
}) => {
  const height = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    if (active) {
      // Tinggi minimum 5, tinggi maksimal 35
      const targetHeight = 5 + volumeLevel * 30;

      Animated.spring(height, {
        toValue: targetHeight,
        speed: 50, // Lebih cepat merespon
        bounciness: 8, // Memberi efek membal yang natural
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(height, {
        toValue: 5,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [active, volumeLevel]);

  return (
    <Animated.View
      style={[styles.bar, active && styles.barActive, { height }]}
    />
  );
};

export default function EmergencyReport({ navigation }: any) {
  const router = useRouter();
  const { addReport } = useReports();

  // --- States ---
  const [userName, setUserName] = useState("");
  const [comments, setComments] = useState("");
  const [emergencyType, setEmergencyType] = useState("Rising Water Level");
  const [coordinates] = useState("-6.1754, 106.8272");
  const [locationStatus] = useState<"pending" | "error" | "success">("success");
  const [seconds, setSeconds] = useState(0);
  const [volumeLevels, setVolumeLevels] = useState<number[]>(
    new Array(40).fill(0)
  );
  const [isRecording, setIsRecording] = useState(false);

  // --- Audio Recorder & State Hook ---
  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  };
  const audioRecorder = useAudioRecorder(recordingOptions);
  const recorderState = useAudioRecorderState(audioRecorder, 100);

  // --- Manual Polling for Metering & Timer ---
  const meteringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      // Timer: Update seconds every 1000ms
      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      // Metering: Update waveform based on real-time dB values every 100ms
      meteringIntervalRef.current = setInterval(() => {
        if (recorderState.metering !== undefined) {
          const normalizedVolume = (recorderState.metering + 160) / 160;
          const clampedVolume = Math.max(0.05, Math.min(1, normalizedVolume));

          setVolumeLevels((prev) => {
            return prev.map((_, i) => {
              const phase = i / prev.length;
              const waveOffset =
                Math.sin(Date.now() / 100 + phase * Math.PI * 2) * 0.15;
              return Math.max(0.05, Math.min(1, clampedVolume + waveOffset));
            });
          });
        }
      }, 100);

      return () => {
        // Cleanup: Clear all intervals
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        if (meteringIntervalRef.current) {
          clearInterval(meteringIntervalRef.current);
          meteringIntervalRef.current = null;
        }
      };
    } else {
      // Reset waveform when not recording
      setVolumeLevels(new Array(40).fill(0));
    }
  }, [isRecording, recorderState.metering]);

  // --- Sync isRecording state with recorderState ---
  useEffect(() => {
    setIsRecording(recorderState.isRecording);
  }, [recorderState.isRecording]);

  // Fungsi pembantu format waktu (00:00)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --- Permissions & Mode Setup ---
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi butuh akses mikrofon untuk merekam suara."
        );
      }

      // Sesuai dokumentasi terbaru untuk mengizinkan recording
      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  // --- Recording Functions ---
  const record = async () => {
    try {
      if (isRecording) return;

      setSeconds(0);
      setVolumeLevels(new Array(40).fill(0));
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      console.error("Gagal memulai rekaman:", err);
      Alert.alert("Error", "Pastikan izin mikrofon sudah diberikan.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!isRecording) return;

      // Stop recording and save URI
      await audioRecorder.stop();
      const recordingUri = audioRecorder.uri;
      console.log("Rekaman berhenti. URI:", recordingUri);

      // Clean up intervals immediately
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
        meteringIntervalRef.current = null;
      }

      // Reset waveform to flat
      setVolumeLevels(new Array(40).fill(0));

      return recordingUri;
    } catch (err) {
      console.error("Gagal menghentikan rekaman:", err);
    }
  };

  // --- Handle Recording Toggle ---
  const handleRecordingToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await record();
    }
  };

  const handleSubmit = () => {
    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      title: `${emergencyType} - ${userName}`,
      description: comments || "No additional comments provided.",
      timestamp: new Date()
        .toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric", // Sebelumnya '4-digit' yang menyebabkan error
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/\./g, ":"),
      status: "Pending" as const,
      typeOfNeed: "--",
      voiceUri: audioRecorder.uri,
    };

    addReport(newReport);
    router.replace("/(tabs)/Beranda");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/Lapor"); // Fallback jika stack kosong
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Location Status Alert */}
        {locationStatus === "success" && (
          <View style={[styles.alertBox, styles.alertSuccess]}>
            <Ionicons name="information-circle" size={20} color="#008060" />
            <Text style={styles.alertText}>
              Lokasi terdeteksi secara otomatis. Koordinat Anda sudah terlampir
              dalam laporan.
            </Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor="#999"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Type of Emergency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={emergencyType}
              onValueChange={(itemValue) => setEmergencyType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Rising Water Level"
                value="Rising Water Level"
              />
              <Picker.Item
                label="Trapped Individuals"
                value="Trapped Individuals"
              />
              <Picker.Item
                label="Medical Emergency"
                value="Medical Emergency"
              />
              <Picker.Item
                label="Need food supplies"
                value="Need food supplies"
              />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Additional Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe Your Situation.."
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
          />
        </View>

        {/* Voice Recording Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Voice Recordings (Optional)</Text>
          <View style={styles.voiceContainer}>
            <TouchableOpacity
              onPress={handleRecordingToggle}
              style={
                (styles.micButton,
                isRecording && { transform: [{ scale: 1.1 }] })
              }
              activeOpacity={isRecording ? 0.7 : 1}
            >
              <MaterialCommunityIcons
                name={isRecording ? "stop-circle" : "microphone-outline"}
                size={28}
                color={isRecording ? "#FF5E5E" : "#4A69E2"}
              />
            </TouchableOpacity>
            <View style={styles.waveformRow}>
              {volumeLevels.map((level, i) => (
                <WaveformBar
                  key={i}
                  active={isRecording}
                  volumeLevel={level}
                  index={i}
                />
              ))}
            </View>
            <Text style={styles.timer}>
              {isRecording || seconds > 0 ? formatTime(seconds) : "00:00"}
            </Text>
          </View>
        </View>

        {/* Form Lokasi Koordinat */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>GPS Coordinates</Text>
          <View style={styles.coordinateWrapper}>
            <Ionicons
              name="location-sharp"
              size={20}
              color="#4A69E2"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                styles.inputWithIcon,
                { backgroundColor: "#F8F9FF" },
              ]}
              value={coordinates}
              editable={false} // User tidak bisa ubah manual agar data akurat
              placeholder="Detecting coordinates..."
            />
            <TouchableOpacity
              style={styles.refreshIcon}
              onPress={() => {
                /* Fungsi untuk refresh lokasi aslimu nanti */
              }}
            >
              <Ionicons name="refresh-circle" size={28} color="#4A69E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="send" size={18} color="white" />
          <Text style={styles.submitButtonText}>Submit Emergency Report</Text>
        </TouchableOpacity>
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
    // marginLeft: 15,
  },
  scrollContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: "100%",
  },
  alertBox: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  alertSuccess: {
    backgroundColor: "#E6F4F1",
    borderWidth: 1,
    borderColor: "#B2DFD6",
  },
  alertText: { flex: 1, fontSize: 13, color: "#004D3D", lineHeight: 18 },
  formGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    color: "#2E3A59",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: { height: 55 },
  voiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 10,
  },
  micButton: { padding: 5 },
  waveformContainer: {
    flex: 1,
    height: 2,
    backgroundColor: "#E4E9F2",
    marginHorizontal: 15,
    borderStyle: "dotted",
    borderWidth: 1,
  },
  waveformLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#CCC",
    borderStyle: "dotted",
  },
  waveformRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginHorizontal: 15,
  },
  bar: {
    width: 3,
    backgroundColor: "#a5b0c4",
    borderRadius: 1.5,
  },
  barActive: {
    backgroundColor: "#a5b0c4",
  },
  timer: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
    marginLeft: 10,
    width: 45,
  },
  submitButton: {
    backgroundColor: "#FF5E5E",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
    gap: 10,
    marginTop: 10,
  },
  submitButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  coordinateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    zIndex: 1,
  },
  inputWithIcon: {
    flex: 1,
    paddingLeft: 45, // Memberi ruang untuk ikon di kiri
    paddingRight: 45, // Memberi ruang untuk tombol refresh di kanan
    color: "#8F9BB3", // Warna teks sedikit abu karena read-only
  },
  refreshIcon: {
    position: "absolute",
    right: 10,
  },
});
