import React from 'react';

export const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const getInitials = (n) => n ? n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : '?';
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-light text-primary font-bold ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
