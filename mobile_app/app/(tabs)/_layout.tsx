// import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#4A69E2",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "white",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="Beranda"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Peta"
        options={{
          title: "Peta",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Lapor"
        options={{
          title: "Lapor",
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/emergencyReport")}
              style={styles.customButtonContainer}
            >
              <View style={styles.customButton}>
                <Ionicons name="alert-circle" size={26} color="white" />
                <Text style={styles.buttonTitle}>Lapor</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="Relawan"
        options={{
          title: "Relawan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Pengaturan"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -25, // Membuat tombol melayang lebih tinggi
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#4A69E2", // Warna biru brand
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: "white",
  },
  buttonTitle: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    marginTop: -2,
  },
});
