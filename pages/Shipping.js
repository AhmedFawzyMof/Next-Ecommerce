import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import ShippingStyle from "../styles/shipping.module.css";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("phone", shippingAddress.phone);
    setValue("Sparephonenumber", shippingAddress.Sparephonenumber);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    fullName,
    address,
    city,
    phone,
    Sparephonenumber,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, phone, Sparephonenumber },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
          Sparephonenumber,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <div className={ShippingStyle.Main}>
        <form
          className={ShippingStyle.Form}
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className={ShippingStyle.Title}>Shipping Address</h1>
          <div className={ShippingStyle.InputF}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              autoFocus
              {...register("fullName", {
                required: "Please enter full name",
              })}
            />
            {errors.fullName && (
              <div className={ShippingStyle.Error}>
                {errors.fullName.message}
              </div>
            )}
          </div>
          <div className={ShippingStyle.InputF}>
            <label htmlFor="address">Address</label>
            <input
              id="address"
              {...register("address", {
                required: "Please enter address",
                minLength: {
                  value: 3,
                  message: "Address is more than 2 chars",
                },
              })}
            />
            {errors.address && (
              <div className={ShippingStyle.Error}>
                {errors.address.message}
              </div>
            )}
          </div>
          <div className={ShippingStyle.InputF}>
            <label htmlFor="city">City</label>
            <input
              id="city"
              {...register("city", {
                required: "Please enter city",
              })}
            />
            {errors.city && (
              <div className={ShippingStyle.Error}>{errors.city.message}</div>
            )}
          </div>
          <div className={ShippingStyle.InputF}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              {...register("phone", {
                required: "Please enter your phone number",
              })}
            />
            {errors.phone && (
              <div className={ShippingStyle.Error}>{errors.phone.message}</div>
            )}
          </div>
          <div className={ShippingStyle.InputF}>
            <label htmlFor="Sparephonenumber">Spare phone number</label>
            <input
              id="Sparephonenumber"
              {...register("Sparephonenumber", {
                required: "Please enter Sparephonenumber",
              })}
            />
            {errors.Sparephonenumber && (
              <div className={ShippingStyle.Error}>
                {errors.Sparephonenumber.message}
              </div>
            )}
          </div>
          <div>
            <button>Next</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

ShippingScreen.auth = true;
