import { apiRequest } from "./client";

export async function getAuditLogs(limit = 100) {
  return apiRequest(`/audit/events?limit=${limit}`);
}