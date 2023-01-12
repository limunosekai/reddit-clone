import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Comment, Post } from "../../types";

const UserPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data, error } = useSWR(username ? `/users/${username}` : null);

  if (!data) {
    return null;
  }

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        {data?.userData?.map((u: any) => {
          if (u.type === "Post") {
            const post: Post = u;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = u;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded"
              >
                <div className="flex-shrink-0 w-10 py-10 text-center bg-white border-r rounded-l">
                  <i className="text-gray-500 fas fa-comment-alt fa-xs" />
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    <Link
                      href={`/u/${comment.username}`}
                      className="cursor-pointer hover:underline"
                    >
                      {comment.username}
                    </Link>
                    &nbsp;
                    <span>Commented On</span>&nbsp;
                    <Link
                      href={`/u${comment.post?.url}`}
                      className="cursor-pointer font-semibold hover:underline"
                    >
                      {comment.post?.title}
                    </Link>
                    &nbsp;
                    <span>•</span>
                    <Link
                      href={`/u/${comment.post?.subName}`}
                      className="cursor-pointer text-black hover:underline"
                    >
                      /r/{comment.post?.subName}
                    </Link>
                  </p>
                  <hr />
                  <p className="p-1">{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-gray-400 rounded-t">
          <Image
            src="https://www.gravatar.com/avatar/0000?d=mp&f=y"
            alt="user"
            className="border-none rounded-full"
            width={40}
            height={40}
          />
          <p className="pl-2 text-md text-white">{data.user.username}</p>
        </div>
        <div className="p-2 bg-white rounded-b">
          <p>{dayjs(data.user.createdAt).format("YYYY-MM-DD")} 가입</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
