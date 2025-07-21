'use server';

/**
 * User Registration Action
 * Handles user registration, email and phone number checks, and customers retrieval.
 * Validates input data using Zod schema and interacts with Prisma ORM for database operations.
 * @file actions/userRegistrationAction.ts
 */

import prisma from "@/lib/prisma"

import { RegistrationFormData, registrationSchema } from "@/validation/uservalidation";

import { z } from "zod"



/**
 * Submits user regstration data.
 * Validates the data, checks for existing email and phone number, and creates a new user in the database.
 * @param formData - The registration form data to be submitted.
 * @returns An object indicating success or failure, with appropriate error message and validation errors if any.
 * @throws {Error} If an unexpected error occurs during the process.
 */

export const submitRegistration = async (formData: RegistrationFormData) => {
    try {
        // Validate the form data using Zod schema
        // This will throw an error if validation fails
        
        const validatedData = registrationSchema.parse(formData);

        const { name, email, password, phone_number, gender, dob, latitude, longitude, address } = validatedData

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
            where: { phone_number: phone_number }
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
                name: name,
                email: email,
                phone_number: phone_number,
                gender: gender,
                dob: dob,
                address: address,
                password: password,
                latitude: latitude ?? "",
                longitude: longitude ?? "",
            }
        });

        return {
            success: true,
            data: { createdUser }
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
        console.error('error in ', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error '
        };
    }
};

/**
 *  Retrived customer by phone number.
 * Searches for a user by their phone number in the database.
 * @param phone - The phone number to search for in the database.
 * @returns An object indicating success or failure, with user data if found or an error message if not found or an error occurs.
 * @throws {Error} If an unexpected errors occurs during the process.
 */
export const getCustomerByPhone = async (phone: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: { phone_number: phone }
        });
        if (!user) {
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


/**
 * Retrieved customer by email.
 * Searches for a user by their email in the database.
 * @param email - The email to search for in the database.
 */

export const getCustomerByEmail = async (email: string) => {
    try {
        const customer = await prisma.user.findUnique({ where: { email } });
        if (!customer) {
            return { success: true, data: null };
        }

        return {
            success: true,
            data: {
                ...customer,
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
};

