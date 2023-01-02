import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../store/auth";

const useAuth = () => {
  const { handleLogin } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        handleLogin(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, []);
};

export default useAuth;
