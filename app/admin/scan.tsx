import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { extractQrIdentifier, getMaternalProfileByQr } from "@/api/maternalQr";

type PermissionState = "loading" | "granted" | "denied";

export default function ScanPatientScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (cameraPermission?.status !== "granted") {
      requestCameraPermission()
        .then((result) => {
          if (!active) {
            return;
          }

          if (result.status !== "granted") {
            setScannerError("Camera permission denied.");
          }
        })
        .catch((permissionError) => {
          if (!active) {
            return;
          }

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
  }, [cameraPermission, requestCameraPermission]);

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
      router.push(`/admin/patient/${encodeURIComponent(qrIdentifier)}` as any);
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "Unable to open maternal record"
      );
      setIsLocked(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Maternal QR</Text>
            <Text style={styles.title}>Scan patient code</Text>
            <Text style={styles.subTitle}>
              Scanning is for clinic staff only. Patients may hand over their QR card.
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="qr-code-outline" size={24} color="#1E88E5" />
          </View>
        </View>

        <View style={styles.scannerShell}>
          {!cameraPermission && !scannerError ? (
            <View style={styles.scannerPlaceholder}>
              <ActivityIndicator color="#1E88E5" />
              <Text style={styles.placeholderText}>Checking camera access...</Text>
            </View>
          ) : null}

          {(cameraPermission?.status === "denied" || scannerError) ? (
            <View style={styles.scannerPlaceholder}>
              <Ionicons name="camera-outline" size={34} color="#EF4444" />
              <Text style={styles.placeholderText}>
                {scannerError || "Camera permission is required to scan patient QR codes."}
              </Text>
            </View>
          ) : null}

          {cameraPermission?.status === "granted" ? (
            <CameraView
              facing="back"
              onBarcodeScanned={({ data }: { data: string }) => openProfile(data)}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : null}

          <View style={styles.frame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>

          {isLocked ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.loadingOverlayText}>Opening record...</Text>
            </View>
          ) : null}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setIsLocked(false)}>
              <Text style={styles.retryText}>Scan again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.manualPanel}>
          <Text style={styles.panelTitle}>Manual lookup</Text>
          <View style={styles.lookupRow}>
            <TextInput
              autoCapitalize="characters"
              placeholder="PICSON-MAT-000001"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={manualCode}
              onChangeText={setManualCode}
            />
            <TouchableOpacity
              style={styles.lookupButton}
              onPress={() => openProfile(manualCode)}
              disabled={isLocked}
            >
              <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    flex: 1,
    padding: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  eyebrow: {
    color: "#1E88E5",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 3,
  },
  subTitle: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    maxWidth: "78%",
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  scannerShell: {
    aspectRatio: 0.78,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    overflow: "hidden",
  },
  scannerPlaceholder: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  placeholderText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    textAlign: "center",
  },
  frame: {
    ...StyleSheet.absoluteFillObject,
    margin: 42,
  },
  cornerTopLeft: {
    borderColor: "#FFFFFF",
    borderLeftWidth: 4,
    borderTopWidth: 4,
    height: 42,
    left: 0,
    position: "absolute",
    top: 0,
    width: 42,
  },
  cornerTopRight: {
    borderColor: "#FFFFFF",
    borderRightWidth: 4,
    borderTopWidth: 4,
    height: 42,
    position: "absolute",
    right: 0,
    top: 0,
    width: 42,
  },
  cornerBottomLeft: {
    borderBottomWidth: 4,
    borderColor: "#FFFFFF",
    borderLeftWidth: 4,
    bottom: 0,
    height: 42,
    left: 0,
    position: "absolute",
    width: 42,
  },
  cornerBottomRight: {
    borderBottomWidth: 4,
    borderColor: "#FFFFFF",
    borderRightWidth: 4,
    bottom: 0,
    height: 42,
    position: "absolute",
    right: 0,
    width: 42,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    justifyContent: "center",
  },
  loadingOverlayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  errorBox: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    padding: 12,
  },
  errorText: {
    color: "#B91C1C",
    flex: 1,
    fontSize: 13,
  },
  retryText: {
    color: "#1E88E5",
    fontSize: 13,
    fontWeight: "800",
  },
  manualPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  panelTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  lookupRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
  },
  lookupButton: {
    alignItems: "center",
    backgroundColor: "#1E88E5",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 50,
  },
});
