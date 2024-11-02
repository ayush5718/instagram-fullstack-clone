import axios from "axios";

export default axios.create({
  baseURL: "https://instagram-clone-backend-rosy.vercel.app/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});
