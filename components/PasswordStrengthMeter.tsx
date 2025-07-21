import React from 'react'

// Props interface for the PasswordStrengthMeter component
interface PasswordStrengthMeterProps {
    password: string;
}

// PasswordStrengthMeter component displays a visual indicator of password strength
const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    // Calculates password strength score, label, and color based on criteria
    const calculateStrength = (password: string): { score: number; label: string; color: string } => {
        let score = 0;

        // Add points for length and character variety
        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // Return strength label and color based on score
        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    // Get strength details for the current password
    const strength = calculateStrength(password);
    // Calculate width percentage for the strength bar
    const widthPercentage = (strength.score / 6) * 100;

    // Do not render anything if password is empty
    if (!password) return null;

    return (
        <div className="mt-2">
            {/* Header with strength label */}
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
            {/* Visual strength bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${widthPercentage}%` }}
                ></div>
            </div>
            {/* Helper text based on password strength */}
            <div className="mt-1 text-xs text-gray-500">
                {password.length < 6 && 'At least 6 characters required'}
                {password.length >= 6 && strength.score < 4 && 'Try adding uppercase, numbers, or symbols'}
                {strength.score >= 5 && 'Excellent password strength!'}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;