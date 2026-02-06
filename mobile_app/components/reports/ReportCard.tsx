import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Report } from "../../context/ReportContext";

interface ReportCardProps {
  report: Report;
  isAdmin?: boolean; // Prop untuk menentukan mode tampilan
  onPressDetail?: () => void;
}

export default function ReportCard({
  report,
  isAdmin = false,
  onPressDetail,
}: ReportCardProps) {
  // Tentukan warna badge berdasarkan status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "#FEFCE8", text: "#854D0E", border: "#FEF08A" };
      case "Responded":
        return { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" };
      case "Resolved":
        return { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" };
      default:
        return { bg: "#F7FAFC", text: "#4A5568", border: "#E2E8F0" };
    }
  };

  const statusStyle = getStatusStyle(report.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.timestamp}>{report.timestamp}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.border,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>
            {report.status}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{report.title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Type of Need:</Text>
        <View style={styles.needBox}>
          <Text style={styles.needText}>
            {report.typeOfNeed === "--"
              ? "Menunggu Verifikasi"
              : report.typeOfNeed}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, isAdmin ? styles.adminBtn : styles.userBtn]}
        onPress={onPressDetail}
      >
        {isAdmin && (
          <Ionicons
            name="trending-up-outline"
            size={16}
            color="#4A69E2"
            style={{ marginRight: 5 }}
          />
        )}
        <Text
          style={[
            styles.actionText,
            isAdmin ? styles.adminText : styles.userText,
          ]}
        >
          {isAdmin ? "Detail" : "Detail Laporan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 5,
  },
  needBox: {
    alignSelf: "flex-start",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  needText: {
    fontSize: 12,
    color: "#4A5568",
  },
  actionBtn: {
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  userBtn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4A69E2",
  },
  adminBtn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4A69E2",
    alignSelf: "flex-end", // Admin button biasanya lebih kecil di kanan
    paddingHorizontal: 20,
  },
  actionText: {
    fontWeight: "600",
    fontSize: 13,
  },
  userText: { color: "#4A69E2" },
  adminText: { color: "#4A69E2" },
});
