import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/Layout";
import ProfileStyle from "../styles/profile.module.css";

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated successfully");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <div className={ProfileStyle.Main}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <h1>Update Profile</h1>

          <div className={ProfileStyle.Input}>
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
              <div className={ProfileStyle.error}>{errors.name.message}</div>
            )}
          </div>

          <div className={ProfileStyle.Input}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
            />
            {errors.email && (
              <div className={ProfileStyle.error}>{errors.email.message}</div>
            )}
          </div>

          <div className={ProfileStyle.Input}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "password is more than 5 chars",
                },
              })}
            />
            {errors.password && (
              <div className={ProfileStyle.error}>
                {errors.password.message}
              </div>
            )}
          </div>

          <div className={ProfileStyle.Input}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                validate: (value) => value === getValues("password"),
                minLength: {
                  value: 6,
                  message: "confirm password is more than 5 chars",
                },
              })}
            />
            {errors.confirmPassword && (
              <div className={ProfileStyle.error}>
                {errors.confirmPassword.message}
              </div>
            )}
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <div className={ProfileStyle.error}>Password do not match</div>
              )}
          </div>
          <div className={ProfileStyle.Input}>
            <button className="primary-button">Update Profile</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

ProfileScreen.auth = true;
