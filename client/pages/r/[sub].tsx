import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { type } from "os";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import SideBar from "../../components/SideBar";
import useAuthStore from "../../store/auth";
import { Sub } from "../../types";

const SubPage = () => {
  const router = useRouter();
  const subName = router?.query?.sub;
  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sub || !user) {
      return;
    }
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub, authenticated, user]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      return;
    }
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(`/subs/${sub?.name}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openFileInput = (flag: string) => {
    if (!ownSub) {
      return;
    }
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = flag;
      fileInput.click();
    }
  };

  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type="file"
              hidden
              accept="images/*"
              ref={fileInputRef}
              onChange={handleUpload}
            />
            <div className="bg-gray-400">
              {sub.bannerUrl ? (
                <div
                  className="h-56"
                  onClick={() => openFileInput("banner")}
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div
                  className="h-20 bg-gray-400"
                  onClick={() => openFileInput("banner")}
                ></div>
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="community"
                      width={70}
                      height={70}
                      className="rounded-full"
                      onClick={() => openFileInput("profile")}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-small font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12"></div>
            <SideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
