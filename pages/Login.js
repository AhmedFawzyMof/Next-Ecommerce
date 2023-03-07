import Layout from "../components/Layout";
import LoginStyle from "../styles/Login.module.css";
import Image from "next/image";
import logo from "../public/Logo.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const SubmitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <div className={LoginStyle.Main}>
        <form
          className={LoginStyle.Form}
          onSubmit={handleSubmit(SubmitHandler)}
        >
          <Image src={logo} alt="Hamasa" />
          <div className={LoginStyle.input}>
            <label htmlFor="email" className={LoginStyle.Email}>
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Please enter Email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
              id="email"
            ></input>
            {errors.email && (
              <div className={LoginStyle.errors}>{errors.email.message}</div>
            )}
          </div>
          <div className={LoginStyle.input}>
            <label htmlFor="password" className={LoginStyle.Password}>
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 6,
                  message: "password is more than 5 chars",
                },
              })}
              id="password"
            ></input>
            {errors.password && (
              <div className={LoginStyle.errors}>{errors.password.message}</div>
            )}
          </div>

          <button>Login</button>
          <div>
            Don&apos;t have an account? &nbsp;
            <Link href={`/register?redirect=${redirect || "/"}`}>Register</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
