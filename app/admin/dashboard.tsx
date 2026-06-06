import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxcfkHdo2WXVqbpKtvxSmdHyIc1was13QvAFv08Ac4UsgPHTdq6Y7QA3x3yuwDKyq7X1YbQ2VGrBko4LvI6fSK7Jpm4Xk8vgNy5Gx6QwfAbVaIVvRsayNsrkggqb9CDlMJk9dIR0GicDmactnOv8Ugy1-fH0gFj8oJK_m4CVkcY-4X3gk9ISoakkhl8O7qYseBG4dLLmSn80TnESkjyR9dgl0ZujJCTexYQUKlYVSfAeh0Hs4xvUul5x9X5x_Y4OtwzIYBaDAl9Rw",
              }}
              style={styles.avatar}
            />
            <Text style={styles.brand}>MaternalCare</Text>
          </View>

          <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER (IMPROVED BIGGER) */}
          <View style={styles.header}>
            <Text style={styles.greeting}>GOOD MORNING, SARAH</Text>

            <Text style={styles.title}>How is little Leo today?</Text>

            <Text style={styles.subtitle}>
              Track health, schedule, and updates in one place
            </Text>
          </View>

          {/* SWITCH */}
          <View style={styles.switchBox}>
            <TouchableOpacity style={styles.switchActive}>
              <Ionicons name="happy-outline" size={16} color="#1E88E5" />
              <Text style={styles.switchActiveText}>Leo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchInactive}>
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text style={styles.switchInactiveText}>Sarah</Text>
            </TouchableOpacity>
          </View>

          {/* APPOINTMENT CARD */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.badge}>Upcoming Appointment</Text>
              <Text style={styles.smallText}>In 3 days</Text>
            </View>

            <View style={styles.appointmentRow}>
              <View style={styles.dateBox}>
                <Text style={styles.dateNum}>24</Text>
                <Text style={styles.dateMonth}>OCT</Text>
              </View>

              <View>
                <Text style={styles.cardTitle}>Pediatric Check-up</Text>
                <Text style={styles.subText}>
                  Dr. Elena Rodriguez • 10:30 AM
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialIcons name="vaccines" size={22} color="#1E88E5" />
              <Text style={styles.statLabel}>Next Vaccine</Text>
              <Text style={styles.statValue}>MMR Dose 2</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="monitor-weight" size={22} color="#1E88E5" />
              <Text style={styles.statLabel}>Current Weight</Text>
              <Text style={styles.statValue}>12.4 kg</Text>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickGrid}>
            {[
              { icon: "add-circle-outline", label: "Log Feeding" },
              { icon: "time-outline", label: "Last Feed" },
              { icon: "medkit-outline", label: "Health Log" },
              { icon: "chatbubble-ellipses-outline", label: "Ask AI Nurse" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.quickCard}>
                <Ionicons name={item.icon} size={26} color="#1E88E5" />
                <Text style={styles.quickText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TIP CARD */}
          <View style={styles.tipCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
              }}
              style={styles.tipImage}
            />

            <Text style={styles.tipTitle}>Nutrition Tip for Toddlers</Text>

            <Text style={styles.tipText}>
              Introducing solid foods? Learn how to balance iron-rich foods with
              Vitamin C for better absorption.
            </Text>

            <TouchableOpacity style={styles.readMore}>
              <Text style={styles.readMoreText}>Read Full Article</Text>
              <Ionicons name="arrow-forward" size={16} color="#1E88E5" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/* ================= CLEAN BLUE UI ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },

  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  /* 🔥 BIGGER HEADER */
  header: {
    marginTop: 15,
    marginBottom: 25,
  },

  greeting: {
    fontSize: 13,
    letterSpacing: 2,
    color: "#1E88E5",
    fontWeight: "700",
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    lineHeight: 34,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  switchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 50,
    alignSelf: "flex-start",
    padding: 4,
    marginBottom: 20,
  },

  switchActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 50,
    gap: 5,
  },

  switchInactive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 5,
  },

  switchActiveText: {
    color: "#1E88E5",
    fontWeight: "600",
  },

  switchInactiveText: {
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  badge: {
    backgroundColor: "#E6F0FF",
    color: "#1E88E5",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "600",
  },

  smallText: {
    color: "#6B7280",
    fontSize: 11,
  },

  appointmentRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  dateNum: {
    fontSize: 18,
    fontWeight: "700",
  },

  dateMonth: {
    fontSize: 12,
    color: "#6B7280",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  subText: {
    color: "#6B7280",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryBtnText: {
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 6,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E88E5",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },

  quickText: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },

  tipCard: {
    marginTop: 20,
    backgroundColor: "#EAF3FF",
    borderRadius: 20,
    padding: 12,
  },

  tipImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },

  tipTitle: {
    fontWeight: "bold",
  },

  tipText: {
    color: "#555",
    marginTop: 5,
  },

  readMore: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },

  readMoreText: {
    color: "#1E88E5",
    fontWeight: "600",
  },
});