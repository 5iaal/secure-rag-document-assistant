export const mockDocuments = [
  { id: 1, name: 'Security_Policy_2026.pdf', size: '2.4 MB', date: '2026-05-10', status: 'Verified', integrity: 'SHA256 Match', access: 'Restricted' },
  { id: 2, name: 'Network_Architecture.pdf', size: '5.1 MB', date: '2026-05-09', status: 'Processing', integrity: 'Pending', access: 'Team' },
  { id: 3, name: 'Compliance_Report_Q2.pdf', size: '1.8 MB', date: '2026-05-08', status: 'Verified', integrity: 'SHA256 Match', access: 'Public' },
];

export const mockAuditLogs = [
  { id: 'a1', user: 'admin@corp.io', action: 'LOGIN_SUCCESS', ip: '192.168.1.45', time: '09:12:33', status: 'success' },
  { id: 'a2', user: 'analyst@corp.io', action: 'DOC_UPLOAD', ip: '10.0.0.12', time: '08:45:10', status: 'success' },
  { id: 'a3', user: 'unknown@ext.io', action: 'AUTH_FAILURE', ip: '203.0.113.5', time: '07:22:01', status: 'failed' },
  { id: 'a4', user: 'admin@corp.io', action: 'RAG_QUERY', ip: '192.168.1.45', time: '06:15:20', status: 'success' },
];

export const mockStats = { docs: 124, queries: 1847, failedAuth: 3, systemHealth: 99.2 };
