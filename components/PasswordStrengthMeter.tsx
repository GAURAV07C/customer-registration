import React from 'react';

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const calculateStrength = (password: string): { score: number; label: string; color: string } => {
        let score = 0;

        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    const strength = calculateStrength(password);
    const widthPercentage = (strength.score / 6) * 100;

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Password Strength</span>
                <span className={`text-xs font-medium ${strength.label === 'Weak' ? 'text-red-600' :
                        strength.label === 'Fair' ? 'text-yellow-600' :
                            strength.label === 'Good' ? 'text-blue-600' :
                                'text-green-600'
                    }`}>
                    {strength.label}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${widthPercentage}%` }}
                ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
                {password.length < 6 && 'At least 6 characters required'}
                {password.length >= 6 && strength.score < 4 && 'Try adding uppercase, numbers, or symbols'}
                {strength.score >= 5 && 'Excellent password strength!'}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;