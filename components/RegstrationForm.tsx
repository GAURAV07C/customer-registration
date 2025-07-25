"use client"
import React, { useState, useEffect, useTransition } from 'react';
// Importing icons for UI
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Calendar, Home, Check, Loader2, UserCheck } from 'lucide-react';
// React Hook Form for form state management
import { useForm } from 'react-hook-form';
// Zod resolver for schema validation
import { zodResolver } from '@hookform/resolvers/zod';
// Toast notifications
import { toast } from 'sonner';
// Import validation schema and types
import { registrationSchema, type RegistrationFormData } from '@/validation/uservalidation'
// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MapPreview from '@/components/MapPreview'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
// Actions for registration and customer lookup
import { submitRegistration, getCustomerByPhone } from '@/actions/userRegistaonAction';

const RegistrationForm = () => {
    // State for password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // State for location fetching
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    // State for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State for phone checking
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    // State for existing customer data
    const [existingCustomer, setExistingCustomer] = useState<any>(null);
    // State for confirmation dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    // State for phone status
    const [phoneStatus, setPhoneStatus] = useState<'idle' | 'checking' | 'found' | 'new'>('idle');

    // Initialize form with default values and validation
    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            gender: undefined as unknown as 'male' | 'female' | 'other',
            dob: '',
            address: '',
            password: '',
            confirmPassword: '',
            latitude: '',
            longitude: ''
        },
        mode: 'onBlur'
    });

    // Watchers for form fields
    // why use watchers
    // to track changes in specific fields without re-rendering the entire form

    const watchedPhone = form.watch('phone_number');
    const watchedPassword = form.watch('password');
    const watchedAddress = form.watch('address');
    const watchedLatitude = form.watch('latitude');
    const watchedLongitude = form.watch('longitude');

    // Transition for async actions
    const [isPending, startTransition] = useTransition();

    // Handles form submission
    const onSubmit = (data: RegistrationFormData) => {
        setIsSubmitting(true);
        try {
            console.log(data, "data")
            startTransition(() => {
                setIsCheckingPhone(true);
                setPhoneStatus('checking')
                // Call registration action
                const responses = submitRegistration(data);

                responses
                    .then((response) => {
                        console.log("res", response)
                        if (response.success) {
                            toast.success('Registration successful!', {
                                description: 'Customer has been registered successfully.'
                            });
                        }
                        // Reset form and states
                        form.reset();
                        setPhoneStatus('idle');
                        setExistingCustomer(null);
                    })
                    .catch(error => {
                        console.error('Registration error :', error)
                        toast.error('Registration failed ', {
                            description: error instanceof Error ? error.message : 'An unexpected error'
                        })
                    })
            })
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Registration failed', {
                    description: error.message
                })
            }
            console.error('Registration error : ,', error)
        } finally {
            setIsSubmitting(false);
        }
    }

    // Gets current location using browser geolocation
    const getLocation = () => {
        setIsGettingLocation(true);

        if (!navigator.geolocation) {
            toast.error('Geolocation not supported', {
                description: 'Your browser does not support geolocation'
            });
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
            // set latitude and longitude in form
            
                form.setValue('latitude', position.coords.latitude.toFixed(6));
                form.setValue('longitude', position.coords.longitude.toFixed(6));
                setIsGettingLocation(false);
                toast.success('Location captured successfully!');
            },
            (error) => {
                setIsGettingLocation(false);
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while retrieving location.';
                        break;
                }
                toast.error('Failed to get location', { description: errorMessage });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    // Checks if phone number exists in database
    useEffect(() => {
        const checkPhone = async () => {
            if (watchedPhone && watchedPhone.length === 10) {
                setIsCheckingPhone(true);
                setPhoneStatus('checking');
                try {
                    const response = await getCustomerByPhone(watchedPhone);
                    console.log("response", response)
                    if (response.success && response.data) {
                        setExistingCustomer(response.data);
                        setPhoneStatus('found');
                        setShowConfirmDialog(true);
                        toast.info(`Customer found: ${response.data.name}`, {
                            description: 'Would you like to auto-fill the form with existing details?'
                        });
                    } else {
                        setPhoneStatus('new');
                        setExistingCustomer(null);
                    }
                } catch (error) {
                    console.error('Phone check error:', error);
                    setPhoneStatus('idle');
                    toast.error('Failed to check phone number');
                } finally {
                    setIsCheckingPhone(false);
                }
            } else {
                setPhoneStatus('idle');
                setExistingCustomer(null);
            }
        };

        checkPhone();
    }, [watchedPhone]);

    // Checks email (duplicate logic for demonstration, can be refactored)
    useEffect(() => {
        const checkEmail = async () => {
            if (watchedPhone && watchedPhone.length === 10) {
                setIsCheckingPhone(true);       // Show loading spinner or indicator
                setPhoneStatus('checking');     // Set status to 'checking'

                try {
                    // Call backend to check if customer with this phone exists
                    const response = await getCustomerByPhone(watchedPhone);

                    if (response.success && response.data) {
                        // Customer found in database
                        setExistingCustomer(response.data);     // Store existing customer info
                        setPhoneStatus('found');                // Update status to 'found'
                        setShowConfirmDialog(true);             // Trigger confirm dialog

                        // Show toast to notify user
                        toast.info(`Customer found: ${response.data.name}`, {
                            description: 'Would you like to auto-fill the form with existing details?'
                        });
                    } else {
                        // No customer found — mark as new entry
                        setPhoneStatus('new');
                        setExistingCustomer(null);
                    }
                } catch (error) {
                    // Handle API or network failure
                    console.error('Phone check error:', error);
                    setPhoneStatus('idle');
                    toast.error('Failed to check phone number');
                } finally {
                    setIsCheckingPhone(false);    // Hide loading spinner
                }

            } else {
                // If phone is not 10 digits yet — reset status and clear any stored customer
                setPhoneStatus('idle');
                setExistingCustomer(null);
            }
        };

        // Call the phone check function without debounce
        checkEmail();
    }, [watchedPhone]);  // Re-run whenever watchedPhone changes

    // Handles auto-filling the form with existing customer data
    const handleAutoFill = () => {
        if (existingCustomer) {
            form.reset({
                name: existingCustomer.name,
                email: existingCustomer.email,
                phone_number: existingCustomer.phone_number,
                dob: existingCustomer.dob,
                gender: existingCustomer.gender,
                address: existingCustomer.address,
                latitude: existingCustomer.latitude,
                longitude: existingCustomer.longitude,
                password: '',
                confirmPassword: ''
            })
            setShowConfirmDialog(false);
            toast.success('Form auto-filled successfully!', {
                description: 'Please set a new password to continue.'
            });
        }
    }

    // Main form UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-8 px-4" >
            <div className="max-w-7xl mx-auto">

                {/* Page header */}
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

                    <div className="p-4 sm:p-6 lg:p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Full Name *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter full name"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Email Address *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="Enter email address"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Phone Field */}
                                        <FormField
                                            control={form.control}
                                            name="phone_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        Phone Number *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type="tel"
                                                                placeholder="Enter 10-digit phone number"
                                                                maxLength={10}
                                                                className={`h-11 pr-10 ${phoneStatus === 'found' ? 'border-green-300 bg-green-50' :
                                                                    phoneStatus === 'new' ? 'border-blue-300 bg-blue-50' : ''
                                                                    }`}
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/\D/g, '');
                                                                    field.onChange(value);
                                                                }}
                                                            />
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                {isCheckingPhone && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                                                {phoneStatus === 'found' && <UserCheck className="w-4 h-4 text-green-500" />}
                                                                {phoneStatus === 'new' && <Check className="w-4 h-4 text-blue-500" />}
                                                            </div>
                                                        </div>
                                                    </FormControl>

                                                    {/* Phone status message */}
                                                    {phoneStatus === 'found' && existingCustomer && (
                                                        <p className="text-sm text-green-600 flex items-center mt-1">
                                                            <UserCheck className="w-4 h-4 mr-1" />
                                                            Customer found: {existingCustomer.fullName}
                                                        </p>
                                                    )}
                                                    {phoneStatus === 'new' && watchedPhone && watchedPhone.length === 10 && (
                                                        <p className="text-sm text-blue-600 flex items-center mt-1">
                                                            <Check className="w-4 h-4 mr-1" />
                                                            New customer - ready to register
                                                        </p>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Gender Field */}
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Gender *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Date of Birth Field */}
                                        <FormField
                                            control={form.control}
                                            name="dob"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Date of Birth *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Address Field */}
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Home className="w-4 h-4 mr-2" />
                                                        Address *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter complete address"
                                                            className="resize-none min-h-[100px]"
                                                            maxLength={500}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="flex justify-between items-center">
                                                        <FormMessage />
                                                        <p className={`text-sm ml-auto ${watchedAddress && watchedAddress.length > 450 ? 'text-amber-600' : 'text-gray-500'
                                                            }`}>
                                                            {watchedAddress ? watchedAddress.length : 0}/500
                                                        </p>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Password *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Enter password (min 6 characters)"
                                                                className="h-11 pr-12"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                            >
                                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    {/* Password strength meter */}
                                                    {watchedPassword && <PasswordStrengthMeter password={watchedPassword} />}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Confirm Password *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                placeholder="Confirm password"
                                                                className="h-11 pr-12"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Location Fields */}
                                        <div className="space-y-4">
                                            <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                GPS Coordinates
                                            </FormLabel>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="latitude"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Latitude"
                                                                    readOnly
                                                                    className="h-11 bg-muted text-muted-foreground"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="longitude"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Longitude"
                                                                    readOnly
                                                                    className="h-11 bg-muted text-muted-foreground"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={getLocation}
                                                disabled={isGettingLocation}
                                                className="w-full h-11"
                                            >
                                                {isGettingLocation ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                )}
                                                {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Preview */}
                                {watchedLatitude && watchedLongitude && (
                                    <div className="mt-8">
                                        <MapPreview
                                            latitude={parseFloat(watchedLatitude)}
                                            longitude={parseFloat(watchedLongitude)}
                                        />
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        size="lg"
                                        className="w-full h-12 text-lg font-semibold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Registering Customer...
                                            </>
                                        ) : (
                                            'Register Customer'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
                {/* Auto-fill confirmation dialog */}
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center">
                                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                                Existing Customer Found
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                We found an existing customer with this phone number:
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-900">{existingCustomer?.fullName}</p>
                                    <p className="text-sm text-gray-600">{existingCustomer?.email}</p>
                                    <p className="text-sm text-gray-600 mt-1">{existingCustomer?.address}</p>
                                </div>
                                Would you like to auto-fill the form with this customer's details?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} className="w-full sm:w-auto">
                                No, Continue Manually
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleAutoFill} className="w-full sm:w-auto">
                                Yes, Auto-fill Form
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default RegistrationForm;