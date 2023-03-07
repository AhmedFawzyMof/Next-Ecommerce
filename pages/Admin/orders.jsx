import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import AdminStyle from "../../styles/Admin.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className={AdminStyle.ADPAGE}>
        <div className={AdminStyle.Sidebar}>
          <ul>
            <li>
              <Link href="/Admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/Admin/orders" legacyBehavior>
                <a className="font-bold">Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/Admin/products">Products</Link>
            </li>
            <li>
              <Link href="/Admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className={AdminStyle.Order}>
          <h1>Admin Orders</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className={AdminStyle.Table}>
                <div className={AdminStyle.TH}>
                  <p>ID</p>
                  <p>USER</p>
                  <p>DATE</p>
                  <p>TOTAL</p>
                  <p>PAID</p>
                  <p>DELIVERED</p>
                  <p>ACTION</p>
                </div>
                <div className={AdminStyle.TB}>
                  {orders.map((order) => (
                    <div className={AdminStyle.TT}>
                      <p>{order._id.substring(20, 24)}</p>
                      <p>{order.user ? order.user.name : "DELETED USER"}</p>
                      <p>{order.createdAt.substring(0, 10)}</p>
                      <p>{order.totalPrice} EGP</p>
                      <p>
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : "Not Paid"}
                      </p>
                      <p>
                        {order.isDelivered
                          ? `${order.deliveredAt.substring(0, 10)}`
                          : "Not Delivered"}
                      </p>
                      <p>
                        <Link
                          href={`/order/${order._id}`}
                          passHref
                          legacyBehavior
                        >
                          <a>Details</a>
                        </Link>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };
