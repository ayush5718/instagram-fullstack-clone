import axios from "@/api/axios";
import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.chat);
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `/message/allmessage/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(setMessages(res?.data?.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
