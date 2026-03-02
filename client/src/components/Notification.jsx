import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Notification({ message, type = 'info', onClose, duration = 3000 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    if (!message) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div className={`notification-toast ${type} ${visible ? 'fade-in' : 'fade-out'}`}>
            <div className="notification-content">
                {getIcon()}
                <span>{message}</span>
            </div>
            <button className="notification-close" onClick={handleClose}>
                <X size={16} />
            </button>
        </div>
    );
}
