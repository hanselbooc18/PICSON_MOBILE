import { apiRequest, ApiRecord } from "@/api/client";

export type MaternalPatient = {
  id: number | string;
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
};

export function getMaternalProfileByQr(qrIdentifier: string) {
  return apiRequest<MaternalQrProfile>(
    `/api/maternal-patients/qr/${encodeURIComponent(qrIdentifier)}`
  );
}

export function extractQrIdentifier(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    const queryQr = url.searchParams.get("qr") || url.searchParams.get("code");

    if (queryQr) {
      return queryQr.trim().toUpperCase();
    }

    const lastPathPart = url.pathname.split("/").filter(Boolean).pop();

    if (lastPathPart) {
      return lastPathPart.trim().toUpperCase();
    }
  } catch {
    return value.toUpperCase();
  }

  return value.toUpperCase();
}
