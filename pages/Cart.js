import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { ImCancelCircle } from "react-icons/im";
import { BsCashStack } from "react-icons/bs";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import CartStyle from "../styles/Cart.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product updated in the cart");
  };
  return (
    <Layout title="Shopping Cart">
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <Link href="/" className={CartStyle.shop}>
            Go shopping
          </Link>
        </div>
      ) : (
        <div className={CartStyle.CartBody}>
          <div>
            <table className={CartStyle.table}>
              <thead className={CartStyle.thead}>
                <tr>
                  <th className={CartStyle.Item}>Item</th>
                  <th className={CartStyle.Quantity}>Quantity</th>
                  <th className={CartStyle.Price}>Price</th>
                  <th className={CartStyle.Action}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className={CartStyle.tbody}>
                    <td>
                      <Link href={`/product/${item.slug}`} legacyBehavior>
                        <a className={CartStyle.Img}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className={CartStyle.Quantity}>
                      {" "}
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={CartStyle.Price}>{item.price} EGP</td>
                    <td className={CartStyle.Action}>
                      <span onClick={() => removeItemHandler(item)}>
                        <ImCancelCircle className={CartStyle.CartBtn} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={CartStyle.SubCard}>
            <div>
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)})
              <p>
                {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} EGP
              </p>
            </div>
            <button
              onClick={() => router.push("Login?redirect=/Shipping")}
              className={CartStyle.Btn}
            >
              Check Out <BsCashStack />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
