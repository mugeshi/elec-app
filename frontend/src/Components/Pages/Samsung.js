
import { useEffect, useMemo, useState } from "react";
import "./Apple.css";

const STORAGE_KEY = "nivoTronicsProducts";
const WHATSAPP_NUMBER = "254717985243";

const COLOURS = [
  "Phantom Black",
  "Phantom Silver",
  "Phantom White",
  "Phantom Violet",
  "Phantom Green",
  "Burgundy",
  "Graphite",
  "Cream",
  "Sky Blue",
  "Lavender",
  "Green",
  "Black",
  "Gray",
  "Grey",
  "Silver",
  "White",
  "Gold",
  "Pink",
  "Blue",
  "Purple",
  "Red",
  "Mint",
  "Lime",
  "Navy",
  "Titanium Gray",
  "Titanium Black",
  "Titanium Violet",
  "Titanium Yellow",
  "Titanium Blue",
  "Titanium Green",
  "Titanium Orange",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getColourHex(colour = "") {
  const name = colour.trim().toLowerCase();

  const colourMap = {
    "phantom black": "#252525",
    "phantom silver": "#C9C9C9",
    "phantom white": "#F4F4F4",
    "phantom violet": "#A9A0C2",
    "phantom green": "#627B70",
    burgundy: "#642A3B",
    graphite: "#55565A",
    cream: "#F0E4CF",
    "sky blue": "#A9D0E8",
    lavender: "#C8B9DF",
    green: "#6F8B70",
    black: "#242424",
    gray: "#8C8C8C",
    grey: "#8C8C8C",
    silver: "#C8C9CC",
    white: "#F5F5F5",
    gold: "#D6BC82",
    pink: "#EAB8C8",
    blue: "#3478B8",
    purple: "#8D79B7",
    red: "#C9363E",
    mint: "#B7D9CB",
    lime: "#C5D76A",
    navy: "#283C5A",
    "titanium gray": "#8C8C88",
    "titanium black": "#343434",
    "titanium violet": "#82788E",
    "titanium yellow": "#DCCB91",
    "titanium blue": "#657C91",
    "titanium green": "#61796B",
    "titanium orange": "#D88755",
  };

  return colourMap[name] || "#D1D5DB";
}

function getModelName(name = "") {
  let model = name.trim();

  model = model.replace(/\s+\d+\s?(GB|TB)$/i, "");

  for (const colour of [...COLOURS].sort(
    (a, b) => b.length - a.length
  )) {
    model = model.replace(
      new RegExp(`\\s+${escapeRegex(colour)}$`, "i"),
      ""
    );
  }

  return model.trim();
}

function getVariants(product) {
  if (
    Array.isArray(product.colorImages) &&
    product.colorImages.length
  ) {
    return product.colorImages
      .filter((item) => item.color)
      .map((item) => ({
        color: item.color.trim(),
        image: item.image?.data || "",
      }));
  }

  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors
      .map((color, index) => ({
        color:
          typeof color === "string"
            ? color
            : color.name || "",
        image:
          product.images?.[index]?.data ||
          product.images?.[0]?.data ||
          "",
      }))
      .filter((item) => item.color);
  }

  const trailingColour = COLOURS.find((colour) =>
    new RegExp(
      `\\s+${escapeRegex(colour)}$`,
      "i"
    ).test(product.name || "")
  );

  return [
    {
      color: trailingColour || "Default",
      image:
        product.images?.[0]?.data ||
        product.image?.data ||
        "",
    },
  ];
}

