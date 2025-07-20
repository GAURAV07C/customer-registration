import prisma from "@/lib/prisma"

import { RegistrationFormData, registrationSchema } from "@/validation/uservalidation";

import { z } from "zod"


export const submitRegistration = async (formData: RegistrationFormData) => {
    try {
        const validatedData = registrationSchema.parse(formData);

        const { fullName, email, password, phone, gender, dateOfBirth, latitude, longitude, address } = validatedData

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: email }
        });
        if (existingEmail) {
            return {
                success: false,
                error: 'Email is already in use',
                errors: { email: 'This email is already registered' }
            };
        }

        // Check if phone already exists
        const existingPhone = await prisma.user.findFirst({
            where: { phone_number: phone }
        });
        if (existingPhone) {
            return {
                success: false,
                error: 'Phone is already in use',
                errors: { phone: 'This phone number is already registered' }
            };
        }

        // Save to real database
        const createdUser = await prisma.user.create({
            data: {
                name: fullName,
                email: validatedData.email,
                phone_number: phone,
                gender: gender,
                dob: dateOfBirth,
                address: address,
                password: password, // Hash this in real app
                latitude: latitude ?? "",
                longitude: longitude ?? "",
            }
        });

        return {
            success: true,
            data: { id: createdUser.id }
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach(err => {
                if (err.path.length > 0) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });

            return {
                success: false,
                error: 'Validation failed',
                errors: fieldErrors
            };
        }

        return {
            success: false,
            error: 'Server error'
        };
    }
};


export const checkEmailAvailability = async (email: string) => {
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        return {
            success: true,
            data: { available: !existing }
        };
    } catch {
        return {
            success: false,
            error: 'Server error'
        };
    }
};

export const getCustomerByPhone = async (phone: string) => {
    try {
            const user = await prisma.user.findFirst({
                where: { phone_number: phone } 
            });
            if(!user) {
                return { success: true, data: null };
            }
    
            return {
                success: true,
                data: {
                    ...user,
                    password: '',
                    confirmPassword: ''
                }
            };
        } catch {
            return {
                success: false,
                error: 'Server error'
            };
        }
    }


