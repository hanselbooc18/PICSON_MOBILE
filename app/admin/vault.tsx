import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

export default function GrowthTracker() {
  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.row}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy7Nnb8NUyfDm3iAGi0zIgq608X_ZXTOA2x0WKAWZtQAlvoyV0zmvV_1tCuwNg99LgFFsT1fGkRAUlP8IzLq8SQdn5f8jRK8vsQRj9tjRB6MlP7_bEd2nb6U_vas5qfHGvRTX1YhpHyg05etEiPlM7k6aUCqjAWpLxE2ikCI9Uf5sHpFanZF1Uvj2aQGHV-l7aDJr9Lxgbf58jxIaDY6CoslczvXb8s3h9KEaUpNwQ1gfZ1nlLP0PwB-XvcythSBHjAOqt1PJtZfk",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.brand}>MaternalCare</Text>
            <Text style={styles.subBrand}>Growth Tracker</Text>
          </View>
        </View>

        <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* HEADER */}
        <Text style={styles.label}>Health Insights</Text>
        <Text style={styles.title}>Tracker</Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.buttonText}>New Entry</Text>
        </TouchableOpacity>

        {/* GROWTH CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Growth Curve</Text>
          <Text style={styles.cardSub}>Leo's height and weight progression</Text>

          <View style={styles.chart}>
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Current Weight</Text>
              <Text style={styles.statValue}>9.4 kg</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>Weight Gain</Text>
              <Text style={styles.statValue}>+0.4 kg</Text>
            </View>
          </View>
        </View>

        {/* MILESTONES */}
        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneTitle}>Milestones</Text>

          <View style={styles.milestoneItem}>
            <Ionicons name="happy" size={20} color="#fff" />
            <View>
              <Text style={styles.milestoneText}>First Social Smile</Text>
              <Text style={styles.milestoneSubText}>Achieved: 2 months</Text>
            </View>
          </View>

          <View style={styles.milestoneItem}>
            <Ionicons name="walk" size={20} color="#fff" />
            <View>
              <Text style={styles.milestoneText}>Sitting Unassisted</Text>
              <Text style={styles.milestoneSubText}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* VACCINATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vaccination</Text>

          <View style={styles.list}>
            <Text>✔ PCV13 (Completed)</Text>
            <Text>⏳ MMR (Due in 14 days)</Text>
            <Text>📅 Varicella (Upcoming)</Text>
          </View>
        </View>

        {/* HISTORY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Assessments</Text>

          <View style={styles.history}>
            <MaterialIcons name="local-hospital" size={20} color="#1E88E5" />
            <View>
              <Text>9-Month Checkup</Text>
              <Text style={styles.small}>Growth normal, motor skills on track</Text>
            </View>
          </View>

          <View style={styles.history}>
            <MaterialIcons name="medical-services" size={20} color="#1E88E5" />
            <View>
              <Text>First Dental Exam</Text>
              <Text style={styles.small}>No decay, oral hygiene good</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= BLUE THEME ================= */
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

  subBrand: {
    fontSize: 12,
    color: "#6B7280",
  },

  body: {
    padding: 16,
    paddingBottom: 40,
  },

  label: {
    fontSize: 12,
    color: "#1E88E5",
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },

  button: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 12,
    gap: 6,
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    color: "#111",
  },

  cardSub: {
    color: "#6B7280",
    marginBottom: 10,
  },

  chart: {
    height: 110,
    backgroundColor: "#E6F0FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  line: {
    width: "80%",
    height: 2,
    backgroundColor: "#1E88E5",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E88E5",
    marginTop: -6,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stat: {
    width: "48%",
    backgroundColor: "#F0F7FF",
    padding: 10,
    borderRadius: 10,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  milestoneCard: {
    backgroundColor: "#1E88E5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },

  milestoneTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  milestoneItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  milestoneText: {
    color: "#fff",
    fontWeight: "700",
  },

  milestoneSubText: {
    color: "#DCEBFF",
    fontSize: 12,
  },

  list: {
    gap: 6,
  },

  history: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  small: {
    fontSize: 12,
    color: "#6B7280",
  },
});