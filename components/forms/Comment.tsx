"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/post";
import { addCommentToPost } from "@/lib/actions/post.actions";

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ postId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToPost(
      postId,
      values.post,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='post'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <div className="relative overflow-hidden rounded-full"
                style={{ width: '48px', height: '48px' }}
                >
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  layout="fill"
                  objectFit="cover"
                  className='rounded-full'
                  draggable={false}
                />
                </div>
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;