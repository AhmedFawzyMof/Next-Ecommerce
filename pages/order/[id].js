import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import OrderScreenStyle from "../../styles/orderscreen.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
}
function OrderScreen() {
  const { data: session } = useSession();

  const { query } = useRouter();
  const orderId = query.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice / 30 },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is Paid SuccessFully");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is Delivered");
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  }

  async function payOrderHandler() {
    try {
      dispatch({ type: "PAY_REQUEST" });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`);
      dispatch({ type: "PAY_SUCCESS", payload: data });
      toast.success("Order is Paid SuccessFully");
    } catch (err) {
      dispatch({ type: "PAY_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  }

  //
  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className={OrderScreenStyle.title}>{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={OrderScreenStyle.Alert_Erorr}>{error}</div>
      ) : (
        <div className={OrderScreenStyle.Main}>
          <div className={OrderScreenStyle.Info}>
            <div className={OrderScreenStyle.ShippingCard}>
              <h2>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.phone},{" "}
                {shippingAddress.Sparephonenumber}
              </div>
              {isDelivered ? (
                <div className={OrderScreenStyle.Alert_Success}>
                  Delivered at {deliveredAt.substring(0, 10)}
                </div>
              ) : (
                <div className={OrderScreenStyle.Alert_Erorr}>
                  Not delivered
                </div>
              )}
            </div>

            <div className={OrderScreenStyle.ShippingCard}>
              <h2>Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className={OrderScreenStyle.Alert_Success}>
                  Paid at {paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className={OrderScreenStyle.Alert_Erorr}>Not Paid</div>
              )}
            </div>

            <div className={OrderScreenStyle.ShippingCard}>
              <h2>Order Items</h2>
              <div className={OrderScreenStyle.Table}>
                <div className={OrderScreenStyle.THead}>
                  <p>Item</p>
                  <p>Quantity</p>
                  <p>Price</p>
                  <p>Subtotal</p>
                </div>
                <div className={OrderScreenStyle.TBody}>
                  {orderItems.map((item) => (
                    <div key={item.id} className={OrderScreenStyle.TT}>
                      <p className={OrderScreenStyle.P1}>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a>
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
                      </p>
                      <p>{item.quantity}</p>
                      <p>{item.price} EGP</p>
                      <p>{item.quantity * item.price} EGP</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={OrderScreenStyle.Info}>
            <div className={OrderScreenStyle.SummaryCard}>
              <h2>Order Summary</h2>
              <div>
                <div>Items : {itemsPrice} EGP</div>
              </div>
              <div>
                <div>Tax : {taxPrice} EGP</div>
              </div>
              <div>
                <div>Shipping : {shippingPrice} EGP</div>
              </div>
              <div>
                <div>Total :{totalPrice} EGP</div>
              </div>
              <div>
                {!isPaid && (
                  <div>
                    {isPending ? (
                      <h3>Loading...</h3>
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </div>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <div className={OrderScreenStyle.OP}>
                    {loadingDeliver && <div>Loading...</div>}
                    <button onClick={deliverOrderHandler}>Deliver Order</button>
                  </div>
                )}
                {session.user.isAdmin && !order.isPaid && (
                  <div className={OrderScreenStyle.OP}>
                    {loadingDeliver && <div>Loading...</div>}
                    <button onClick={payOrderHandler}>Pay</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
