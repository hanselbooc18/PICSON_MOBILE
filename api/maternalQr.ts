import { apiRequest, ApiRecord } from "@/api/client";

export type MaternalPatient = {

  qr_identifier: string;
  full_name: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  birth_date?: string | null;
  address?: string | null;
  contact_number?: string | null;
  blood_type?: string | null;
  allergies?: string | null;
  gravida?: string | null;
  term_births?: string | null;
  preterm_births?: string | null;
  abortion?: string | null;
  living_children?: string | null;
};

export type PregnancyHistory = {
  gravida?: string | null;
  term_births?: string | null;
  preterm_births?: string | null;
  abortions?: string | null;
  living_children?: string | null;
};

export type PrenatalRecords = {
  vital_signs: ApiRecord[];
  laboratory_results: ApiRecord[];
  admissions: ApiRecord[];
  medication_sheets: ApiRecord[];
};

export type MaternalQrProfile = {
  patient: MaternalPatient;
  pregnancy_history: PregnancyHistory;
  prenatal_records: PrenatalRecords;
  recent_consultations: ApiRecord[];
  record_counts?: {
    visits: number;
    vital_signs: number;
    laboratory_results: number;
    admissions: number;
    medication_sheets: number;
  };
};

export function getMaternalProfileByQr(qrIdentifier: string) {
  return apiRequest<MaternalQrProfile>(
    `/api/maternal-patients/qr/${encodeURIComponent(qrIdentifier)}`
  );
}

export function getMyMaternalProfile() {
  return apiRequest<MaternalQrProfile>(`/api/patient/me`);
}

export function extractQrIdentifier(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  const cleaned = value.toUpperCase().replace(/\s+/g, " ").trim();

  const prefixMatch = cleaned.match(/^(?:PATIENT\s*ID\s*[:\-]?\s*|QR\s*CODE\s*[:\-]?\s*)+(.*)$/i);
  if (prefixMatch?.[1]) {
    return prefixMatch[1].trim();
  }

  try {
    const url = new URL(cleaned);
    const queryQr = url.searchParams.get("qr") || url.searchParams.get("code");

    if (queryQr) {
      return queryQr.trim().toUpperCase();
    }

    const lastPathPart = url.pathname.split("/").filter(Boolean).pop();

    if (lastPathPart) {
      return lastPathPart.trim().toUpperCase();
    }
  } catch {
    // If it is not a valid URL, continue to fallback return below.
  }

  return cleaned;
}
