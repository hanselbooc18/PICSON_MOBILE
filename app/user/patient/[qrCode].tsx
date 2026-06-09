import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getMaternalProfileByQr } from "@/api/maternalQr";

export default function TrackerProfileScreen() {
  const { qrCode } = useLocalSearchParams();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {profile.patient.full_name}
      </Text>

      <Text>QR: {profile.patient.qr_identifier}</Text>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Pregnancy History
      </Text>

      <Text>Gravida: {profile.pregnancy_history.gravida}</Text>
      <Text>Term: {profile.pregnancy_history.term_births}</Text>
      <Text>Preterm: {profile.pregnancy_history.preterm_births}</Text>
      <Text>Living: {profile.pregnancy_history.living_children}</Text>
    </ScrollView>
  );
}