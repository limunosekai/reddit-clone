import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import InputGroup from "../../components/InputGroup";

const SubCreate = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("/subs", {
        name,
        title,
        description,
      });

      router.push(`/r/${res.data.name}`);
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96 bg-white rounded p-4">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 생성</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 이름은 변경할 수 없습니다.
            </p>
            <InputGroup
              value={name}
              setValue={setName}
              error={errors.name}
              placeholder="커뮤니티 이름"
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 타이틀을 작성하세요.
            </p>
            <InputGroup
              value={title}
              setValue={setTitle}
              error={errors.title}
              placeholder="타이틀"
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 설명을 작성하세요.
            </p>
            <InputGroup
              value={description}
              setValue={setDescription}
              error={errors.description}
              placeholder="설명"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1 text-xs font-semibold rounded text-white bg-gray-400 border"
            >
              커뮤니티 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) {
      throw new Error("Missing auth token cookie");
    }

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/me`, {
      headers: { cookie },
    });

    return {
      props: {},
    };
  } catch (err) {
    res.writeHead(307, { Location: "/login" }).end();
    return {
      props: {},
    };
  }
};

export default SubCreate;
