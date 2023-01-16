import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import PostCard from "../components/PostCard";
import useAuthStore from "../store/auth";
import { Post, Sub } from "../types";

const Home: NextPage = () => {
  const { authenticated } = useAuthStore();
  const address = "/subs/sub/topSubs";

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) {
      return null;
    }
    return `/posts?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
    isValidating,
    error,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  const { data: topSubs } = useSWR<Sub[]>(address);

  const [observedPost, setObservedPost] = useState("");

  useEffect(() => {
    if (!posts || posts.length === 0) {
      return;
    }

    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("마지막");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <>
      <Head>
        <title>Community</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex max-w-5xl px-4 pt-5 mx-auto">
        <div className="w-full md:mr-3 md:w-8/12">
          {isInitialLoading && (
            <p className="text-lg text-center">Loading...</p>
          )}
          {posts?.map((post) => (
            <PostCard key={post.identifier} post={post} mutate={mutate} />
          ))}
        </div>
        <div className="hidden w-4/12 ml-3 md:block">
          <div className="bg-white border rounded">
            <div className="p-4 border-b">
              <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
            </div>
            <div>
              {topSubs?.map((sub) => {
                return (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b"
                  >
                    <Link href={`/r/${sub.name}`}>
                      <Image
                        src={sub.imageUrl}
                        alt="community"
                        width={24}
                        height={24}
                        className="rounded-full cursor-pointer"
                      />
                    </Link>
                    <Link
                      href={`/r/${sub.name}`}
                      className="ml-2 font-bold hover:cursor-pointer"
                    >
                      /r/{sub.name}
                    </Link>
                    <p className="ml-auto font-md">{sub.postCount}</p>
                  </div>
                );
              })}
            </div>
            {authenticated && (
              <div className="w-full py-6 text-center">
                <Link
                  href="/subs/create"
                  className="w-full p-2 text-center text-white bg-gray-400 rounded"
                >
                  커뮤니티 생성
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
