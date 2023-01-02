import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/NavBar";

const AUTH_ROUTES = ["/register", "/login"];

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  axios.defaults.withCredentials = true;
  useAuth();
  const { pathname } = useRouter();
  const authRoute = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {!authRoute && <NavBar />}
      <div className={authRoute ? "" : "pt-12"}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
