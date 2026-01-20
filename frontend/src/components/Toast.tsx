import React from 'react';
import { useNotification, Notification } from '../contexts/NotificationContext';

const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};

const ToastItem: React.FC<{ notification: Notification; onClose: () => void }> = ({
    notification,
    onClose
}) => {
    return (
        <div className={`toast toast-${notification.type}`}>
            <span className="toast-icon">{icons[notification.type]}</span>
            <span className="toast-message">{notification.message}</span>
            <button className="toast-close" onClick={onClose}>&times;</button>
        </div>
    );
};

const Toast: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className="toast-container">
            {notifications.map(notification => (
                <ToastItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
