
import { useEffect, useState } from "react";
import "./Apple.css";

const STORAGE_KEY = "nivoTronicsProducts";
const WHATSAPP_NUMBER = "254717985243";

function getVariants(product) {
  // New format: each colour is linked to its own image.
  if (Array.isArray(product.colorImages) && product.colorImages.length) {
    return product.colorImages.map((variant) => ({
      color: variant.color,
      image: variant.image?.data || "",
    }));
  }

  // Older format: colour names and images were saved separately.
  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors.map((color, index) => ({
      color: typeof color === "string" ? color : color.name || "",
      image: product.images?.[index]?.data || product.images?.[0]?.data || "",
    })).filter((variant) => variant.color);
  }

  return [{
    color: "Default",
    image: product.images?.[0]?.data || "",
  }];
}

function Apple() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    function loadProducts() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const iPhones = Array.isArray(saved)
          ? saved.filter((product) =>
              product.name?.toLowerCase().includes("iphone")
            )
          : [];

        setProducts(iPhones);
      } catch (error) {
        console.error("Could not load products:", error);
        setProducts([]);
      }
    }

    loadProducts();
    window.addEventListener("storage", loadProducts);

    // Also refresh when the same tab changes products.
    window.addEventListener("nivoProductsUpdated", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("nivoProductsUpdated", loadProducts);
    };
  }, []);

  function chooseColor(productId, color) {
    setSelectedColors((current) => ({
      ...current,
      [productId]: color,
    }));
  }

  return (
    <main className="apple-page">
      <header className="apple-heading">
        <span className="eyebrow">ARMAN MOBITECH</span>
        <h1>Apple iPhones</h1>
        <p>Choose your iPhone model and explore its available colours.</p>
      </header>

      {products.length === 0 ? (
        <div className="apple-empty">
          <h2>No iPhones available</h2>
          <p>Please check back soon or contact us for availability.</p>
        </div>
      ) : (
        <section className="apple-product-grid" aria-label="Available iPhones">
          {products.map((product, index) => {
            const variants = getVariants(product);
            const selectedColor =
              selectedColors[product.id] || variants[0]?.color;
            const selectedVariant =
              variants.find((variant) => variant.color === selectedColor) ||
              variants[0];

            const price = Number(product.price);
            const stock = Number(product.stock);

            const message = `Hello Arman Mobitech, I am interested in the ${
              product.name
            }${product.storage ? ` (${product.storage})` : ""}${
              selectedVariant?.color && selectedVariant.color !== "Default"
                ? ` in ${selectedVariant.color}`
                : ""
            }. Please confirm availability and the price.`;

            return (
              <article
                className="apple-product-card"
                key={product.id ?? `${product.name}-${index}`}
              >
                <div className="apple-product-image">
                  {selectedVariant?.image ? (
                    <img
                      src={selectedVariant.image}
                      alt={`${product.name} ${selectedVariant.color}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="apple-no-image">
                      <span>Image unavailable</span>
                    </div>
                  )}
                </div>

                <div className="apple-product-details">
                  <h2>{product.name}</h2>

                  <p className="apple-storage">
                    Storage: {product.storage || "Contact us"}
                  </p>

                  <h3 className="apple-product-price">
                    {Number.isFinite(price)
                      ? `KSh ${price.toLocaleString("en-KE")}`
                      : "Contact us for price"}
                  </h3>

                  {variants.length > 0 && variants[0].color !== "Default" && (
                    <div className="apple-colour-section">
                      <p className="apple-colour-label">
                        Colour: <strong>{selectedVariant?.color}</strong>
                      </p>

                      <div className="apple-colour-options">
                        {variants.map((variant, variantIndex) => (
                          <button
                            type="button"
                            key={`${variant.color}-${variantIndex}`}
                            className={`apple-colour-option ${
                              selectedVariant?.color === variant.color
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              chooseColor(product.id, variant.color)
                            }
                            aria-pressed={selectedVariant?.color === variant.color}
                            title={variant.color}
                          >
                            {variant.image ? (
                              <img
                                src={variant.image}
                                alt=""
                                className="apple-colour-thumb"
                              />
                            ) : (
                              <span className="apple-colour-text">
                                {variant.color}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="apple-product-stock">
                    <strong>Availability:</strong>{" "}
                    {Number.isFinite(stock) && stock > 0
                      ? "In stock"
                      : "Contact us to confirm"}
                  </p>

                  <a
                    className="apple-product-button"
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
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