function groupProducts(products) {
  const groups = new Map();

  products.forEach((product) => {
    if (!product.name?.toLowerCase().includes("samsung")) {
      // Also accept model names such as Galaxy S23 Ultra or Galaxy A15.
      if (!/\bgalaxy\b/i.test(product.name || "")) return;
    }

    const modelName = getModelName(product.name);
    const storage = String(product.storage || "Contact us");
    const key =
      `${modelName.toLowerCase()}-${storage.toLowerCase()}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: modelName,
        storage,
        price: Number(product.price),
        stock: 0,
        variants: [],
      });
    }

    const group = groups.get(key);

    group.stock += Math.max(
      0,
      Number(product.stock) || 0
    );

    getVariants(product).forEach((variant) => {
      const existing = group.variants.find(
        (item) =>
          item.color.toLowerCase() ===
          variant.color.toLowerCase()
      );

      if (!existing) {
        group.variants.push(variant);
      } else if (!existing.image && variant.image) {
        existing.image = variant.image;
      }
    });
  });

  return Array.from(groups.values());
}

function Samsung() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    function loadProducts() {
      try {
        const saved = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        setProducts(Array.isArray(saved) ? saved : []);
      } catch (error) {
        console.error("Could not load Samsung products:", error);
        setProducts([]);
      }
    }

    loadProducts();

    window.addEventListener("storage", loadProducts);
    window.addEventListener("nivoProductsUpdated", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener(
        "nivoProductsUpdated",
        loadProducts
      );
    };
  }, []);

  const models = useMemo(
    () => groupProducts(products),
    [products]
  );

  function chooseColor(key, color) {
    setSelectedColors((current) => ({
      ...current,
      [key]: color,
    }));
  }

  return (
    <main className="apple-page">
      <header className="apple-heading">
        <span className="eyebrow">NIVO TRONICS</span>

        <h1>Samsung Smartphones</h1>

        <p>
          Explore Samsung Galaxy phones and choose your preferred colour.
        </p>
      </header>

      {models.length === 0 ? (
        <div className="apple-empty">
          <h2>No Samsung phones available</h2>

          <p>
            Please check back soon or contact us for availability.
          </p>
        </div>
      ) : (
        <section
          className="apple-product-grid"
          aria-label="Available Samsung phones"
        >
          {models.map((product) => {
            const selectedColor =
              selectedColors[product.key] ||
              product.variants[0]?.color;

            const variant =
              product.variants.find(
                (item) => item.color === selectedColor
              ) || product.variants[0];

            const priceIsValid =
              Number.isFinite(product.price) &&
              product.price >= 0;

            const message =
              `Hello Nivo Tronics, I am interested in the ${product.name}` +
              ` (${product.storage})` +
              (variant?.color && variant.color !== "Default"
                ? ` in ${variant.color}`
                : "") +
              ". Please confirm availability and the price.";

            return (
              <article
                className="apple-product-card"
                key={product.key}
              >
                <div className="apple-product-image">
                  {variant?.image ? (
                    <img
                      src={variant.image}
                      alt={`${product.name} in ${variant.color}`}
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
                    Storage:{" "}
                    {/^\d+$/.test(product.storage)
                      ? `${product.storage}GB`
                      : product.storage}
                  </p>

                  <h3 className="apple-product-price">
                    {priceIsValid
                      ? `KSh ${product.price.toLocaleString("en-KE")}`
                      : "Contact us for price"}
                  </h3>

                  {product.variants.some(
                    (item) => item.color !== "Default"
                  ) && (
                    <div className="apple-colour-section">
                      <p className="apple-colour-label">
                        Colour:{" "}
                        <strong>
                          {variant?.color || "Choose a colour"}
                        </strong>
                      </p>

                      <div className="apple-colour-options">
                        {product.variants.map((item, index) => (
                          <button
                            type="button"
                            key={`${item.color}-${index}`}
                            className={`apple-colour-option ${
                              variant?.color === item.color
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              chooseColor(
                                product.key,
                                item.color
                              )
                            }
                            aria-pressed={
                              variant?.color === item.color
                            }
                            title={item.color}
                            aria-label={`Select ${item.color}`}
                          >
                            <span
                              className="apple-colour-swatch"
                              style={{
                                backgroundColor: getColourHex(
                                  item.color
                                ),
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="apple-product-stock">
                    <strong>Availability:</strong>{" "}
                    {product.stock > 0
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

export default Samsung;
