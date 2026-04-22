import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import StockToggle from './StockToggle';

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

const ProductList: React.FC = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Derived: unique categories from live data
  const categories = Array.from(
    new Set(products.map((p: Product) => p.category).filter(Boolean))
  );

  // Filtered list
  const filtered = products.filter((p: Product) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    const matchStock =
      stockFilter === ''
        ? true
        : stockFilter === 'in'
        ? p.inStock
        : !p.inStock;
    return matchSearch && matchCat && matchStock;
  });

  const inStockCount = products.filter((p: Product) => p.inStock).length;
  const outOfStockCount = products.length - inStockCount;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .pl-wrap  { font-family: 'Outfit', sans-serif; }

        /* ─── Top bar ─── */
        .pl-topbar {
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap;
          gap: 12px; margin-bottom: 20px;
        }
        .pl-title {
          font-size: 19px; font-weight: 600;
          color: #1a1a1a; letter-spacing: -0.02em;
        }
        .pl-meta {
          font-size: 12px; color: #aaa; margin-top: 3px;
          font-family: 'DM Mono', monospace;
        }

        /* ─── Stat chips ─── */
        .pl-stats {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px;
        }
        .pl-stat {
          display: flex; align-items: center; gap: 7px;
          background: #fafaf8; border: 1px solid #e8e8e4;
          border-radius: 8px; padding: 8px 14px;
          font-size: 13px; color: #555;
        }
        .pl-stat-val {
          font-family: 'DM Mono', monospace;
          font-size: 13px; font-weight: 500; color: #1a1a1a;
        }
        .pl-stat-val.green { color: #16a34a; }
        .pl-stat-val.red   { color: #dc2626; }

        /* ─── Toolbar ─── */
        .pl-toolbar {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .pl-search-wrap {
          flex: 1; min-width: 180px; position: relative;
        }
        .pl-search-icon {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%);
          color: #bbb; font-size: 14px; pointer-events: none;
        }
        .pl-search {
          width: 100%; font-family: 'Outfit', sans-serif; font-size: 13px;
          padding: 9px 12px 9px 34px; border-radius: 9px;
          border: 1px solid #e0e0da; background: #fff; color: #1a1a1a;
          outline: none; transition: border-color 0.15s;
        }
        .pl-search:focus { border-color: #1a1a1a; }

        .pl-select {
          font-family: 'Outfit', sans-serif; font-size: 13px;
          padding: 9px 12px; border-radius: 9px;
          border: 1px solid #e0e0da; background: #fff; color: #1a1a1a;
          outline: none; cursor: pointer; appearance: none;
          min-width: 130px;
        }
        .pl-select:focus { border-color: #1a1a1a; }

        /* ─── Table ─── */
        .pl-table-wrap {
          background: #fff; border: 1px solid #e8e8e4;
          border-radius: 12px; overflow: hidden;
        }
        .pl-table {
          width: 100%; border-collapse: collapse; table-layout: fixed;
        }
        .pl-th {
          padding: 10px 18px; text-align: left;
          font-size: 11px; font-family: 'DM Mono', monospace;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          color: #aaa; background: #fafaf8;
          border-bottom: 1px solid #e8e8e4; white-space: nowrap;
        }
        .pl-tr {
          border-bottom: 1px solid #f0f0ec; transition: background 0.1s;
        }
        .pl-tr:last-child { border-bottom: none; }
        .pl-tr:hover { background: #fafaf8; }
        .pl-td { padding: 13px 18px; font-size: 13.5px; vertical-align: middle; }

        /* Product cell */
        .pl-prod-cell { display: flex; align-items: center; gap: 12px; }
        .pl-thumb {
          width: 42px; height: 42px; border-radius: 8px;
          object-fit: cover; flex-shrink: 0;
          border: 1px solid #e8e8e4;
        }
        .pl-thumb-ph {
          width: 42px; height: 42px; border-radius: 8px;
          background: #f2f2ef; border: 1px solid #e8e8e4;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .pl-prod-name {
          font-size: 13.5px; font-weight: 500; color: #1a1a1a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 200px;
        }
        .pl-prod-desc {
          font-size: 11.5px; color: #aaa; margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 200px;
        }

        /* Badges */
        .pl-cat-badge {
          display: inline-block; font-size: 11.5px; color: #666;
          background: #f2f2ef; border: 1px solid #e8e8e4;
          border-radius: 5px; padding: 3px 9px;
        }

        /* Price */
        .pl-price-wrap { display: flex; flex-direction: column; gap: 1px; }
        .pl-offer-price {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px; font-weight: 500; color: #1a1a1a;
        }
        .pl-orig-price {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #bbb; text-decoration: line-through;
        }

        /* Action buttons */
        .pl-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .pl-action-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid #e0e0da; background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 14px; transition: all 0.15s;
        }
        .pl-action-btn.edit:hover  { background: #eff6ff; border-color: #bfdbfe; }
        .pl-action-btn.trash:hover { background: #fef2f2; border-color: #fecaca; }

        /* Empty state */
        .pl-empty {
          padding: 52px 20px; text-align: center; color: #bbb;
        }
        .pl-empty-icon { font-size: 36px; margin-bottom: 10px; }
        .pl-empty-title { font-size: 14px; font-weight: 500; color: #aaa; margin-bottom: 4px; }
        .pl-empty-sub   { font-size: 13px; color: #ccc; }

        /* Result count */
        .pl-result-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #bbb; letter-spacing: 0.06em;
          padding: 9px 18px;
          background: #fafaf8;
          border-top: 1px solid #e8e8e4;
          text-align: right;
        }

        @media (max-width: 640px) {
          .pl-col-cat, .pl-col-price { display: none; }
          .pl-prod-name { max-width: 130px; }
          .pl-td { padding: 11px 12px; }
          .pl-th { padding: 9px 12px; }
        }
      `}</style>

      <div className="pl-wrap">

        {/* Top bar */}
        <div className="pl-topbar">
          <div>
            <div className="pl-title">Products</div>
            <div className="pl-meta">{products.length} items total</div>
          </div>
        </div>

        {/* Stats */}
        <div className="pl-stats">
          <div className="pl-stat">
            <span>Total</span>
            <span className="pl-stat-val">{products.length}</span>
          </div>
          <div className="pl-stat">
            <span>In Stock</span>
            <span className="pl-stat-val green">{inStockCount}</span>
          </div>
          <div className="pl-stat">
            <span>Out of Stock</span>
            <span className="pl-stat-val red">{outOfStockCount}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pl-toolbar">
          <div className="pl-search-wrap">
            <span className="pl-search-icon">🔍</span>
            <input
              className="pl-search"
              type="text"
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="pl-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c: any) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="pl-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="pl-table-wrap">
          <table className="pl-table">
            <thead>
              <tr>
                <th className="pl-th" style={{ width: '38%' }}>Product</th>
                <th className="pl-th pl-col-cat" style={{ width: '16%' }}>Category</th>
                <th className="pl-th pl-col-price" style={{ width: '14%' }}>Price</th>
                <th className="pl-th" style={{ width: '20%' }}>Stock</th>
                <th className="pl-th" style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="pl-empty">
                      <div className="pl-empty-icon">📦</div>
                      <div className="pl-empty-title">No products found</div>
                      <div className="pl-empty-sub">Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product: Product) => (
                  <tr className="pl-tr" key={product._id}>

                    {/* Product */}
                    <td className="pl-td">
                      <div className="pl-prod-cell">
                        {product.image?.[0] ? (
                          <img
                            className="pl-thumb"
                            src={product.image[0]}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="pl-thumb-ph">📦</div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div className="pl-prod-name" title={product.name}>
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="pl-prod-desc">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="pl-td pl-col-cat">
                      <span className="pl-cat-badge">{product.category || '—'}</span>
                    </td>

                    {/* Price */}
                    <td className="pl-td pl-col-price">
                      <div className="pl-price-wrap">
                        <span className="pl-offer-price">
                          {currency}{product.offerPrice.toLocaleString()}
                        </span>
                        {product.price !== product.offerPrice && (
                          <span className="pl-orig-price">
                            {currency}{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="pl-td">
                      <StockToggle
                        productId={product._id}
                        inStock={product.inStock}
                        onToggled={fetchProducts}
                        axios={axios}
                      />
                    </td>

                    {/* Actions */}
                    <td className="pl-td">
                      <div className="pl-actions">
                        <button
                          className="pl-action-btn edit"
                          title="Edit product"
                          onClick={() => setEditProduct(product)}
                        >
                          ✏️
                        </button>
                        <button
                          className="pl-action-btn trash"
                          title="Delete product"
                          onClick={() => setDeleteProduct(product)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filtered.length > 0 && (
            <div className="pl-result-count">
              {filtered.length} of {products.length} products
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditProductModal
        product={editProduct}
        isOpen={editProduct !== null}
        onClose={() => setEditProduct(null)}
        onSuccess={fetchProducts}
        axios={axios}
        currency={currency}
      />

      {/* Delete Modal */}
      <DeleteProductModal
        product={deleteProduct}
        isOpen={deleteProduct !== null}
        onClose={() => setDeleteProduct(null)}
        onSuccess={fetchProducts}
        axios={axios}
        currency={currency}
      />
    </>
  );
};

export default ProductList;