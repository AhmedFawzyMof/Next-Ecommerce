import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "../../utils/Store";
import { TfiBackLeft } from "react-icons/tfi";
import ScreenStyle from "../../styles/Screen.module.css";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import Product from "../../models/Product";
import db from "../../utils/db";
import axios from "axios";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/Cart");
  };
  return (
    <Layout title={product.name}>
      <div className={ScreenStyle.Screen}>
        <div className={ScreenStyle.BackBtn}>
          <Link href="/">
            <TfiBackLeft />
          </Link>
        </div>
        <div className={ScreenStyle.Main}>
          <div className={ScreenStyle.Image}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={ScreenStyle.Info}>
            <div className={ScreenStyle.ul}>
              <h1>{product.name}</h1>

              <p>Category: {product.category}</p>

              <p>Description: {product.description}</p>

              <p>Price : {product.price} EGP</p>

              <p>
                InStock :{" "}
                {product.countInStock > 0
                  ? product.countInStock + " _In stock"
                  : "Unavailable"}
              </p>
              <button
                className={ScreenStyle.AddToCart}
                onClick={addToCartHandler}
              >
                Add To Cart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <circle cx="10.5" cy="19.5" r="1.5"></circle>
                  <circle cx="17.5" cy="19.5" r="1.5"></circle>
                  <path d="m14 13.99 4-5h-3v-4h-2v4h-3l4 5z"></path>
                  <path d="M17.31 15h-6.64L6.18 4.23A2 2 0 0 0 4.33 3H2v2h2.33l4.75 11.38A1 1 0 0 0 10 17h8a1 1 0 0 0 .93-.64L21.76 9h-2.14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
