import axios from "@/api/axios";
import { setSuggestedUsers } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get("/user/suggested", {
          withCredentials: true,
        });
        if (res?.data?.success) {
          dispatch(setSuggestedUsers(res?.data?.suggestedUsers));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUser();
  }, []);
};

export default useGetSuggestedUsers;
