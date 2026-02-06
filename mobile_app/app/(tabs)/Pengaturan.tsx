import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Blue Header Profile Section */}
      <View style={styles.header}>
        <View style={styles.profileImagePlaceholder}>
          <View style={styles.circle} />
        </View>
        <Text style={styles.userName}>Zavran Ronaldo</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Pengaturan</Text>

        {/* Menu Items */}
        <SettingItem icon="user" label="Account" onPress={() => {}} />

        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Feather name="bell" size={20} color="#2E3A59" />
            <Text style={styles.itemLabel}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: "#E4E9F2", true: "#4A69E2" }}
            thumbColor="white"
            onValueChange={() =>
              setIsNotificationsEnabled((previousState) => !previousState)
            }
            value={isNotificationsEnabled}
          />
        </View>

        <SettingItem icon="globe" label="Language" onPress={() => {}} />

        <SettingItem
          icon="message-square"
          label="About Us"
          onPress={() => {}}
        />

        <SettingItem
          icon="log-out"
          label="Logout"
          onPress={() => {
            router.replace("/onboarding");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-komponen untuk baris pengaturan standar
const SettingItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Feather name={icon} size={20} color="#2E3A59" />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#2E3A59" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    backgroundColor: "#4A69E2",
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  circle: { flex: 1 },
  userName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: -30, // Menarik konten sedikit ke atas header melengkung
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F9FC",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  itemLabel: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
});
