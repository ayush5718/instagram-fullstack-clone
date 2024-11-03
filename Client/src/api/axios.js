import axios from "axios";

export default axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
