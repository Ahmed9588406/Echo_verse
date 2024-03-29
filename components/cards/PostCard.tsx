import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeletePost from "../forms/DeletePost";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}
// Function to replace URLs in content with Next.js Link components
const renderContentWithLinks = (content: string): React.ReactNode[] => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(regex);
  return parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <Link legacyBehavior key={index} href={part} passHref>
          <a target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        </Link>
      );
    }
    return part;
  });
};


function PostCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
    className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
  }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
                draggable={false}
              />
            </Link>

            <div className='post-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{renderContentWithLinks(content)}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                {/*
                <Image
                  src='/assets/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  draggable={false}
                />
                */}
                <Link href={`/post/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                    draggable={false}
                  />
                </Link>
                <Link href='/create-post'>
                <Image
                  src='/assets/repost.svg'
                  alt='repost'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  draggable={false}
                />
                </Link>
                {/*
                <Image
                  src='/assets/share.svg'
                  alt='share'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  draggable={false}
                />
              */}
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/post/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeletePost
          postId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => (
            <div
            key={index}
            className={`relative overflow-hidden rounded-full ${index !== 0 ? "-ml-5" : ""}`}
            style={{ width: '24px', height: '24px' }}
          >
            <Image
              src={comment.author.image}
              alt={`user_${index}`}
              layout='fill'
              objectFit='cover'
              className='rounded-full'
            />
          </div>
          ))}

          <Link href={`/post/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
            draggable={false}
          />
        </Link>
      )}
    </article>
  );
}

export default PostCard;