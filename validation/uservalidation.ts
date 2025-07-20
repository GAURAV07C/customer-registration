import { z ,ZodError } from 'zod';

// Custom email regex - more comprehensive than basic patterns
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone regex for exactly 10 digits
const phoneRegex = /^\d{10}$/;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters'),

  phone: z
    .string()
    .regex(phoneRegex, 'Phone number must be exactly 10 digits')
    .transform(val => val.replace(/\D/g, '')), // Remove non-digits

  gender: z.enum(["male", "female", "other"], {
    message: "Invalid gender selected"
  }),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }, 'Must be at least 13 years old'),

  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must not exceed 500 characters'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),

  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),

  latitude: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <= 90),
      'Invalid latitude'),

  longitude: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <= 180),
      'Invalid longitude'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Validation helper for individual fields
export const validateField = (fieldName: keyof RegistrationFormData, value: any, allData?: Partial<RegistrationFormData>) => {
  try {
    if (fieldName === 'confirmPassword' && allData) {
      // Special handling for confirm password
      registrationSchema.parse({ ...allData, [fieldName]: value });
    } else {
      registrationSchema.shape[fieldName].parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return error.issues[0]?.message || 'Invalid input';
    }
  }
};


