import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const slides = [
  {
    id: 1,
    title: "Respon Cepat di Genggaman",
    desc: "Jangan biarkan darurat menunggu. Laporkan kejadian secara real-time, dan tim relawan kami yang terintegrasi akan segera menuju lokasi Anda untuk memberikan bantuan.",
    img: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "Bantuan Tepat Sasaran",
    desc: "Setiap detik sangat berharga. Kami memverifikasi setiap laporan secara instan untuk memastikan bantuan logistik dan evakuasi dikirimkan ke titik yang paling membutuhkan.",
    img: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 3,
    title: "Mari Mulai Bertindak",
    desc: "Pilih peran Anda untuk memulai. Melapor sebagai warga untuk mendapatkan bantuan, atau masuk sebagai petugas untuk mengelola pemulihan di lapangan.",
    img: require("@/assets/images/onboarding2.png"),
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  return (
    <View style={styles.container}>
      <Image source={slides[currentSlide].img} style={styles.illustration} />
      <Text style={styles.title}>{slides[currentSlide].title}</Text>
      <Text style={styles.desc}>{slides[currentSlide].desc}</Text>

      {/*PAGINATION DOTS*/}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* TOMBOL NAVIGASI */}
      {currentSlide < 2 ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => setCurrentSlide(2)}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionColumn}>
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={() => router.replace("/(tabs)/Beranda")} // Langsung ke Beranda
          >
            <Text style={styles.guestText}>Login as Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => router.push("/loginAdmin")} // Ke Halaman Login Admin
          >
            <Text style={styles.adminText}>Login as Admin</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  illustration: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A69E2", // Warna biru sesuai desain
    textAlign: "center",
    marginBottom: 15,
  },
  desc: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  // Row untuk Slide 1 & 2
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  skipText: {
    color: "#A0AEC0",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#4A69E2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#4A69E2",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Column untuk Slide 3 (Final)
  actionColumn: {
    width: "100%",
    gap: 15,
  },
  guestBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  guestText: {
    color: "#4A69E2",
    fontWeight: "bold",
    fontSize: 16,
  },
  adminBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: "#4A69E2",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  adminText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    height: 5,
    justifyContent: "center",
    marginBottom: 40, // Beri jarak ke tombol di bawahnya
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20, // Membuat dot yang aktif lebih panjang (sesuai tren desain)
    backgroundColor: "#4A69E2",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#CBD5E0", // Warna abu-abu muda untuk yang tidak aktif
  },
});
