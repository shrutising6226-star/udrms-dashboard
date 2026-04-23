import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const getStyle = (s) => {
    switch (s?.toLowerCase()) {
      case 'active':
      case 'present':
      case 'paid':
      case 'approved':
        return 'bg-status-activeBg text-status-activeText';
      case 'inactive':
      case 'absent':
      case 'rejected':
      case 'failed':
        return 'bg-status-inactiveBg text-status-inactiveText';
      case 'leave':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle(status)} ${className}`}>
      {status}
    </span>
  );
};
