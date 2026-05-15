import { apiRequest, getToken } from "./client";

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

export async function deleteDocument(documentId) {
  return apiRequest(`/documents/${documentId}`, {
    method: "DELETE",
  });
}

export async function downloadDocument(documentId, filename = "document.pdf") {
  const token = getToken();

  const response = await fetch(`/api/documents/${documentId}/download`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Download failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}