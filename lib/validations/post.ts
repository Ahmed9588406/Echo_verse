import * as z from 'zod'


export const PostValidation = z.object({
    post: z.string().min(3, {message: "MINIMUM 3 CHARACTERS"}),    
    accountId: z.string(),

})
export const CommentValidation = z.object({
    post: z.string().min(3, {message: "MINIMUM 3 CHARACTERS"}),
     
})