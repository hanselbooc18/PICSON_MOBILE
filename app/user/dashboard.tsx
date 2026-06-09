import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getCurrentUser,
  getUserRole,
  logout,
  MobileUser,
} from "@/api/auth";
import {
  clinicResources,
  ClinicResource,
  listResource,
} from "@/api/clinicResources";

type UserSummary = {
  key: string;
  label: string;
  total: number;
};

const visibleResources = clinicResources.filter((resource) =>
  ["patients", "visits", "vital_signs", "laboratory_results", "admissions"].includes(
    resource.key
  )
);

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<MobileUser | null>(null);
  const [summaries, setSummaries] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalRecords = useMemo(
    () => summaries.reduce((sum, item) => sum + item.total, 0),
    [summaries]
  );

  const loadDashboard = useCallback(async () => {
    setError(null);

    const [currentUser, resourceResults] = await Promise.all([
      getCurrentUser(),
      Promise.all(
        visibleResources.map(async (resource: ClinicResource) => {
          const response = await listResource(resource, 1);

          return {
            key: resource.key,
            label: resource.label,
            total: response.total ?? response.data?.length ?? 0,
          };
        })
      ),
    ]);

    setUser(currentUser);
    setSummaries(resourceResults);
  }, []);

  useEffect(() => {
    loadDashboard()
      .catch((loadError) => {
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load dashboard"
        );
      })
      .finally(() => setIsLoading(false));
  }, [loadDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await loadDashboard();
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Unable to refresh dashboard"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>PICSON Clinic</Text>
            <Text style={styles.subtle}>User Dashboard</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#1E88E5" size="large" />
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
          >
            <View style={styles.header}>
              <Text style={styles.role}>{getUserRole(user) || "User"}</Text>
              <Text style={styles.title}>Welcome, {user?.name || "User"}</Text>
             
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={20} color="#B91C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Available Records</Text>
              <Text style={styles.summaryValue}>{totalRecords}</Text>
            </View>

            <Text style={styles.sectionTitle}>My Clinic Files</Text>

            <View style={styles.list}>
              {summaries.map((item) => (
                <View key={item.key} style={styles.item}>
                  <View style={styles.itemIcon}>
                    <Ionicons name="document-text-outline" size={20} color="#1E88E5" />
                  </View>
                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>{item.label}</Text>
                    <Text style={styles.itemSub}>Backend resource connected</Text>
                  </View>
                  <Text style={styles.itemCount}>{item.total}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  topBar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  brand: {
    color: "#1E88E5",
    fontSize: 18,
    fontWeight: "800",
  },
  subtle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: "#64748B",
    marginTop: 10,
  },
  content: {
    padding: 18,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  role: {
    color: "#1E88E5",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  description: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
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
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 12,
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 6,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 20,
  },
  list: {
    gap: 10,
  },
  item: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
  },
  itemIcon: {
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    marginRight: 12,
    width: 40,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
  },
  itemSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  itemCount: {
    color: "#1E88E5",
    fontSize: 18,
    fontWeight: "800",
    minWidth: 34,
    textAlign: "right",
  },
});
