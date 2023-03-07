import Head from "next/head";
import React from "react";
import Navbar from "./Navbar";
import LayoutStyle from "../styles/Layout.module.css";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title : "Hamasacommerce"}</title>
        <meta name="description" content="WebStore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={LayoutStyle.Main}>{children}</main>
      <footer>footer</footer>
    </>
  );
}
