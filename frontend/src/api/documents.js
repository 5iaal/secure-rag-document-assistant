import { apiRequest } from "./client";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getMyDocuments() {
  return apiRequest("/documents/me");
}

export async function verifyDocument(documentId) {
  return apiRequest(`/documents/${documentId}/verify`);
}