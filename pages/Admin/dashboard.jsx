import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import AdminStyle from "../../styles/Admin.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };
  return (
    <Layout title="Admin Dashboard">
      <div className={AdminStyle.ADPAGE}>
        <div className={AdminStyle.Sidebar}>
          <ul>
            <li>
              <Link href="/Admin/dashboard" legacyBehavior>
                <a className="font-bold">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/Admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/Admin/products">Products</Link>
            </li>
            <li>
              <Link href="/Admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className={AdminStyle.Dashbord}>
          <h1>Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className={AdminStyle.Dash}>
              <div className={AdminStyle.Bord}>
                <div className={AdminStyle.BI}>
                  <p>{summary.ordersPrice} EGP</p>
                  <p>Sales</p>
                  <Link href="/Admin/orders">View sales</Link>
                </div>
                <div className={AdminStyle.BI}>
                  <p>Orders</p>
                  <p>{summary.ordersCount} </p>
                  <Link href="/Admin/orders">View orders</Link>
                </div>
                <div className={AdminStyle.BI}>
                  <p>Products</p>
                  <p>{summary.productsCount} </p>
                  <Link href="/Admin/products">View products</Link>
                </div>
                <div className={AdminStyle.BI}>
                  <p>Users</p>
                  <p>{summary.usersCount} </p>
                  <Link href="/Admin/users">View users</Link>
                </div>
              </div>
              <h2>Sales Report</h2>
              <div className={AdminStyle.Bar}>
                <Bar
                  options={{
                    legend: { display: true, position: "right" },
                  }}
                  data={data}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
