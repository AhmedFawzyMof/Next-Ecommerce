import Link from "next/link";
import ProductStyle from "../styles/Product.module.css";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className={ProductStyle.Card}>
      <div className={ProductStyle.imgcont}>
        <Link href={`/product/${product.slug}`} legacyBehavior>
          <a>
            <img
              src={product.image}
              alt={product.name}
              className="rounded shadow"
            />
          </a>
        </Link>
      </div>
      <div className={ProductStyle.Slug}>
        <Link href={`/product/${product.slug}`} legacyBehavior>
          <a>
            <h3>{product.name}</h3>
          </a>
        </Link>
        <p className={ProductStyle.Price}>{product.price} EGP</p>
        <button
          className={ProductStyle.AddToCart}
          type="button"
          onClick={() => addToCartHandler(product)}
        >
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
  );
}
