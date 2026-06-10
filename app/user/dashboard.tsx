import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
import { getMyMaternalProfile, MaternalQrProfile } from "@/api/maternalQr";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserSummary = {
  key: string;
  label: string;
  total: number;
};

type IconName = keyof typeof Ionicons.glyphMap;

const RESOURCE_ICONS: Record<string, IconName> = {
  patients: "people-outline",
  visits: "calendar-outline",
  vital_signs: "heart-outline",
  laboratory_results: "flask-outline",
  admissions: "business-outline",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const visibleResources = clinicResources.filter((r) =>
  ["patients", "visits", "vital_signs", "laboratory_results", "admissions"].includes(r.key)
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<MobileUser | null>(null);
  const [profile, setProfile] = useState<MaternalQrProfile | null>(null);
  const [summaries, setSummaries] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrVisible, setQrVisible] = useState(false);

  const qrIdentifier = profile?.patient?.qr_identifier ?? null;
  const hasQrIdentifier = Boolean(qrIdentifier);

  const totalRecords = useMemo(
    () => summaries.reduce((sum, item) => sum + item.total, 0),
    [summaries]
  );

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    setError(null);

    const [currentUser, profileData, resourceResults] = await Promise.all([
      getCurrentUser(),
      getMyMaternalProfile().catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your patient profile."
        );
        return null;
      }),
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
    setProfile(profileData);
    setSummaries(resourceResults);
  }, []);

  useEffect(() => {
    loadDashboard()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load dashboard")
      )
      .finally(() => setIsLoading(false));
  }, [loadDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Replace to root — works outside the (user) tab group
      router.replace("/");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>

        {/* ── HEADER ── */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Branding */}
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "800", color: "#2563EB" }}
                >
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
                  <Text style={{ color: "#FFFFFF", fontSize: 10 }}>Clinic</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
                User Dashboard
              </Text>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {/* Notification */}
              <Pressable style={{ padding: 8, position: "relative" }}>
                <Ionicons name="notifications-outline" size={24} color="#94A3B8" />
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#EF4444",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                  }}
                />
              </Pressable>

              {/* Logout */}
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
          </View>
        </View>

        {/* ── LOADING STATE ── */}
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#2563EB" size="large" />
            <Text style={{ color: "#64748B", marginTop: 10 }}>
              Loading your dashboard...
            </Text>
          </View>
        ) : (

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
          >

            {/* ── WELCOME CARD ── */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "#F1F5F9",
                marginBottom: 16,
                shadowColor: "#0F172A",
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {/* Badge */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#3B82F6",
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: "#2563EB",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {getUserRole(user) || "Patient Profile"}
                </Text>
              </View>

              {/* Greeting */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#1E293B",
                  lineHeight: 30,
                }}
              >
                Welcome back,{"\n"}
                <Text style={{ color: "#2563EB" }}>{user?.name || "User"}</Text>
              </Text>

              {/* Divider row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#F8FAFC",
                }}
              >
                <View>
                  <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>
                    Available Records
                  </Text>
                  <Text style={{ fontSize: 28, fontWeight: "800", color: "#0F172A" }}>
                    {String(totalRecords).padStart(2, "0")}
                  </Text>
                </View>

                {/* QR Button */}
                <TouchableOpacity
                  onPress={() => setQrVisible(true)}
                  disabled={!hasQrIdentifier}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: hasQrIdentifier ? "#2563EB" : "#94A3B8",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    shadowColor: hasQrIdentifier ? "#2563EB" : "#000",
                    shadowOpacity: hasQrIdentifier ? 0.35 : 0,
                    shadowRadius: 8,
                    elevation: hasQrIdentifier ? 4 : 0,
                  }}
                >
                  <Ionicons
                    name="qr-code-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
                    My QR Code
                  </Text>
                </TouchableOpacity>
                {!hasQrIdentifier ? (
                  <Text
                    style={{
                      marginTop: 8,
                      color: "#64748B",
                      fontSize: 12,
                    }}
                  >
                    QR identifier not available. Please contact the clinic.
                  </Text>
                ) : null}
              </View>
            </View>

            {/* ── ERROR BANNER ── */}
            {error ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#FEF2F2",
                  borderWidth: 1,
                  borderColor: "#FECACA",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="alert-circle-outline" size={20} color="#B91C1C" />
                <Text style={{ color: "#B91C1C", fontSize: 13, flex: 1 }}>{error}</Text>
              </View>
            ) : null}

            {/* ── MATERNAL PROFILE CARD ── */}
            {profile && (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/user/patient/${profile.patient.qr_identifier}` as any)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: "#2563EB",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A" }}>
                    View Your Maternal Record
                  </Text>
                  <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                    {profile.patient.full_name} · QR: {profile.patient.qr_identifier}
                  </Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
            )}

            {/* ── CLINIC FILES ── */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "800", color: "#1E293B" }}>
                My Clinic Files
              </Text>
              <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "500" }}>
                View All
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              {summaries.map((item) => (
                <View
                  key={item.key}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#F1F5F9",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    shadowColor: "#0F172A",
                    shadowOpacity: 0.03,
                    shadowRadius: 4,
                    elevation: 1,
                  }}
                >
                  {/* Icon */}
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "#EFF6FF",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <Ionicons
                      name={RESOURCE_ICONS[item.key] ?? "document-text-outline"}
                      size={22}
                      color="#2563EB"
                    />
                  </View>

                  {/* Text */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#0F172A" }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                      Backend resource connected
                    </Text>
                  </View>

                  {/* Count */}
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                      color: item.total > 0 ? "#2563EB" : "#CBD5E1",
                      minWidth: 30,
                      textAlign: "right",
                    }}
                  >
                    {item.total}
                  </Text>
                </View>
              ))}
            </View>

          </ScrollView>
        )}
      </SafeAreaView>

      {/* ── QR MODAL ── */}
      <Modal visible={qrVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setQrVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.65)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#FFFFFF",
              width: "100%",
              maxWidth: 360,
              borderRadius: 28,
              padding: 32,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Close X */}
            <Pressable
              onPress={() => setQrVisible(false)}
              style={{ position: "absolute", top: 16, right: 16, padding: 4 }}
            >
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>

            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E293B", marginBottom: 4 }}>
              My Digital ID
            </Text>
            

            {/* QR Image */}
            <View
              style={{
                width: 180,
                height: 180,
                backgroundColor: "#F8FAFC",
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: "#CBD5E1",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                padding: 12,
              }}
            >
              {qrIdentifier ? (
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrIdentifier}`,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              ) : (
                <Text
                  style={{
                    color: "#475569",
                    fontSize: 14,
                    textAlign: "center",
                    paddingHorizontal: 12,
                  }}
                >
                  QR identifier not available
                </Text>
              )}
            </View>

            {/* Patient ID Badge */}
            <View
              style={{
                backgroundColor: "#EFF6FF",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: "#2563EB",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Patient ID
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  color: "#1E3A8A",
                  fontFamily: "monospace",
                }}
              >
                {qrIdentifier ? qrIdentifier : "QR identifier not available"}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setQrVisible(false)}
              style={{
                width: "100%",
                backgroundColor: "#F1F5F9",
                paddingVertical: 14,
                borderRadius: 14,
                marginTop: 24,
              }}
            >
              <Text
                style={{ textAlign: "center", fontWeight: "700", color: "#475569" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}