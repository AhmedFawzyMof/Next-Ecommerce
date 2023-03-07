import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import PaymentStyle from "../styles/payment.module.css";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className={PaymentStyle.Form} onSubmit={submitHandler}>
        <h1>Payment Method</h1>
        {["CashOnDelivery"].map((payment) => (
          <div key={payment}>
            <input
              name="paymentMethod"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label htmlFor={payment}>{payment}</label>
            <input name="paymentMethod" id="aa" type="radio" disabled />
            <label htmlFor="aa">credit card coming soon</label>
          </div>
        ))}
        <div className={PaymentStyle.btns}>
          <button onClick={() => router.push("/Shipping")} type="button">
            <AiFillCaretLeft /> Back
          </button>
          <button>
            Next <AiFillCaretRight />
          </button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
