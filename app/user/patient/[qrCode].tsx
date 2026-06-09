import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMaternalProfileByQr } from "@/api/maternalQr";

export default function TrackerProfileScreen() {
  const { qrCode } = useLocalSearchParams();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaternalProfileByQr(String(qrCode));
        setProfile(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qrCode]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Loading patient record...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No record found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.fullName}>{profile.patient.full_name}</Text>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setShowQrModal(true)}
          >
            <Ionicons name="qr-code" size={20} color="#FFFFFF" />
            <Text style={styles.qrButtonText}>Show QR Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pregnancy History</Text>
          <Text style={styles.dataLabel}>Gravida: {profile.pregnancy_history.gravida}</Text>
          <Text style={styles.dataLabel}>Term: {profile.pregnancy_history.term_births}</Text>
          <Text style={styles.dataLabel}>Preterm: {profile.pregnancy_history.preterm_births}</Text>
          <Text style={styles.dataLabel}>Living: {profile.pregnancy_history.living_children}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQrModal(false)}
            >
              <Ionicons name="close" size={24} color="#1E88E5" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Your QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={80} color="#1E88E5" />
              </View>
              <Text style={styles.qrIdentifier}>{profile.patient.qr_identifier}</Text>
            </View>

            <Text style={styles.qrInstruction}>
              Share this QR code with clinic staff for quick access to your maternal record.
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowQrModal(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  qrButton: {
    alignItems: "center",
    backgroundColor: "#1E88E5",
    borderRadius: 6,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 10,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "85%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  qrPlaceholder: {
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    width: 200,
  },
  qrIdentifier: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  qrInstruction: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 16,
    textAlign: "center",
  },
  doneButton: {
    alignItems: "center",
    backgroundColor: "#1E88E5",
    borderRadius: 6,
    justifyContent: "center",
    paddingVertical: 12,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
