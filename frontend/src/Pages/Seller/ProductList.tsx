"use client";

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
  const [refreshing, setRefreshing] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Handle Refresh Logic
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } catch (error) {
      console.error("Failed to refresh products:", error);
    } finally {
      // Small delay so the animation feels smooth
      setTimeout(() => setRefreshing(false), 600);
    }
  };

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

        .pl-wrap  { font-family: 'Outfit', sans-serif; padding: 20px; }

        /* ─── Top bar ─── */
        .pl-topbar {
          display: flex; align-items: center;
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

        /* ─── Refresh Button ─── */
        .pl-refresh-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 9px;
          background: #fff; border: 1px solid #e0e0da;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
          color: #1a1a1a; cursor: pointer; transition: all 0.2s;
        }
        .pl-refresh-btn:hover { background: #fafaf8; border-color: #10b981; color: #10b981; }
        .pl-refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .spin {
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        .pl-stat-val.green { color: #10b981; }
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
        .pl-search:focus { border-color: #10b981; }

        .pl-select {
          font-family: 'Outfit', sans-serif; font-size: 13px;
          padding: 9px 12px; border-radius: 9px;
          border: 1px solid #e0e0da; background: #fff; color: #1a1a1a;
          outline: none; cursor: pointer; min-width: 130px;
        }
        .pl-select:focus { border-color: #10b981; }

        /* ─── Table ─── */
        .pl-table-wrap {
          background: #fff; border: 1px solid #e8e8e4;
          border-radius: 12px; overflow: hidden;
        }
        .pl-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .pl-th {
          padding: 10px 18px; text-align: left;
          font-size: 11px; font-family: 'DM Mono', monospace;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          color: #aaa; background: #fafaf8;
          border-bottom: 1px solid #e8e8e4;
        }
        .pl-tr { border-bottom: 1px solid #f0f0ec; transition: background 0.1s; }
        .pl-tr:hover { background: #fafaf8; }
        .pl-td { padding: 13px 18px; font-size: 13.5px; vertical-align: middle; }

        .pl-prod-cell { display: flex; align-items: center; gap: 12px; }
        .pl-thumb {
          width: 42px; height: 42px; border-radius: 8px;
          object-fit: cover; border: 1px solid #e8e8e4;
        }
        .pl-thumb-ph {
          width: 42px; height: 42px; border-radius: 8px;
          background: #f2f2ef; border: 1px solid #e8e8e4;
          display: flex; align-items: center; justify-content: center;
        }
        .pl-prod-name { font-weight: 500; color: #1a1a1a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pl-prod-desc { font-size: 11.5px; color: #aaa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        
        .pl-cat-badge {
          display: inline-block; font-size: 11.5px; color: #065f46;
          background: #ecfdf5; border: 1px solid #d1fae5;
          border-radius: 5px; padding: 3px 9px;
        }

        .pl-offer-price { font-family: 'DM Mono', monospace; font-weight: 500; color: #1a1a1a; }
        .pl-orig-price { font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb; text-decoration: line-through; }

        .pl-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .pl-action-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid #e0e0da; background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .pl-action-btn.edit:hover  { background: #ecfdf5; border-color: #10b981; }
        .pl-action-btn.trash:hover { background: #fef2f2; border-color: #fecaca; }

        .pl-result-count {
          font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb;
          padding: 9px 18px; background: #fafaf8; border-top: 1px solid #e8e8e4; text-align: right;
        }

        @media (max-width: 640px) {
          .pl-col-cat, .pl-col-price { display: none; }
          .pl-td, .pl-th { padding: 11px 12px; }
        }
      `}</style>

      <div className="pl-wrap">
        {/* Top bar */}
        <div className="pl-topbar">
          <div>
            <div className="pl-title">Products</div>
            <div className="pl-meta">{products.length} items total</div>
          </div>
          
          <button 
            className="pl-refresh-btn" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span className={refreshing ? 'spin' : ''}>↻</span>
            {refreshing ? 'Refreshing...' : 'Refresh List'}
          </button>
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
                <th className="pl-th" style={{ width: '20%' }}>Stock Status</th>
                <th className="pl-th" style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div style={{ padding: '52px 20px', textAlign: 'center', color: '#bbb' }}>
                      <div style={{ fontSize: '36px' }}>📦</div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>No products found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product: Product) => (
                  <tr className="pl-tr" key={product._id}>
                    <td className="pl-td">
                      <div className="pl-prod-cell">
                        {product.image?.[0] ? (
                          <img className="pl-thumb" src={product.image[0]} alt="" />
                        ) : (
                          <div className="pl-thumb-ph">📦</div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div className="pl-prod-name">{product.name}</div>
                          <div className="pl-prod-desc">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="pl-td pl-col-cat">
                      <span className="pl-cat-badge">{product.category || '—'}</span>
                    </td>
                    <td className="pl-td pl-col-price">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="pl-offer-price">{currency}{product.offerPrice.toLocaleString()}</span>
                        {product.price !== product.offerPrice && (
                          <span className="pl-orig-price">{currency}{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="pl-td">
                      <StockToggle
                        productId={product._id}
                        inStock={product.inStock}
                        onToggled={fetchProducts}
                        axios={axios}
                      />
                    </td>
                    <td className="pl-td">
                      <div className="pl-actions">
                        <button className="pl-action-btn edit" onClick={() => setEditProduct(product)}>✏️</button>
                        <button className="pl-action-btn trash" onClick={() => setDeleteProduct(product)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="pl-result-count">
              Showing {filtered.length} of {products.length} products
            </div>
          )}
        </div>
      </div>

      <EditProductModal
        product={editProduct}
        isOpen={editProduct !== null}
        onClose={() => setEditProduct(null)}
        onSuccess={fetchProducts}
        axios={axios}
        currency={currency}
      />

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