import { apiRequest, ApiRecord, PaginatedResponse } from "@/api/client";

export const clinicResources = [
  {
    key: "patients",
    label: "Patients",
    endpoint: "/api/patients",
  },
  {
    key: "visits",
    label: "Visits",
    endpoint: "/api/visits",
  },
  {
    key: "vital_signs",
    label: "Vital Signs",
    endpoint: "/api/vital_signs",
  },
  {
    key: "laboratory_results",
    label: "Laboratory Results",
    endpoint: "/api/laboratory_results",
  },
  {
    key: "medication_sheets",
    label: "Medication Sheets",
    endpoint: "/api/medication_sheets",
  },
  {
    key: "admissions",
    label: "Admissions",
    endpoint: "/api/admissions",
  },
  {
    key: "discharges",
    label: "Discharges",
    endpoint: "/api/discharges",
  },
  {
    key: "newborns",
    label: "Newborns",
    endpoint: "/api/newborns",
  },
  {
    key: "admission_consents",
    label: "Admission Consents",
    endpoint: "/api/admission_consents",
  },
  {
    key: "waivers",
    label: "Waivers",
    endpoint: "/api/waivers",
  },
] as const;

export type ClinicResource = (typeof clinicResources)[number];
export type ClinicResourceKey = ClinicResource["key"];

export function listResource(
  resource: ClinicResource,
  perPage = 5
): Promise<PaginatedResponse<ApiRecord>> {
  return apiRequest<PaginatedResponse<ApiRecord>>(
    `${resource.endpoint}?per_page=${perPage}`
  );
}

export function showResource(
  resource: ClinicResource,
  id: string | number
): Promise<ApiRecord> {
  return apiRequest<ApiRecord>(`${resource.endpoint}/${id}`);
}

export function createResource(
  resource: ClinicResource,
  data: ApiRecord
): Promise<ApiRecord> {
  return apiRequest<ApiRecord>(resource.endpoint, {
    method: "POST",
    body: data,
  });
}

export function updateResource(
  resource: ClinicResource,
  id: string | number,
  data: ApiRecord
): Promise<ApiRecord> {
  return apiRequest<ApiRecord>(`${resource.endpoint}/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteResource(
  resource: ClinicResource,
  id: string | number
): Promise<void> {
  return apiRequest<void>(`${resource.endpoint}/${id}`, {
    method: "DELETE",
  });
}
