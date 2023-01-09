import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import { SWRConfig } from "swr";
import Head from "next/head";

const AUTH_ROUTES = ["/register", "/login"];

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
    throw err?.response?.data;
  }
};

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  axios.defaults.withCredentials = true;
  useAuth();
  const { pathname } = useRouter();
  const authRoute = AUTH_ROUTES.includes(pathname);

  return (
    <>
      <Head>
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
          integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {!authRoute && <NavBar />}
        <div className={authRoute ? "" : "pt-16"}>
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </>
  );
}
