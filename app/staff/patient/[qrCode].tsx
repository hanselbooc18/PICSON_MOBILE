import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMaternalProfileByQr, MaternalQrProfile } from "@/api/maternalQr";

export default function StaffPatientProfileScreen() {
  const { qrCode } = useLocalSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<MaternalQrProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMaternalProfileByQr(String(qrCode));
        setProfile(data);
      } catch (err) {
        let message = "Unable to load patient record. Please try again.";

        if (err instanceof Error) {
          if (err.message.includes("Unauthenticated")) {
            message = "Session expired. Please log in again.";
          } else if (err.message.includes("403")) {
            message = "You are not authorized to view this patient record.";
          } else if (err.message.includes("404")) {
            message = "Patient not found for this QR code.";
          } else {
            message = err.message;
          }
        }

        setError(message);
        console.error("Staff patient load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [qrCode]);

  const renderRecordField = (label: string, value: unknown) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    return (
      <Text key={label} style={styles.recordDetail}>
        {label}: {String(value)}
      </Text>
    );
  };

  const renderAdmissionRecord = (item: Record<string, unknown>) => {
    const admission = item as Record<string, unknown>;

    return (
      <View style={styles.recordDetails}>
        {renderRecordField('Rapid Plasma Reagin', admission.rapid_plasma_reagin)}
        {renderRecordField('HIV', admission.hiv)}
        {renderRecordField('Hemoglobin', admission.hemoglobin)}
        {renderRecordField('Admitted', admission.date_time_admitted ?? admission.created_at)}
        {renderRecordField('Stage of Labor', admission.stage_of_labor)}
        {renderRecordField('Status', admission.status)}
        {renderRecordField('Patient ID', admission.patient_id)}
      </View>
    );
  };

  const renderRecordItem = (item: Record<string, unknown>) => {
    const title = item.date_time_admitted || item.created_at || item.updated_at || item.id || "Record";
    // Check if this looks like an admission record
    const isAdmission = item.rapid_plasma_reagin !== undefined || item.hiv !== undefined || item.hemoglobin !== undefined;

    return (
      <View style={styles.recordRow}>
        <Text style={styles.recordTitle}>{String(title)}</Text>
        {isAdmission ? (
          renderAdmissionRecord(item)
        ) : (
          <Text style={styles.recordText}>{JSON.stringify(item, null, 2)}</Text>
        )}
      </View>
    );
  };

  const renderSection = (title: string, items: Record<string, unknown>[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionMeta}>{items.length} item{items.length === 1 ? "" : "s"}</Text>
      </View>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>No records available.</Text>
      ) : (
        <FlatList
          data={items}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${String(item.id ?? index)}-${index}`}
          renderItem={({ item }) => renderRecordItem(item)}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading patient record...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || "Patient record not found."}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.fullName}>{profile.patient.full_name}</Text>
          <Text style={styles.patientMeta}>{profile.patient.qr_identifier}</Text>
        </View>
       
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Details</Text>
        <Text style={styles.dataLabel}>Name: {profile.patient.full_name}</Text>
        <Text style={styles.dataLabel}>Birth date: {profile.patient.birth_date ?? "—"}</Text>
        <Text style={styles.dataLabel}>Address: {profile.patient.address ?? "—"}</Text>
        <Text style={styles.dataLabel}>Contact: {profile.patient.contact_number ?? "—"}</Text>
        <Text style={styles.dataLabel}>Blood type: {profile.patient.blood_type ?? "—"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy History</Text>
        <Text style={styles.dataLabel}>Gravida: {profile.pregnancy_history.gravida ?? "—"}</Text>
        <Text style={styles.dataLabel}>Term births: {profile.pregnancy_history.term_births ?? "—"}</Text>
        <Text style={styles.dataLabel}>Preterm births: {profile.pregnancy_history.preterm_births ?? "—"}</Text>
        <Text style={styles.dataLabel}>Living children: {profile.pregnancy_history.living_children ?? "—"}</Text>
      </View>

      {renderSection("Vital Signs", profile.prenatal_records.vital_signs)}
      {renderSection("Laboratory Results", profile.prenatal_records.laboratory_results)}
      {renderSection("Admissions", profile.prenatal_records.admissions)}
      {renderSection("Medication Sheets", profile.prenatal_records.medication_sheets)}
      {renderSection("Recent Consultations", profile.recent_consultations)}

      <Modal visible={showQrModal} transparent animationType="fade" onRequestClose={() => setShowQrModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQrModal(false)}>
              <Ionicons name="close" size={24} color="#1E88E5" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Patient QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={96} color="#1E88E5" />
              </View>
              <Text style={styles.qrIdentifier}>{profile.patient.qr_identifier}</Text>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={() => setShowQrModal(false)}>
              <Text style={styles.doneButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 13,
    color: "#64748B",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E88E5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#64748B",
  },
  dataLabel: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  recordRow: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  recordTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E88E5",
    marginBottom: 10,
  },
  recordText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  recordDetails: {
    marginTop: 0,
  },
  recordDetail: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  qrIdentifier: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  doneButton: {
    width: "100%",
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    paddingVertical: 12,
  },
  doneButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
