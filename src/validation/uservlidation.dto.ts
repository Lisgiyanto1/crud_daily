import { z } from "zod";

export class UserValidation {
    static readonly REGISTER = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    static readonly LOGIN = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    static readonly WORK_IDENTITY = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        work_identity: z.array(
            z.object({
                no_employee: z.string({ required_error: "Employee number must be a string" }).optional(),
                company: z.string({ required_error: "Company must be a string" }).optional(),
                position: z.string({ required_error: "Position must be a string" }).optional(),
                start_date: z.coerce.date({ invalid_type_error: "Start date must be a valid date" }).optional(),
                end_date: z.coerce.date({ invalid_type_error: "End date must be a valid date" }).optional(),
            })
        ).nonempty({ message: "Work identity must contain at least one item" }),
    });
}

export type RegisterInput = z.infer<typeof UserValidation.REGISTER>;
export type LoginInput = z.infer<typeof UserValidation.LOGIN>;
export type WorkIdentityInput = z.infer<typeof UserValidation.WORK_IDENTITY>;
