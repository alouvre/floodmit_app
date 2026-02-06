import React from "react";
import { StyleSheet, View, Dimensions, TextInput } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

export default function PetaScreen() {
  // Konfigurasi Tema "Clean Cut" (Hanya Air & Daratan Bersih)
  const cleanCutStyle = [
    { elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", stylers: [{ visibility: "off" }] },
    { featureType: "landscape", stylers: [{ color: "#f5f5f5" }] }, // Warna daratan
    { featureType: "poi", stylers: [{ visibility: "on" }] },
    { featureType: "road", stylers: [{ visibility: "on" }] }, // Sembunyikan jalan agar fokus ke sungai
    { featureType: "transit", stylers: [{ visibility: "on" }] },
    { featureType: "water", stylers: [{ color: "#adc9ff" }] }, // Warna air kebiruan sesuai desain
  ];

  return (
    <View style={styles.container}>
      {/* Header Search Bar Modern */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#4A69E2"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for a location.."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={cleanCutStyle}
        initialRegion={{
          latitude: -6.1214, // Contoh koordinat Jakarta Utara
          longitude: 106.8444,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
      ``
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#4A69E2", // Warna biru brand sesuai desain
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});
