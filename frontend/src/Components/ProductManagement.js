
import { useEffect, useState } from "react";
import "./ProductManagement.css";

function ProductManagement() {
  const [products, setProducts] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("nivoTronicsProducts")
      ) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    storage: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "nivoTronicsProducts",
      JSON.stringify(products)
    );
  }, [products]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({ name: "", storage: "", price: "", stock: "" });
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const product = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...product, id: editingId }
            : item
        )
      );
    } else {
      setProducts((current) => [
        ...current,
        { ...product, id: Date.now() },
      ]);
    }

    resetForm();
  }

  function editProduct(product) {
    setForm({
      name: product.name,
      storage: product.storage,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditingId(product.id);
  }

  function deleteProduct(id) {
    if (window.confirm("Delete this product?")) {
      setProducts((current) =>
        current.filter((item) => item.id !== id)
      );
      if (editingId === id) resetForm();
    }
  }

  return (
    <main className="product-manager">
      <h1>Nivo Tronics — Products</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Phone name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="storage"
          placeholder="Storage e.g. 128GB"
          value={form.storage}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          min="0"
          placeholder="Price (KSh)"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Quantity"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId !== null ? "Save Changes" : "Add Product"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>Products ({products.length})</h2>

      {products.map((product) => (
        <article key={product.id} className="managed-product">
          <h3>{product.name}</h3>
          <p>Storage: {product.storage}</p>
          <p>Price: KSh {product.price.toLocaleString("en-KE")}</p>
          <p>Stock: {product.stock}</p>

          <button onClick={() => editProduct(product)}>
            Edit
          </button>

          <button onClick={() => deleteProduct(product.id)}>
            Delete
          </button>
        </article>
      ))}
    </main>
  );
}

export default ProductManagement;
