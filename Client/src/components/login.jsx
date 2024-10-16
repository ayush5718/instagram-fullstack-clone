import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "@/api/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeEventHandler = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log(formData);

      // Showing a loading toast message while the request is being made

      const promise = axios.post("/user/login", formData, {
        withCredentials: true, // Send cookies with the request
      });

      // Using toast.promise to handle different states of the request
      toast.promise(promise, {
        loading: "Loading... ",

        success: (response) => {
          if (response?.data?.success) {
            dispath(setAuthUser(response?.data?.user));
            navigate("/");
          }
          return `${response?.data?.message || "Login successful!"}`;
        },

        error: (error) =>
          `${error?.response?.data?.message || "Login failed!"}`,
      });

      // Reset the form data
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      // Error is already handled by toast.promise, but you can log it for debugging
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div>
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center my-2">
            Login to see photos and videos from your friends.
          </p>
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent "
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent "
          />
        </div>

        {loading ? (
          <Button
            type="submit"
            className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
          >
            Login
          </Button>
        )}
        <span className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
