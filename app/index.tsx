import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAdminUser, login } from "@/api/auth";

export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await login(email.trim(), password);
      const nextRoute = isAdminUser(response.user)
        ? "/admin/dashboard"
        : "/user/dashboard";

      router.replace(nextRoute);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* FLOATING CARD WRAPPER */}
      <View style={styles.card}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/picson-logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Clinic Login</Text>

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

/* ================= BLUE THEME ================= */
const BLUE = "#1E88E5";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  /* 🔥 FLOATING CARD EFFECT */
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 22,

    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    // shadow (Android)
    elevation: 3,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  /* LOGO */
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: BLUE,
  },

  title: {
    fontSize: 22,
    color: "#111",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  label: {
    color: BLUE,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    color: "#111",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: BLUE,
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 15,
  },

  link: {
    color: BLUE,
    fontWeight: "700",
  },
});
