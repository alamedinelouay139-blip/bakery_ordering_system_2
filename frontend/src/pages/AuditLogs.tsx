import React, { useState, useEffect } from 'react';
import { auditService, AuditLog } from '../services/audit.service';
import { useNotification } from '../contexts/NotificationContext';
import Navbar from '../components/Navbar';

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const notification = useNotification();

    useEffect(() => {
        loadAuditLogs();
    }, []);

    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            const data = await auditService.getAuditLogs();
            setLogs(data);
        } catch (err: any) {
            notification.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (status: string) => {
        if (status === 'SUCCESS') {
            return <span className="badge badge-success">Success</span>;
        }
        return <span className="badge badge-danger">Fail</span>;
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="page-header">
                    <div>
                        <h1>Audit Logs</h1>
                        <p className="text-muted">View system activity and security events</p>
                    </div>
                    <button onClick={loadAuditLogs} className="btn btn-primary">
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No Audit Logs Yet</h3>
                        <p>Activity will appear here as users interact with the system</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date/Time</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Status</th>
                                    <th>IP Address</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{formatDate(log.created_at)}</td>
                                        <td>
                                            {log.user_name || log.user_email ||
                                                <span className="text-muted">Anonymous</span>}
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">{log.action}</span>
                                        </td>
                                        <td>{log.target}</td>
                                        <td>{getStatusBadge(log.status)}</td>
                                        <td>
                                            <code>{log.ip_address || 'N/A'}</code>
                                        </td>
                                        <td>
                                            {log.new_value && (
                                                <small className="text-muted">
                                                    {JSON.stringify(JSON.parse(log.new_value), null, 0).substring(0, 50)}...
                                                </small>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
