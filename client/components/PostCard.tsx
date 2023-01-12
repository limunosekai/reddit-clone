import axios from "axios";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import useAuthStore from "../store/auth";
import { Post } from "../types";

type Props = {
  post: Post;
  mutate?: () => void;
};

const PostCard = ({ post, mutate }: Props) => {
  const router = useRouter();
  const {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  } = post;
  const { authenticated } = useAuthStore();
  const isSubPage = router.pathname === "/r/[sub]";

  const vote = async (value: number) => {
    if (!authenticated) {
      router.push("/login");
    }

    if (value === userVote) {
      value = 0;
    }

    try {
      await axios.post("/votes", {
        identifier,
        slug,
        value,
      });
      mutate?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      <div className="flex-shrink-0 w-10 py-2 text-center rounded">
        <button
          type="button"
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-red-500"
          onClick={() => vote(1)}
        >
          <FaArrowUp
            className={cn("mx-auto", {
              "text-red-500": userVote === 1,
            })}
          ></FaArrowUp>
        </button>
        <p className="text-xs font-bold">{voteScore}</p>
        <button
          type="button"
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <FaArrowDown
            className={cn("mx-auto", {
              "text-blue-500": userVote === -1,
            })}
          ></FaArrowDown>
        </button>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                {sub?.imageUrl && (
                  <Image
                    src={sub.imageUrl}
                    alt="sub"
                    className="rounded-full cursor-pointer"
                    width={12}
                    height={12}
                  />
                )}
              </Link>
              <Link
                href={`/r/${subName}`}
                className="ml-2 text-xs font-bold cursor-pointer hover:underline"
              >
                /r/{subName}
              </Link>
              <span className="mx-1 text-xs text-gray-400">•</span>
            </>
          )}
          <p className="text-xs text-gray-400">
            Posted By
            <Link href={`/u/${username}`} className="mx-1 hover:underline">
              {username}
            </Link>
            <Link href={url} className="mx-1 hover:underline">
              {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
            </Link>
          </p>
        </div>
        <Link href={url} className="my-1 text-lg font-medium">
          {title}
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
            <span className="font-bold text-xs">
              {commentCount ?? 0} Comments
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
