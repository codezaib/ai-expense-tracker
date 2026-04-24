import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { setCredentials } from "../../store/slices/authSlice";
import { useRegisterMutation } from "../../store/api/authApi";
import { Button } from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { PageLoader } from "../../App";

const schema = yup
  .object({
    name: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[^a-zA-Z0-9]/, "Must contain one special character")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch("password", "");

  const getPasswordStrength = () => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "bg-danger" };
    if (strength === 3) return { label: "Medium", color: "bg-warning" };
    return { label: "Strong", color: "bg-success" };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data: any) => {
    try {
      const { user } = await registerUser(data).unwrap();
      if (isLoading) return <PageLoader />;
      if (user) {
        dispatch(setCredentials(user));
        setTimeout(navigate, 1000, "/dashboard");
        toast.success("Account created successfully!");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-muted-app font-medium">
            Join thousands tracking smarter with SpendWise AI.
          </p>
        </div>

        <div className="bg-surface border border-app rounded-3xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register("password")}
              />
              {strength && (
                <div className="px-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-app">
                      Strength: {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${strength.color}`}
                      style={{
                        width: `${(password.length / 12) * 100}%`,
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <button
              type="submit"
              className="text-white bg-brand box-border border cursor-pointer w-full hover:bg-brand-strong shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 "
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-sm text-muted-app mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              title="Login"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
