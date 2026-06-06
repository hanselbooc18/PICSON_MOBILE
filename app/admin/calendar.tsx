import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.row}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUM1uwIAwZbw7HLnTztxbuI7iX89MhASsTOsXk-ks--Gtyhao2t_wtHZvyRnLZUqk85RBmuXWcwd_RMNTw-lefeQplFZhKGhs6H-faeWVW7o-_wLyrkDlo18nUeWg8REW9Tb9AWFbNlnfwzXNa_xhVKTY3pdDB0mhGTBBAOOmmUAnCNe49EIgX0Lxdh7IM6Ue7bSz7eOOGoVMj6yZ-6LsUHCYraVjXo3Ni4uRUO_YoEWYlDaCg_R1mpCwfCKl2RV7z299iHOzXMu8",
            }}
            style={styles.avatar}
          />
          <Text style={styles.brand}>MaternalCare</Text>
        </View>

        <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* HEADER */}
        <Text style={styles.label}>Appointments</Text>
        <Text style={styles.title}>Book & Manage Visits</Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#1E88E5" />
          <Text style={styles.searchText}>Search specialist...</Text>
          <Ionicons name="options-outline" size={18} color="#1E88E5" />
        </View>

           {/* SIDE CARD (TOP ALIGNED FIXED) */}
          <View style={styles.sideCard}>
            <Text style={styles.sideTitle}>Next Appointment</Text>
            <Text style={styles.sideDate}>Nov 6 • 10:30 AM</Text>
            <Text style={styles.sideSub}>Prenatal Check-up</Text>

            <View style={styles.doctorRow}>
              <Ionicons name="person-circle" size={34} color="#fff" />
              <View>
                <Text style={styles.docName}>Dr. Sarah Thompson</Text>
                <Text style={styles.docRole}>OB-GYN</Text>
              </View>
            </View>
          </View>

        {/* GRID */}
        <View style={styles.grid}>
          {/* CALENDAR */}
          <View style={styles.calendarCard}>
            <Text style={styles.cardTitle}>November 2024</Text>

            <View style={styles.calendarGrid}>
              {Array.from({ length: 14 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.day, i === 5 && styles.activeDay]}
                >
                  <Text
                    style={i === 5 ? styles.activeDayText : styles.dayText}
                  >
                    {i + 1}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.bookBtn}>
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={styles.bookText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>

       
        </View>
        

        {/* HISTORY */}
        <Text style={styles.section}>Appointment History</Text>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>First Trimester Ultrasound</Text>
          <Text style={styles.itemSub}>Oct 12, 2024 • Completed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>General Consultation</Text>
          <Text style={styles.itemSub}>Sep 15, 2024 • Completed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>Nutrition Planning</Text>
          <Text style={styles.itemSub}>Sep 01, 2024 • Cancelled</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  row: {
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
    fontWeight: "700",
    color: "#1E88E5",
  },

  body: {
    padding: 16,
    paddingBottom: 80,
  },

  label: {
    fontSize: 12,
    color: "#1E88E5",
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchText: {
    color: "#6B7280",
  },

  /* ✅ FIX: TOP ALIGN GRID */
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },

  calendarCard: {
    flex: 2,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  day: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  activeDay: {
    backgroundColor: "#1E88E5",
  },

  dayText: {
    color: "#374151",
  },

  activeDayText: {
    color: "#fff",
    fontWeight: "700",
  },

  bookBtn: {
    flexDirection: "row",
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: "center",
    gap: 6,
  },

  bookText: {
    color: "#fff",
    fontWeight: "600",
  },

  sideCard: {
    flex: 1,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 16,
  },

  sideTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  sideDate: {
    color: "#D1E9FF",
    marginTop: 5,
  },

  sideSub: {
    color: "#fff",
    marginTop: 5,
  },

  doctorRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
    alignItems: "center",
  },

  docName: {
    color: "#fff",
    fontWeight: "700",
  },

  docRole: {
    color: "#D1E9FF",
    fontSize: 12,
  },

  section: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  itemTitle: {
    fontWeight: "700",
    color: "#111",
  },

  itemSub: {
    color: "#6B7280",
    marginTop: 4,
  },
});