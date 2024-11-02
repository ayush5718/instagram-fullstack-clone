import axios from "axios";

export default axios.create({
  baseURL: "https://instagram-fullstack-clone-backend.vercel.app/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});
