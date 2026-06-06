import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
          <Text style={styles.brand}>MaternalCare</Text>
        </View>

        <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* HEADER */}
        <Text style={styles.sectionLabel}>Health Insights</Text>
        <Text style={styles.title}>Tracker</Text>

        {/* BUTTON */}
        <View style={styles.newBtn}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.newBtnText}>New Entry</Text>
        </View>

        {/* GROWTH CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Growth Curve</Text>
          <Text style={styles.cardSub}>
            Leo's height and weight progression
          </Text>

          <View style={styles.chartBox}>
            <View style={styles.chartLine} />
            <View style={styles.chartDot} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Current Weight</Text>
              <Text style={styles.statValue}>9.4 kg</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Weight Gain</Text>
              <Text style={styles.statValue}>+0.4 kg</Text>
            </View>
          </View>
        </View>

        {/* MILESTONES */}
        <View style={styles.cardBlue}>
          <Text style={styles.cardTitleWhite}>Milestones</Text>

          <View style={styles.milestone}>
            <Ionicons name="happy" size={22} color="#fff" />
            <View>
              <Text style={styles.milestoneTitle}>First Social Smile</Text>
              <Text style={styles.milestoneSub}>Achieved: 2 months</Text>
            </View>
          </View>

          <View style={styles.milestone}>
            <Ionicons name="walk" size={22} color="#fff" />
            <View>
              <Text style={styles.milestoneTitle}>Sitting Unassisted</Text>
              <Text style={styles.milestoneSub}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* VACCINATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vaccination</Text>

          <View style={styles.timeline}>
            <Text>PCV13 (Done)</Text>
            <Text>MMR (Due in 14 days)</Text>
            <Text>Varicella (Upcoming)</Text>
          </View>
        </View>

        {/* HISTORY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Assessments</Text>

          <View style={styles.historyItem}>
            <MaterialIcons name="local-hospital" size={20} color="#1E88E5" />
            <View>
              <Text>9-Month Checkup</Text>
              <Text style={styles.smallText}>
                Growth normal, motor skills on track
              </Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <MaterialIcons name="medical-services" size={20} color="#1E88E5" />
            <View>
              <Text>First Dental Exam</Text>
              <Text style={styles.smallText}>
                No decay, oral hygiene good
              </Text>
            </View>
          </View>
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
    borderColor: "#eee",
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
    paddingBottom: 40,
  },

  sectionLabel: {
    color: "#1E88E5",
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 12,
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 15,
  },

  newBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },

  cardBlue: {
    backgroundColor: "#1E88E5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  cardTitleWhite: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },

  cardSub: {
    color: "#666",
    marginBottom: 10,
  },

  chartBox: {
    height: 120,
    backgroundColor: "#EAF3FF",
    borderRadius: 12,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  chartLine: {
    width: "80%",
    height: 2,
    backgroundColor: "#1E88E5",
  },

  chartDot: {
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

  statBox: {
    width: "48%",
    backgroundColor: "#F0F7FF",
    padding: 10,
    borderRadius: 10,
  },

  statLabel: {
    fontSize: 12,
    color: "#666",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  milestone: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  milestoneTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  milestoneSub: {
    color: "#E5E7EB",
    fontSize: 12,
  },

  timeline: {
    gap: 6,
  },

  historyItem: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  smallText: {
    fontSize: 12,
    color: "#666",
  },
});