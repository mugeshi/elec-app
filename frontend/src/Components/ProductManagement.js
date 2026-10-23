
import { useEffect, useState } from "react";
import "./ProductManagement.css";

const STORAGE_KEY = "nivoTronicsProducts";

const emptyForm = {
  name: "",
  storage: "",
  price: "",
  stock: "",
  colors: "",
  images: [],
};

function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
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

  async function handleImages(e) {
    const files = Array.from(e.target.files || []);
    setMessage("");

    if (form.images.length + files.length > 5) {
      setMessage("You can add up to 5 images per product.");
      e.target.value = "";
      return;
    }

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
      const newImages = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  name: file.name,
                  data: reader.result,
                });
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      setForm((current) => ({
        ...current,
        images: [...current.images, ...newImages].slice(0, 5),
      }));
    } catch {
      setMessage("Could not read the selected images.");
    }

    e.target.value = "";
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const product = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      storage: form.storage.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      colors: form.colors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean),
      images: form.images,
    };

    if (
      !product.name ||
      !product.storage ||
      form.price === "" ||
      form.stock === "" ||
      product.price < 0 ||
      product.stock < 0
    ) {
      setMessage("Please enter valid product details.");
      return;
    }

    const updatedProducts = editingId
      ? products.map((item) =>
          item.id === editingId ? product : item
        )
      : [...products, product];

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedProducts)
      );
      setProducts(updatedProducts);
      setForm(emptyForm);
      setEditingId(null);
      setMessage("Product saved successfully.");
    } catch {
      setMessage(
        "Could not save. Storage may be full; remove some images and try again."
      );
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      storage: product.storage || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      colors: (product.colors || []).join(", "),
      images: product.images || [],
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    setProducts(updatedProducts);

    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }

    setMessage("Product deleted.");
  }

  function downloadImage(image) {
    const link = document.createElement("a");
    link.href = image.data;
    link.download = image.name || "nivo-tronics-product";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="product-manager">
      <h1> Nivo Tronics — Product Manager </h1>
      <p>Add phones, storage options, colors, prices and images.</p>

      {message && (
        <p className="pm-message" role="status">
          {message}
        </p>
      )}

      <form className="pm-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <label htmlFor="product-name">Phone model</label>
        <input
          id="product-name"
          name="name"
          placeholder="e.g. iPhone 14 Pro"
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
          placeholder="e.g. 63000"
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
          placeholder="e.g. 2"
          value={form.stock}
          onChange={updateField}
          required
        />

        <label htmlFor="product-colors">
          Available colors (separate with commas)
        </label>
        <input
          id="product-colors"
          name="colors"
          placeholder="e.g. Blue, Black, White, Purple"
          value={form.colors}
          onChange={updateField}
        />

        <label htmlFor="product-images">
          Upload product images (up to 5, 500 KB each)
        </label>
        <input
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
        />

        {form.images.length > 0 && (
          <div className="pm-image-grid">
            {form.images.map((image, index) => (
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
                  onClick={() => removeImage(index)}
                >
                  Remove image
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pm-form-actions">
          <button type="submit">
            {editingId ? "Save Changes" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="pm-cancel"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setMessage("");
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="pm-products">
        <h2>Your Products ({products.length})</h2>

        {products.length === 0 && (
          <p>No products added yet.</p>
        )}

        {products.map((product) => (
          <article className="pm-product-card" key={product.id}>
            <div className="pm-product-info">
              <h3>{product.name}</h3>
              <p>Storage: {product.storage}</p>
              <p>Price: KSh {Number(product.price).toLocaleString()}</p>
              <p>Stock: {product.stock}</p>
              <p>
                Colors:{" "}
                {product.colors?.length
                  ? product.colors.join(", ")
                  : "Not specified"}
              </p>
            </div>

            <div className="pm-image-grid">
              {(product.images || []).map((image, index) => (
                <div
                  className="pm-image-item"
                  key={`${image.name}-${index}`}
                >
                  <img src={image.data} alt={`${product.name} ${image.name}`} />
                  <span>{image.name}</span>
                  <button
                    type="button"
                    onClick={() => downloadImage(image)}
                  >
                    Download image
                  </button>
                </div>
              ))}
            </div>

            <div className="pm-card-actions">
              <button
                type="button"
                onClick={() => editProduct(product)}
              >
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

