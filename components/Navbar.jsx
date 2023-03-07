import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import { AiOutlineLogin } from "react-icons/ai";
import NavStyle from "../styles/Navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const [active, setActive] = useState(false);

  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/Login" });
  };

  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      <nav className={NavStyle.Navbar}>
        <div className={NavStyle.Logo}>
          <Link href="/">E-Store</Link>
        </div>
        <div className={NavStyle.Right}>
          <div className={NavStyle.Cart}>
            <Link href="/Cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z" />
                <circle cx="10.5" cy="19.5" r="1.5" />
                <circle cx="16.5" cy="19.5" r="1.5" />
              </svg>
              {cartItemsCount > 0 && (
                <div className={NavStyle.Count}>{cartItemsCount}</div>
              )}
            </Link>
          </div>
          <div className={NavStyle.Login}>
            {status === "loading" ? (
              "Loading"
            ) : session?.user ? (
              <div className={NavStyle.NameACart}>
                <span
                  className={active ? NavStyle.activeName : NavStyle.Name}
                  onClick={() => setActive(!active)}
                >
                  {session.user.name.substring([], 2)}
                </span>
                <ul
                  className={
                    active ? NavStyle.activedrowpdown : NavStyle.drowpdown
                  }
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/order-history"> Order History</Link>
                  </li>
                  <li>
                    <Link href="#" onClick={logoutClickHandler}>
                      Logout
                    </Link>
                  </li>
                  {session.user.isAdmin && (
                    <li>
                      <Link href="/Admin/dashboard">Admin Dashboard</Link>
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <Link href="/Login" legacyBehavior>
                <a>
                  <AiOutlineLogin />
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

//
// <div className={NavStyle.Menubar}>
//<AiOutlineMenuFold />
//</div>
