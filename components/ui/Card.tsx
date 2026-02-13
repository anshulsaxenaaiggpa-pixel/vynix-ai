import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
    return (
        <div
            className={`
        bg-glass-gradient backdrop-blur-xl border border-white/10 rounded-2xl p-6
        ${glow ? 'animate-glow-pulse' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-2xl font-bold text-white ${className}`}>
            {children}
        </h3>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
