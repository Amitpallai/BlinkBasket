import React, { useState } from 'react';
import {toast} from 'sonner';

interface Product {
  _id: string;
  name: string;
  category?: string;
  offerPrice: number;
  image?: string[];
}

interface DeleteProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  axios: any;
  currency: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
  axios,
  currency,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/product/delete/${product._id}`);
      if (data.success) {
        toast.success(data.message || 'Product deleted');
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .dpm-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: dpm-in 0.18s ease;
        }
        @keyframes dpm-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dpm-up { from { opacity:0; transform:translateY(12px) scale(0.97) } to { opacity:1; transform:none } }

        .dpm-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%; max-width: 380px;
          border: 1px solid #e5e5e0;
          box-shadow: 0 24px 64px rgba(0,0,0,0.14);
          animation: dpm-up 0.2s ease;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }

        .dpm-top {
          padding: 28px 24px 0;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
        }

        .dpm-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: #fef2f2; border: 1px solid #fecaca;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 14px;
        }

        .dpm-title {
          font-size: 17px; font-weight: 600; color: #111;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }

        .dpm-desc {
          font-size: 13.5px; color: #777; line-height: 1.5; max-width: 290px;
        }

        .dpm-product-preview {
          display: flex; align-items: center; gap: 12px;
          background: #fafaf8; border: 1px solid #e8e8e4;
          border-radius: 10px; padding: 12px 14px;
          margin: 18px 24px 0; text-align: left;
        }

        .dpm-thumb {
          width: 42px; height: 42px; border-radius: 8px;
          object-fit: cover; flex-shrink: 0;
          border: 1px solid #e8e8e4;
        }

        .dpm-thumb-placeholder {
          width: 42px; height: 42px; border-radius: 8px;
          background: #f0f0ec; border: 1px solid #e8e8e4;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }

        .dpm-prod-name {
          font-size: 13.5px; font-weight: 500; color: #111;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 220px;
        }

        .dpm-prod-meta {
          display: flex; gap: 8px; margin-top: 3px; align-items: center;
        }

        .dpm-prod-cat {
          font-size: 11.5px; color: #aaa;
        }

        .dpm-prod-price {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #1a1a1a; font-weight: 500;
        }

        .dpm-warning {
          display: flex; align-items: center; gap: 8px;
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 9px; padding: 10px 14px;
          margin: 12px 24px 0;
          font-size: 12.5px; color: #92400e; line-height: 1.4;
        }

        .dpm-warning-icon { font-size: 14px; flex-shrink: 0; }

        .dpm-footer {
          padding: 20px 24px;
          display: flex; gap: 10px;
        }

        .dpm-btn {
          flex: 1; font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 500;
          padding: 11px; border-radius: 10px;
          border: none; cursor: pointer;
          transition: all 0.15s;
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        }
        .dpm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .dpm-btn-cancel {
          background: transparent; border: 1px solid #e0e0da; color: #555;
        }
        .dpm-btn-cancel:hover:not(:disabled) { background: #f5f5f3; }

        .dpm-btn-delete {
          background: #dc2626; color: #fff;
        }
        .dpm-btn-delete:hover:not(:disabled) { background: #b91c1c; }

        .dpm-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: dpm-spin 0.7s linear infinite;
        }
        @keyframes dpm-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className="dpm-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="dpm-modal">

          <div className="dpm-top">
            <div className="dpm-icon-wrap">🗑</div>
            <div className="dpm-title">Delete product?</div>
            <div className="dpm-desc">
              This will permanently remove the product from your catalogue.
            </div>
          </div>

          {/* Product preview */}
          <div className="dpm-product-preview">
            {product.image?.[0] ? (
              <img className="dpm-thumb" src={product.image[0]} alt={product.name} />
            ) : (
              <div className="dpm-thumb-placeholder">📦</div>
            )}
            <div style={{ minWidth: 0 }}>
              <div className="dpm-prod-name">{product.name}</div>
              <div className="dpm-prod-meta">
                {product.category && <span className="dpm-prod-cat">{product.category}</span>}
                <span className="dpm-prod-price">{currency}{product.offerPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="dpm-warning">
            <span className="dpm-warning-icon">⚠️</span>
            This action cannot be undone. All associated data will be lost.
          </div>

          <div className="dpm-footer">
            <button className="dpm-btn dpm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="dpm-btn dpm-btn-delete" onClick={handleDelete} disabled={loading}>
              {loading ? <span className="dpm-spinner" /> : null}
              {loading ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default DeleteProductModal;