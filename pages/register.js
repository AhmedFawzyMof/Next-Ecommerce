import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import RegisterStyle from "../styles/Register.module.css";

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
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

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
    <Layout title="Register">
      <form
        className={RegisterStyle.Form}
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1>Create Account</h1>
        <div className={RegisterStyle.Input}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className={RegisterStyle.Error}>{errors.name.message}</div>
          )}
        </div>

        <div className={RegisterStyle.Input}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            id="email"
          ></input>
          {errors.email && (
            <div className={RegisterStyle.Error}>{errors.email.message}</div>
          )}
        </div>
        <div className={RegisterStyle.Input}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className={RegisterStyle.Error}>{errors.password.message}</div>
          )}
        </div>
        <div className={RegisterStyle.Input}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className={RegisterStyle.Error}>
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className={RegisterStyle.Error}>Password do not match</div>
            )}
        </div>

        <div className={RegisterStyle.Input}>
          <button className="primary-button">Register</button>
        </div>
        <div className={RegisterStyle.Link}>
          Have an account? &nbsp;
          <Link href={`/Login?redirect=${redirect || "/"}`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
}
