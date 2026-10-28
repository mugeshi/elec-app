
import { useEffect, useState } from "react";
import "./ProductManagement.css";

const STORAGE_KEY = "nivoTronicsProducts";

const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "Google Pixel",
  "Nothing Phone",
  "OnePlus",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Huawei",
];

const emptyForm = {
  name: "",
  storage: "",
  price: "",
  stock: "",
  brands: ["Apple"],
  variants: [{ color: "", image: null }],
  legacyImages: [],
};

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ name: file.name, data: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function notifyProductsUpdated() {
  window.dispatchEvent(new Event("nivoProductsUpdated"));
}

function getProductBrands(product) {
  // Keep existing products working by inferring their brand from the name.
  if (Array.isArray(product.brands) && product.brands.length) {
    return product.brands;
  }

  const name = (product.name || "").toLowerCase();

  if (name.includes("samsung") || name.includes("galaxy")) {
    return ["Samsung"];
  }
  if (name.includes("pixel")) return ["Google Pixel"];
  if (name.includes("nothing")) return ["Nothing Phone"];
  if (name.includes("oneplus")) return ["OnePlus"];
  if (name.includes("xiaomi") || name.includes("redmi") || name.includes("poco")) {
    return ["Xiaomi"];
  }
  if (name.includes("oppo")) return ["Oppo"];
  if (name.includes("vivo")) return ["Vivo"];
  if (name.includes("huawei")) return ["Huawei"];
  if (name.toLowerCase().includes("iphone") || name.toLowerCase().includes("ipad")) {
    return ["Apple"];
  }

  return [];
}

