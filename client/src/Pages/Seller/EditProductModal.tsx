// EditProductModal.tsx

import React, { useEffect, useState, useRef } from "react";

interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  offerPrice: number;
  image?: string[];
  inStock: boolean;
  quantity?: number;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  axios: any;
  currency: string;
}

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Home",
  "Books",
  "Sports",
  "Beauty",
  "Toys",
];

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  offerPrice: "",
  image: "",
  inStock: true,
  quantity: "",
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
  axios,
  currency,
}) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        name: String(product.name || ""),
        description: String(product.description || ""),
        category: String(product.category || ""),
        price: String(product.price ?? ""),
        offerPrice: String(product.offerPrice ?? ""),
        image: product.image?.[0] || "",
        inStock: product.inStock,
        quantity: String(product.quantity ?? ""),
      });
      setErrors({});
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = "Enter a valid price";
    if (
      form.offerPrice &&
      (isNaN(Number(form.offerPrice)) || Number(form.offerPrice) > Number(form.price))
    )
      errs.offerPrice = "Offer price must be ≤ original price";
    if (
      form.quantity &&
      (isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
    )
      errs.quantity = "Quantity must be 0 or more";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // 👇 Send product data as JSON string
    const payload = {
      name: String(form.name || "").trim(),
      description: String(form.description || "").trim(),
      category: String(form.category || ""),
      price: Number(form.price),
      offerPrice: Number(form.offerPrice || form.price),
      inStock: Boolean(form.inStock),
      quantity: Number(form.quantity || 0),
    };
    formData.append("productData", JSON.stringify(payload));

    // 👇 If you selected a new file, upload it
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.append("images", file); // must match multer field name
    }

    try {
      const { data } = await axios.put(
        `/api/product/update/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setErrors({ general: data.message });
      }
    } catch (err: any) {
      setErrors({
        general:
          err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

      .epm-backdrop {
        position: fixed; inset: 0; z-index: 50;
        background: rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        animation: epm-fadein 0.18s ease;
      }

      @keyframes epm-fadein { from { opacity: 0 } to { opacity: 1 } }
      @keyframes epm-slidein { from { opacity:0; transform:translateY(14px) scale(0.98) } to { opacity:1; transform:none } }

      .epm-modal {
        background: #fff;
        border-radius: 16px;
        width: 100%; max-width: 520px;
        border: 1px solid #e5e5e0;
        box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        animation: epm-slidein 0.2s ease;
        font-family: 'Outfit', sans-serif;
        overflow: hidden;
      }

      .epm-header {
        padding: 20px 24px 0;
        display: flex; align-items: flex-start; justify-content: space-between;
      }

      .epm-title {
        font-size: 17px; font-weight: 600;
        color: #111; letter-spacing: -0.02em;
      }

      .epm-subtitle {
        font-size: 12px; color: #aaa; margin-top: 2px;
        font-family: 'DM Mono', monospace;
      }

      .epm-close {
        width: 30px; height: 30px; border-radius: 8px;
        border: 1px solid #e5e5e0; background: transparent;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        color: #888; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
      }
      .epm-close:hover { background: #f5f5f3; color: #111; }

      .epm-body { padding: 18px 24px 20px; }

      .epm-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

      .epm-field { margin-bottom: 14px; }

      .epm-label {
        display: block; font-size: 11px; font-weight: 500;
        font-family: 'DM Mono', monospace;
        letter-spacing: 0.08em; text-transform: uppercase;
        color: #888; margin-bottom: 5px;
      }

      .epm-input {
        width: 100%; font-family: 'Outfit', sans-serif; font-size: 13.5px;
        padding: 9px 12px; border-radius: 9px;
        border: 1px solid #e0e0da; background: #fff; color: #111;
        outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        appearance: none;
      }
      .epm-input:focus { border-color: #1a1a1a; box-shadow: 0 0 0 3px rgba(0,0,0,0.07); }
      .epm-input.error { border-color: #fca5a5; }
      .epm-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

      textarea.epm-input { resize: vertical; min-height: 70px; }

      .epm-err { font-size: 11.5px; color: #ef4444; margin-top: 4px; }

      .epm-general-err {
        background: #fef2f2; border: 1px solid #fecaca;
        border-radius: 8px; padding: 10px 14px;
        font-size: 13px; color: #dc2626; margin-bottom: 14px;
      }

      .epm-divider {
        height: 1px; background: #f0f0ec;
        margin: 16px 0;
      }

      .epm-toggle-row {
        display: flex; align-items: center; justify-content: space-between;
        background: #fafaf8; border: 1px solid #e8e8e4;
        border-radius: 9px; padding: 11px 14px;
      }

      .epm-toggle-info { display: flex; flex-direction: column; gap: 2px; }
      .epm-toggle-name { font-size: 13.5px; font-weight: 500; color: #1a1a1a; }
      .epm-toggle-desc { font-size: 11.5px; color: #aaa; }

      .epm-toggle-track {
        position: relative; width: 40px; height: 22px; flex-shrink: 0;
      }
      .epm-toggle-track input { opacity: 0; width: 0; height: 0; position: absolute; }
      .epm-toggle-bg {
        position: absolute; inset: 0; border-radius: 22px;
        background: #d9d9d3; transition: background 0.2s; cursor: pointer;
      }
      .epm-toggle-track input:checked ~ .epm-toggle-bg { background: #1a1a1a; }
      .epm-toggle-knob {
        position: absolute; top: 4px; left: 4px;
        width: 14px; height: 14px; border-radius: 50%;
        background: #fff; transition: transform 0.2s;
        pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      }
      .epm-toggle-track input:checked ~ .epm-toggle-bg .epm-toggle-knob {
        transform: translateX(18px);
      }

      .epm-footer {
        padding: 0 24px 20px;
        display: flex; align-items: center; justify-content: space-between;
      }

      .epm-product-id {
        font-family: 'DM Mono', monospace;
        font-size: 10.5px; color: #bbb; letter-spacing: 0.05em;
      }

      .epm-actions { display: flex; gap: 8px; }

      .epm-btn {
        font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
        padding: 9px 20px; border-radius: 9px;
        border: none; cursor: pointer; transition: all 0.15s;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .epm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .epm-btn-cancel {
        background: transparent; border: 1px solid #e0e0da; color: #555;
      }
      .epm-btn-cancel:hover:not(:disabled) { background: #f5f5f3; }
      .epm-btn-save {
        background: #1a1a1a; color: #fff;
      }
      .epm-btn-save:hover:not(:disabled) { background: #333; }
      .epm-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        animation: epm-spin 0.7s linear infinite;
      }
      @keyframes epm-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className="epm-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="epm-modal">
          {/* Header */}
          <div className="epm-header">
            <div>
              <div className="epm-title">Edit Product</div>
              <div className="epm-subtitle">{product.name}</div>
            </div>
            <button className="epm-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="epm-body">
            {errors.general && (
              <div className="epm-general-err">{errors.general}</div>
            )}

            {/* Name */}
            <div className="epm-field">
              <label className="epm-label">Product Name</label>
              <input
                className={`epm-input ${errors.name ? "error" : ""}`}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
              />
              {errors.name && <div className="epm-err">{errors.name}</div>}
            </div>

            {/* Description */}
            <div className="epm-field">
              <label className="epm-label">Description</label>
              <textarea
                className="epm-input"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief product description..."
              />
            </div>

            {/* Category + Quantity */}
            <div className="epm-row2">
              <div className="epm-field">
                <label className="epm-label">Category</label>
                <select
                  className={`epm-input ${errors.category ? "error" : ""}`}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="epm-err">{errors.category}</div>
                )}
              </div>
              <div className="epm-field">
                <label className="epm-label">Quantity</label>
                <input
                  className={`epm-input ${errors.quantity ? "error" : ""}`}
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                {errors.quantity && (
                  <div className="epm-err">{errors.quantity}</div>
                )}
              </div>
            </div>

            {/* Price + Offer Price */}
            <div className="epm-row2">
              <div className="epm-field">
                <label className="epm-label">Price ({currency})</label>
                <input
                  className={`epm-input ${errors.price ? "error" : ""}`}
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  placeholder="0.00"
                />
                {errors.price && <div className="epm-err">{errors.price}</div>}
              </div>
              <div className="epm-field">
                <label className="epm-label">Offer Price ({currency})</label>
                <input
                  className={`epm-input ${errors.offerPrice ? "error" : ""}`}
                  type="number"
                  name="offerPrice"
                  value={form.offerPrice}
                  onChange={handleChange}
                  min="0"
                  placeholder="Optional"
                />
                {errors.offerPrice && (
                  <div className="epm-err">{errors.offerPrice}</div>
                )}
              </div>
            </div>

            {/* Image file upload (optional, for new image) */}
            <div className="epm-field">
              <label className="epm-label">Upload new image</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="epm-input"
              />
            </div>

            {/* Image URL display (read‑only in this flow) */}
            <div className="epm-field">
              <label className="epm-label">Current Image URL</label>
              <input
                className="epm-input"
                value={form.image || ""}
                disabled
              />
            </div>

            <div className="epm-divider" />

            {/* In Stock Toggle */}
            <div className="epm-toggle-row">
              <div className="epm-toggle-info">
                <span className="epm-toggle-name">Stock availability</span>
                <span className="epm-toggle-desc">
                  {form.inStock
                    ? "Currently in stock"
                    : "Currently out of stock"}
                </span>
              </div>
              <label className="epm-toggle-track">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                />
                <div className="epm-toggle-bg">
                  <div className="epm-toggle-knob" />
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="epm-footer">
            <span className="epm-product-id">ID: {product._id}</span>
            <div className="epm-actions">
              <button className="epm-btn epm-btn-cancel" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="epm-btn epm-btn-save" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="epm-spinner" /> : null}
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditProductModal;