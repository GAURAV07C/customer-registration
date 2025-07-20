"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Calendar, Home, Check, Loader2, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registrationSchema, type RegistrationFormData } from '@/validation/uservalidation'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const [existingCustomer, setExistingCustomer] = useState<any>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [phoneStatus, setPhoneStatus] = useState<'idle' | 'checking' | 'found' | 'new'>('idle');


    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            password: '',
            confirmPassword: '',
            latitude: '',
            longitude: ''
        },
        mode: 'onBlur'
    });




    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-8 px-4" >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Customer Registration
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Register new customers during your field visits
                    </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-4 sm:py-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">Customer Information</h2>
                    </div>
</div>



                </div>
            </div >

            )

}

            export default RegistrationForm;