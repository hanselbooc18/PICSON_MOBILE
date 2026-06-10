import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getCurrentUser, logout, MobileUser } from "@/api/auth";
import { extractQrIdentifier, getMaternalProfileByQr } from "@/api/maternalQr";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<MobileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.log("Failed to load user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Request camera permission
  useEffect(() => {
    if (!showScanner) return;

    let active = true;

    if (cameraPermission?.status !== "granted") {
      requestCameraPermission()
        .then((result) => {
          if (!active) return;
          if (result.status !== "granted") {
            setScannerError("Camera permission denied.");
          }
        })
        .catch((permissionError) => {
          if (!active) return;
          setScannerError(
            permissionError instanceof Error
              ? permissionError.message
              : "Unable to request camera permissions."
          );
        });
    }

    return () => {
      active = false;
    };
  }, [cameraPermission, requestCameraPermission, showScanner]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const openProfile = async (rawValue: string) => {
    const qrIdentifier = extractQrIdentifier(rawValue);

    if (!qrIdentifier || isLocked) {
      if (!isLocked) {
        setError("Invalid QR code. Please scan a valid patient QR card.");
      }
      return;
    }

    try {
      setIsLocked(true);
      setError(null);
      await getMaternalProfileByQr(qrIdentifier);
      setShowScanner(false);
      router.push(`/staff/patient/${encodeURIComponent(qrIdentifier)}` as any);
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "Unable to open patient record"
      );
      setIsLocked(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color="#2563EB" size="large" />
          <Text style={{ color: "#64748B", marginTop: 10 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.container}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#2563EB" }}>
                PICSON
              </Text>
              <View
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 10 }}>Staff</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
              Staff Dashboard
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#EFF6FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {!showScanner ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ── WELCOME CARD ── */}
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#3B82F6",
                  }}
                />
                <Text style={styles.badge}>Staff Portal</Text>
              </View>

              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.userName}>{user?.name || "Staff"}</Text>
            </View>

            {/* ── SCANNER CARD ── */}
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="qr-code-outline" size={24} color="#2563EB" />
                <Text style={styles.cardTitle}>Patient Lookup</Text>
              </View>

              <Text style={styles.cardDescription}>
                Scan or manually enter a patient QR code to view their maternal record.
              </Text>

              <TouchableOpacity
                onPress={() => setShowScanner(true)}
                style={styles.scanButton}
              >
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>Start Scanner</Text>
              </TouchableOpacity>

             

             
            </View>
          </ScrollView>
        ) : (
          /* ── SCANNER VIEW ── */
          <View style={styles.scannerContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: "#FFFFFF",
                borderBottomWidth: 1,
                borderBottomColor: "#E2E8F0",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#0F172A" }}>
                Scan QR Code
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowScanner(false);
                  setError(null);
                  setIsLocked(false);
                }}
              >
                <Ionicons name="close-outline" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {cameraPermission?.status === "granted" ? (
              <CameraView
                facing="back"
                onBarcodeScanned={({ data }: { data: string }) => openProfile(data)}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                style={{ flex: 1 }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0F172A",
                }}
              >
                <Ionicons name="camera-outline" size={48} color="#EF4444" />
                <Text
                  style={{
                    color: "#CBD5E1",
                    fontSize: 14,
                    marginTop: 12,
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  {scannerError || "Camera permission required"}
                </Text>
              </View>
            )}

            {isLocked && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="#FFFFFF" size="large" />
                <Text style={{ color: "#FFFFFF", marginTop: 12 }}>
                  Opening record...
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 18,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
  },
  searchButton: {
    backgroundColor: "#2563EB",
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
});
