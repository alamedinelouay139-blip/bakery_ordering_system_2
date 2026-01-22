import api from '../api/axios';

export interface AuditLog {
    id: number;
    user_id: number | null;
    user_name: string | null;
    user_email: string | null;
    action: string;
    target: string;
    status: string;
    ip_address: string;
    user_agent: string;
    old_value: string | null;
    new_value: string | null;
    created_at: string;
}

export const auditService = {
    async getAuditLogs(): Promise<AuditLog[]> {
        const response = await api.get('/api/audit-logs');
        if (response.data.data) {
            return response.data.data;
        }
        return Array.isArray(response.data) ? response.data : [];
    },
};
