
import { useEffect, useMemo, useState } from "react";
import "./Apple.css";

const STORAGE_KEY = "nivoTronicsProducts";
const WHATSAPP_NUMBER = "254717985243";

const COLOURS = [
  "Alpine Green",
  "Natural Titanium",
  "Desert Titanium",
  "Blue Titanium",
  "Black Titanium",
  "White Titanium",
  "Sierra Blue",
  "Midnight",
  "Starlight",
  "Graphite",
  "Purple",
  "Yellow",
  "Green",
  "White",
  "Black",
  "Blue",
  "Red",
  "Gold",
  "Silver",
  "Pink",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getColourHex(colour = "") {
  const name = colour.trim().toLowerCase();

  const colourMap = {
    "alpine green": "#657568",
    "natural titanium": "#B8B0A3",
    "desert titanium": "#C9B29C",
    "blue titanium": "#536477",
    "black titanium": "#353535",
    "white titanium": "#E5E4DF",
    "sierra blue": "#A7C4D6",
    midnight: "#252B36",
    starlight: "#F0E8D8",
    graphite: "#55565A",
    purple: "#B9A8D0",
    yellow: "#F6D84A",
    green: "#A8C5A5",
    white: "#F5F5F5",
    black: "#242424",
    blue: "#3478B8",
    red: "#C9363E",
    gold: "#D6BC82",
    silver: "#C8C9CC",
    pink: "#F0B8C7",
    orange: "#F28C28",
    "cosmic orange": "#E87536",
    "deep purple": "#55416B",
    "space black": "#343434",
    "space gray": "#777777",
    "space grey": "#777777",
    "rose gold": "#E7B7A7",
    "midnight green": "#344B43",
  };

  return colourMap[name] || "#D1D5DB";
}

function getModelName(name = "") {
  let model = name.trim();

  // Remove storage if it is included in the product name.
  model = model.replace(/\s+\d+\s?(GB|TB)$/i, "");

  // Remove a colour suffix if the product name includes one.
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
  // Preferred format: multiple colour variants in one product.
  if (
    Array.isArray(product.colorImages) &&
    product.colorImages.length
  ) {
    return product.colorImages
      .filter((variant) => variant.color)
      .map((variant) => ({
        color: variant.color.trim(),
        image: variant.image?.data || "",
      }));
  }

  // Support older product formats.
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
      .filter((variant) => variant.color);
  }

  // Support products whose colour is included in their name.
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
    if (!product.name?.toLowerCase().includes("iphone")) {
      return;
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

    // Use the first valid price for the grouped model.
    if (
      (!Number.isFinite(group.price) || group.price < 0) &&
      Number.isFinite(Number(product.price))
    ) {
      group.price = Number(product.price);
    }

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

function Apple() {
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
        console.error("Could not load products:", error);
        setProducts([]);
      }
    }

    loadProducts();

    window.addEventListener("storage", loadProducts);
    window.addEventListener(
      "nivoProductsUpdated",
      loadProducts
    );

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

        <h1>Apple iPhones</h1>

        <p>
          Choose your iPhone model and explore available colours.
        </p>
      </header>

      {models.length === 0 ? (
        <div className="apple-empty">
          <h2>No iPhones available</h2>

          <p>
            Please check back soon or contact us for availability.
          </p>
        </div>
      ) : (
        <section
          className="apple-product-grid"
          aria-label="Available iPhones"
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

                      <div
                        className="apple-colour-options"
                        aria-label="Choose phone colour"
                      >
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

export default Apple;
