
import { useEffect, useState } from "react";
import "./Apple.css";

function Apple() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    function loadProducts() {
      try {
        const savedProducts = JSON.parse(
          localStorage.getItem("nivoTronicsProducts") || "[]"
        );

        setProducts(
          savedProducts.filter(
            (product) =>
              product.name?.toLowerCase().includes("iphone")
          )
        );
      } catch (error) {
        console.error("Could not load products:", error);
        setProducts([]);
      }
    }

    loadProducts();

    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  return (
    <main className="apple-page">
      <h1>Apple iPhones</h1>
      <p>Explore our available iPhone models.</p>

      {products.length === 0 ? (
        <p>No iPhones available at the moment. Check back soon.</p>
      ) : (
        <div className="apple-product-grid">
          {products.map((product) => (
            <article
              className="apple-product-card"
              key={product.id}
            >
              {product.images?.[0]?.data && (
                <img
                  src={product.images[0].data}
                  alt={product.name}
                />
              )}

              <h2>{product.name}</h2>
              <p>Storage: {product.storage}</p>
              <p>
                Price: KSh{" "}
                {Number(product.price).toLocaleString()}
              </p>
              <p>Available stock: {product.stock}</p>
              <p>
                Colors:{" "}
                {product.colors?.length
                  ? product.colors.join(", ")
                  : "Contact us for available colors"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Apple;