function ProductManager() {
  const [products, setProducts] = useState(loadProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      setMessage(
        "Storage is full. Use smaller images or remove unused products."
      );
    }
  }, [products]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleBrand(brand) {
    setForm((current) => ({
      ...current,
      brands: current.brands.includes(brand)
        ? current.brands.filter((item) => item !== brand)
        : [...current.brands, brand],
    }));
  }

  function updateVariant(index, field, value) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [...current.variants, { color: "", image: null }],
    }));
  }

  function removeVariant(index) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index),
    }));
  }

  async function handleVariantImage(index, e) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 500 * 1024) {
      setMessage("Each image must be 500 KB or smaller.");
      return;
    }

    try {
      const image = await readImage(file);
      updateVariant(index, "image", image);
      setMessage("");
    } catch {
      setMessage("Could not read this image.");
    }
  }

  async function handleLegacyImages(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select image files only.");
        return false;
      }

      if (file.size > 500 * 1024) {
        setMessage("Each image must be 500 KB or smaller.");
        return false;
      }

      return true;
    });

    try {
      const images = await Promise.all(validFiles.map(readImage));

      setForm((current) => ({
        ...current,
        legacyImages: [...current.legacyImages, ...images],
      }));

      setMessage("");
    } catch {
      setMessage("Could not read the selected images.");
    }
  }

  function editProduct(product) {
    const savedVariants = Array.isArray(product.colorImages)
      ? product.colorImages.map((item) => ({
          color: item.color || "",
          image: item.image || null,
        }))
      : [];

    const variants = savedVariants.length
      ? savedVariants
      : Array.isArray(product.colors) && product.colors.length
        ? product.colors.map((color, index) => ({
            color:
              typeof color === "string" ? color : color.name || "",
            image: product.images?.[index] || null,
          }))
        : [{ color: "", image: null }];

    setEditingId(product.id);

    setForm({
      name: product.name || "",
      storage: product.storage || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      brands: getProductBrands(product),
      variants,
      legacyImages: product.images || [],
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      brands: ["Apple"],
      variants: [{ color: "", image: null }],
      legacyImages: [],
    });
    setMessage("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const storage = form.storage.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !name ||
      !storage ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      stock < 0
    ) {
      setMessage("Please enter valid product details.");
      return;
    }

    if (!form.brands.length) {
      setMessage("Please select at least one brand page.");
      return;
    }

    const colorImages = form.variants
      .filter((variant) => variant.color.trim())
      .map((variant) => ({
        color: variant.color.trim(),
        image: variant.image || null,
      }));

    if (
      form.variants.some(
        (variant) => variant.color.trim() && !variant.image
      )
    ) {
      setMessage("Please upload an image for every colour you add.");
      return;
    }

    const existingProduct = products.find(
      (item) => item.id === editingId
    );

    const product = {
      ...existingProduct,
      id: editingId ?? Date.now(),
      name,
      storage,
      price,
      stock,
      brands: [...form.brands],
      colors: colorImages.map((variant) => variant.color),
      colorImages,
      images: form.legacyImages,
    };

    const updatedProducts = editingId !== null
      ? products.map((item) =>
          item.id === editingId ? product : item
        )
      : [...products, product];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      notifyProductsUpdated();

      const wasEditing = editingId !== null;
      resetForm();

      setMessage(
        wasEditing
          ? "Product updated successfully."
          : "Product saved successfully."
      );
    } catch {
      setMessage(
        "Could not save. Storage may be full. Try smaller images."
      );
    }
  }

  function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      notifyProductsUpdated();

      if (editingId === id) resetForm();

      setMessage("Product deleted.");
    } catch {
      setMessage("Could not update product storage.");
    }
  }

  function downloadImage(image) {
    if (!image?.data) return;

    const link = document.createElement("a");
    link.href = image.data;
    link.download = image.name || "product-image";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="product-manager">
      <h1>Nivo Tronics — Product Manager</h1>

      <p>
        Add a product and choose which brand pages should display it.
      </p>

      {message && (
        <p className="pm-message" role="status">
          {message}
        </p>
      )}

      <form className="pm-form" onSubmit={handleSubmit}>
        <h2>{editingId !== null ? "Edit Product" : "Add New Product"}</h2>

        <label htmlFor="product-name">Product name</label>
        <input
          id="product-name"
          name="name"
          placeholder="e.g. iPhone 11 or Galaxy S24 Ultra"
          value={form.name}
          onChange={updateField}
          required
        />

        <label htmlFor="product-storage">Storage capacity</label>
        <input
          id="product-storage"
          name="storage"
          placeholder="e.g. 128GB"
          value={form.storage}
          onChange={updateField}
          required
        />

        <label htmlFor="product-price">Price (KSh)</label>
        <input
          id="product-price"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={updateField}
          required
        />

        <label htmlFor="product-stock">Stock quantity</label>
        <input
          id="product-stock"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={updateField}
          required
        />

        <section className="pm-brand-selection">
          <h3>Display product in</h3>
          <p>Select every brand page where this product should appear.</p>

          <div className="pm-brand-grid">
            {BRAND_OPTIONS.map((brand) => (
              <label className="pm-brand-option" key={brand}>
                <input
                  type="checkbox"
                  checked={form.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>

          <p className="pm-brand-help">
            Selected: {form.brands.length
              ? form.brands.join(", ")
              : "No brand selected"}
          </p>
        </section>

        <h3>Colour options and images</h3>
        <p>Add each available colour and upload its matching phone image.</p>

        {form.variants.map((variant, index) => (
          <div className="pm-variant-row" key={index}>
            <label htmlFor={`variant-color-${index}`}>
              Colour {index + 1}
            </label>

            <input
              id={`variant-color-${index}`}
              value={variant.color}
              placeholder="e.g. Black"
              onChange={(e) =>
                updateVariant(index, "color", e.target.value)
              }
            />

            <label htmlFor={`variant-image-${index}`}>
              Image for {variant.color || `colour ${index + 1}`}
            </label>

            <input
              id={`variant-image-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleVariantImage(index, e)}
            />

            {variant.image?.data && (
              <div className="pm-image-item">
                <img src={variant.image.data} alt={variant.color || "Product colour"} />
                <span>{variant.image.name}</span>
                <button
                  type="button"
                  onClick={() => downloadImage(variant.image)}
                >
                  Download
                </button>
              </div>
            )}

            {form.variants.length > 1 && (
              <button
                type="button"
                className="pm-remove"
                onClick={() => removeVariant(index)}
              >
                Remove colour
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addVariant}>
          + Add Another Colour
        </button>

        <details className="pm-legacy-images">
          <summary>Optional: General product images (older products)</summary>
          <p>Use this for extra images not assigned to a specific colour.</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLegacyImages}
          />

          {form.legacyImages.map((image, index) => (
            <div className="pm-image-item" key={`${image.name}-${index}`}>
              <img src={image.data} alt={image.name} />
              <span>{image.name}</span>

              <button
                type="button"
                onClick={() => downloadImage(image)}
              >
                Download
              </button>

              <button
                type="button"
                className="pm-remove"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    legacyImages: current.legacyImages.filter(
                      (_, i) => i !== index
                    ),
                  }))
                }
              >
                Remove image
              </button>
            </div>
          ))}
        </details>

        <div className="pm-form-actions">
          <button type="submit">
            {editingId !== null ? "Save Changes" : "Add Product"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="pm-cancel"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="pm-products">
        <h2>Your Products ({products.length})</h2>

        {products.length === 0 && <p>No products added yet.</p>}

        {products.map((product) => (
          <article className="pm-product-card" key={product.id}>
            <div className="pm-product-info">
              <h3>{product.name}</h3>
              <p>Storage: {product.storage}</p>
              <p>
                Price: KSh {Number(product.price).toLocaleString("en-KE")}
              </p>
              <p>Stock: {product.stock}</p>
              <p>
                Display pages: {getProductBrands(product).join(", ") || "Not assigned"}
              </p>
              <p>
                Colours: {(product.colors || [])
                  .map((color) =>
                    typeof color === "string" ? color : color.name
                  )
                  .filter(Boolean)
                  .join(", ") || "Not specified"}
              </p>
            </div>

            <div className="pm-image-grid">
              {(product.colorImages || []).map((variant, index) => (
                <div
                  className="pm-image-item"
                  key={`${variant.color}-${index}`}
                >
                  {variant.image?.data && (
                    <img src={variant.image.data} alt={variant.color} />
                  )}
                  <span>{variant.color}</span>
                </div>
              ))}

              {(product.images || []).map((image, index) => (
                <div
                  className="pm-image-item"
                  key={`${image.name}-${index}`}
                >
                  <img src={image.data} alt={image.name} />
                  <span>{image.name}</span>
                </div>
              ))}
            </div>

            <div className="pm-card-actions">
              <button type="button" onClick={() => editProduct(product)}>
                Edit
              </button>
              <button
                type="button"
                className="pm-delete"
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default ProductManager;
