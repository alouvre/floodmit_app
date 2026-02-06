import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LoginAdmin() {
  const router = useRouter();

  // State untuk menampung input user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Simulasi validasi login sederhana
    if (email === "admin" && password === "admin") {
      console.log("Login Success");

      // Gunakan replace agar user tidak bisa 'back' ke halaman login
      router.replace("/adminDashboard");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2D3748" />
      </TouchableOpacity>

      <Text style={styles.welcome}>Hey there!{"\n"}Welcome Back</Text>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail" size={20} color="#4A69E2" />
          <TextInput
            placeholder="Enter Your Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={20} color="#4A69E2" />
          <TextInput
            placeholder="Enter Your Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#A0AEC0"
            />
          </TouchableOpacity>
        </View>

        {/* Tombol Forgot Password */}
        <TouchableOpacity
          onPress={() => console.log("Forgot Password pressed")}
          style={styles.forgotPassContainer}
        >
          <Text style={styles.forgotPass}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Login Utama */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      {/* Divider "Or Login With" */}
      <Text style={styles.orText}>Or Login With</Text>

      {/* Google Login Button */}
      <TouchableOpacity
        style={styles.googleBtn}
        onPress={() => console.log("Google Login")}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          }}
          style={styles.googleIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
  },
  welcome: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3748",
    lineHeight: 42,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A5568",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: "#F7FAFC",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#2D3748",
  },
  forgotPassContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotPass: {
    color: "#4A5568",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  loginBtn: {
    backgroundColor: "#4A69E2",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    elevation: 8,
    shadowColor: "#4A69E2",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#718096",
    marginVertical: 30,
    fontSize: 14,
  },
  googleBtn: {
    alignSelf: "center",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
  },
  googleIcon: {
    width: 30,
    height: 30,
  },
});
