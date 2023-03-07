import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import OrderStyle from "../styles/Order.module.css";

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className={OrderStyle.main}>
          <div className={OrderStyle.OrderInfo}>
            <div className={OrderStyle.Shipping}>
              <h2>Shipping Address</h2>
              <div className={OrderStyle.ShippingInfo}>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.phone},{" "}
                {shippingAddress.Sparephonenumber}
              </div>
              <div>
                <Link href="/Shipping">Edit</Link>
              </div>
            </div>
            <div className={OrderStyle.Payment}>
              <h2>Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className={OrderStyle.Order}>
              <h2>Order Items</h2>
              <div className={OrderStyle.Table}>
                <div className={OrderStyle.THead}>
                  <h4>Item</h4>
                  <h4>Quantity</h4>
                  <h4>Price</h4>
                  <h4>Subtotal</h4>
                </div>
                <div className={OrderStyle.TBody}>
                  {cartItems.map((item) => (
                    <div key={item._id}>
                      <p className={OrderStyle.P}>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </a>
                        </Link>
                        <p> {item.name}</p>
                      </p>
                      <p>{item.quantity}</p>
                      <p>{item.price} EGP</p>
                      <p>{item.quantity * item.price} EGP</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Link href="/Cart">Edit</Link>
              </div>
            </div>
          </div>
          <div className={OrderStyle.Summary}>
            <h2>Order Summary</h2>
            <ul className={OrderStyle.SummaryList}>
              <li>
                <div>
                  <div>
                    Items:
                    {itemsPrice} EGP
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <div>Tax: {taxPrice} EGP</div>
                </div>
              </li>
              <li>
                <div>
                  <div>Shipping : {shippingPrice} EGP</div>
                </div>
              </li>
              <li>
                <div>
                  <div>Total : {totalPrice} EGP</div>
                </div>
              </li>
              <li></li>
            </ul>

            <button disabled={loading} onClick={placeOrderHandler}>
              {loading ? "Loading..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
