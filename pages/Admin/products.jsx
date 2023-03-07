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
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);
  return (
    <Layout title="Admin Products">
      <div className={AdminStyle.ADPAGE}>
        <div className={AdminStyle.Sidebar}>
          <ul>
            <li>
              <Link href="/Admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/Admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/Admin/products" legacyBehavior>
                <a className="font-bold">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/Admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className={AdminStyle.Products}>
          <h1>Admin Products</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className={AdminStyle.Product}>
              <div className={AdminStyle.Table}>
                <div className={AdminStyle.PTH}>
                  <p>ID</p>
                  <p>NAME</p>
                  <p>PRICE</p>
                  <p>CATEGORY</p>
                  <p>COUNT</p>
                  <p>ACTION</p>
                </div>

                <div className={AdminStyle.PTB}>
                  {products.map((product) => (
                    <div key={product._id} className={AdminStyle.PTT}>
                      <p>{product._id.substring(20, 24)}</p>
                      <p>{product.name}</p>
                      <p>{product.price} EGP</p>
                      <p>{product.category}</p>
                      <p>{product.countInStock}</p>
                      <p className={AdminStyle.AC}>
                        <Link href={`/Admin/product/${product._id}`}>Edit</Link>
                        <button>Delete</button>
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

AdminProdcutsScreen.auth = { adminOnly: true };
