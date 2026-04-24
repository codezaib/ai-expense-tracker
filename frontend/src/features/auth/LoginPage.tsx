import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, LogIn } from "lucide-react";
import { setCredentials } from "../../store/slices/authSlice";
import { useLoginMutation } from "../../store/api/authApi";
import { Button } from "../../components/common/Button";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import { PageLoader } from "../../App";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { user } = await login(data).unwrap();
      if (isLoading) return <PageLoader />;
      if (user) {
        dispatch(setCredentials(user));
        setTimeout(navigate, 1000, "/dashboard");
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.data?.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-app font-medium">
            Elevate your financial clarity with SpendWise AI.
          </p>
        </div>

        <div className="bg-surface border border-app rounded-3xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-end">
              <Link
                title="Forgot Password"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="text-white bg-brand box-border border cursor-pointer w-full hover:bg-brand-strong shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 "
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-muted-app mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              title="Create Account"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
