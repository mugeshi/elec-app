
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

        const iphoneProducts = savedProducts.filter(
          (product) =>
            product.name?.toLowerCase().includes("iphone")
        );

        setProducts(iphoneProducts);
      } catch (error) {
        console.error("Could not load products:", error);
        setProducts([]);
      }
    }

    loadProducts();

    // Listen for changes made in other browser tabs.
    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  return (
    <main className="apple-page">
      {/* Page heading */}
      <header className="apple-heading">
        <span className="eyebrow">ARMAN MOBITECH</span>

        <h1>Apple iPhones</h1>

        <p>
          Explore our available iPhone models and find
          the right phone for you.
        </p>
      </header>

      {/* Product listing */}
      {products.length === 0 ? (
        <div className="apple-empty">
          <h2>No iPhones available</h2>
          <p>
            Our iPhone collection is currently unavailable.
            Please check back soon.
          </p>
        </div>
      ) : (
        <section
          className="apple-product-grid"
          aria-label="Available iPhones"
        >
          {products.map((product, index) => {
            const image = product.images?.[0]?.data;
            const price = Number(product.price);
            const stock = Number(product.stock);

            return (
              <article
                className="apple-product-card"
                key={product.id ?? `${product.name}-${index}`}
              >
                {/* Phone image */}
                <div className="apple-product-image">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="apple-no-image">
                      <span>No image available</span>
                    </div>
                  )}
                </div>

                {/* Phone information */}
                <div className="apple-product-details">
                  <h2>{product.name}</h2>

                  <p className="apple-storage">
                    Storage: {product.storage || "Contact us"}
                  </p>

                  <h3 className="apple-product-price">
                    KSh{" "}
                    {Number.isFinite(price)
                      ? price.toLocaleString("en-KE")
                      : "Contact us"}
                  </h3>

                  <p className="apple-product-colors">
                    <strong>Colours:</strong>{" "}
                    {product.colors?.length
                      ? product.colors.join(", ")
                      : "Contact us for available colours"}
                  </p>

                  <p className="apple-product-stock">
                    <strong>Availability:</strong>{" "}
                    {Number.isFinite(stock) && stock > 0
                      ? "In stock"
                      : "Contact us"}
                  </p>

                  {/* WhatsApp enquiry */}
                  <a
                    className="apple-product-button"
                    href={`https://wa.me/254717985243?text=${encodeURIComponent(
                      `Hello Arman Mobitech, I am interested in the ${product.name}${
                        product.storage ? ` (${product.storage})` : ""
                      }. Please confirm availability and the price.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enquire on WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Apple;
