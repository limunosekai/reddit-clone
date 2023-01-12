import axios from "axios";
import Link from "next/link";
import useAuthStore from "../store/auth";
import { FaSearch } from "react-icons/fa";

const NavBar = () => {
  const { authenticated, handleLogout } = useAuthStore();

  const handleClickLogout = () => {
    axios
      .post("/auth/logout")
      .then(() => handleLogout())
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-14 px-5 bg-white">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">Community</Link>
      </span>
      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:bg-gray-700 hover:bg-white">
          <FaSearch className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Community"
            className="px-3 py-1 bg-transparent h-7 text-sm rounded focus:outline-none"
          />
        </div>
      </div>
      <div className="flex">
        {authenticated ? (
          <button
            type="button"
            onClick={handleClickLogout}
            className="w-20 px-2 mr-2 text-center h-7 text-sm text-white bg-gray-400 rounded"
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="w-20 px-2 pt-1 mr-2 text-center text-sm h-7 text-blue-500 border border-blue-500 rounded"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="w-20 px-2 pt-1 mr-2 text-center text-sm h-7 text-white border bg-gray-400 rounded"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
