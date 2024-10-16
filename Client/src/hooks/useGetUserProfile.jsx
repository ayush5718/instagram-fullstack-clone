import axios from "@/api/axios";
import { setUserProfile } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  // get user profile
  useEffect(() => {
    const fetchUserprofile = async () => {
      try {
        const res = await axios.get(`/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          dispatch(setUserProfile(res?.data?.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserprofile();
  }, [userId]);
};

export default useGetUserProfile;
