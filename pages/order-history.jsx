import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import HistoryStyle from "../styles/Orderhistory.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function OrderHistoryScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <h1>Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className={HistoryStyle.Main}>
          <div className={HistoryStyle.Table}>
            <div className={HistoryStyle.TH}>
              <p>Id</p>
              <p>date</p>
              <p>total</p>
              <p>paid</p>
              <p>delivered</p>
              <p>action</p>
            </div>
            <div className={HistoryStyle.TB}>
              {orders.map((order) => (
                <div className={HistoryStyle.TT} key={order._id}>
                  <p>{order._id.substring(20, 24)}</p>
                  <p>{order.createdAt.substring(5, 10)}</p>
                  <p>{order.totalPrice} EGP</p>
                  <p>
                    {order.isPaid ? `${order.paidAt.substring(0, 10)}` : "No"}
                  </p>
                  <p>
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : "No"}
                  </p>
                  <p>
                    <Link href={`/order/${order._id}`} passHref legacyBehavior>
                      <a>Details</a>
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
