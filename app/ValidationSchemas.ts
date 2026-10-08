import {z} from 'zod';

export const issueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required').max(1000)
});

export const patchIssueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).optional(),
    description: z.string().min(1, 'Description is required').max(1000).optional(),
    assignedToUserId: z.string().min(1).max(255).optional().nullable()
});

export const registerSchema = z.object({
    name: z.string().max(255).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
