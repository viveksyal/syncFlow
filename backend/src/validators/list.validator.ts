import {z} from "zod";

export const ListSchema = z.object({
        title: z.string().trim().min(1).max(100)
})

export const ListParamsSchema = z.object({
        listId: z.string().trim()
})

export const ListReorderSchema = z.object({
        previousListId: z.string().trim().nullable(),
        currebtListId: z.string().trim(),
        nextListId: z.string().trim().nullable()
})