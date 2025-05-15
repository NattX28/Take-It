import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(8).max(20),
  rememberMe: z.boolean().optional(),
})

export const signupSchema = z
  .object({
    username: z.string().min(4).max(20),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .min(8)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    }
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
