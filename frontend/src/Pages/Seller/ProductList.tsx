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
    <div className="p-5 font-['Outfit',sans-serif]">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[19px] font-semibold text-[#1a1a1a] tracking-[-0.02em]">
            Products
          </div>
          <div className="text-xs text-[#aaa] mt-0.5 font-['DM_Mono',monospace]">
            {products.length} items total
          </div>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e0e0da] font-['Outfit',sans-serif] text-[13px] font-medium text-[#1a1a1a] cursor-pointer transition-all duration-200 hover:bg-[#fafaf8] hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <span className={refreshing ? 'animate-spin inline-block' : ''}>
            ↻
          </span>
          {refreshing ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-2.5 flex-wrap mb-[18px]">
        <div className="flex items-center gap-1.5 bg-[#fafaf8] border border-[#e8e8e4] rounded-lg px-3.5 py-2 text-[13px] text-[#555]">
          <span>Total</span>
          <span className="font-['DM_Mono',monospace] text-[13px] font-medium text-[#1a1a1a]">
            {products.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fafaf8] border border-[#e8e8e4] rounded-lg px-3.5 py-2 text-[13px] text-[#555]">
          <span>In Stock</span>
          <span className="font-['DM_Mono',monospace] text-[13px] font-medium text-emerald-500">
            {inStockCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fafaf8] border border-[#e8e8e4] rounded-lg px-3.5 py-2 text-[13px] text-[#555]">
          <span>Out of Stock</span>
          <span className="font-['DM_Mono',monospace] text-[13px] font-medium text-red-600">
            {outOfStockCount}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2.5 flex-wrap mb-4">
        <div className="flex-1 min-w-[180px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb] text-sm pointer-events-none">
            🔍
          </span>
          <input
            className="w-full font-['Outfit',sans-serif] text-[13px] py-2.5 px-3 pl-[34px] rounded-lg border border-[#e0e0da] bg-white text-[#1a1a1a] outline-none transition-colors duration-150 focus:border-emerald-500"
            type="text"
            placeholder="Search by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="font-['Outfit',sans-serif] text-[13px] py-2.5 px-3 rounded-lg border border-[#e0e0da] bg-white text-[#1a1a1a] outline-none cursor-pointer min-w-[130px] focus:border-emerald-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="font-['Outfit',sans-serif] text-[13px] py-2.5 px-3 rounded-lg border border-[#e0e0da] bg-white text-[#1a1a1a] outline-none cursor-pointer min-w-[130px] focus:border-emerald-500"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="px-[18px] py-2.5 text-left text-[11px] font-['DM_Mono',monospace] font-medium tracking-[0.1em] uppercase text-[#aaa] bg-[#fafaf8] border-b border-[#e8e8e4] w-[38%]">
                Product
              </th>
              <th className="px-[18px] py-2.5 text-left text-[11px] font-['DM_Mono',monospace] font-medium tracking-[0.1em] uppercase text-[#aaa] bg-[#fafaf8] border-b border-[#e8e8e4] w-[16%] max-sm:hidden">
                Category
              </th>
              <th className="px-[18px] py-2.5 text-left text-[11px] font-['DM_Mono',monospace] font-medium tracking-[0.1em] uppercase text-[#aaa] bg-[#fafaf8] border-b border-[#e8e8e4] w-[14%] max-sm:hidden">
                Price
              </th>
              <th className="px-[18px] py-2.5 text-left text-[11px] font-['DM_Mono',monospace] font-medium tracking-[0.1em] uppercase text-[#aaa] bg-[#fafaf8] border-b border-[#e8e8e4] w-[20%]">
                Stock Status
              </th>
              <th className="px-[18px] py-2.5 text-left text-[11px] font-['DM_Mono',monospace] font-medium tracking-[0.1em] uppercase text-[#aaa] bg-[#fafaf8] border-b border-[#e8e8e4] w-[12%] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-[52px] px-5 text-center text-[#bbb]">
                    <div className="text-[36px]">📦</div>
                    <div className="text-[14px] font-medium">No products found</div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((product: Product) => (
                <tr className="border-b border-[#f0f0ec] transition-colors duration-100 hover:bg-[#fafaf8]" key={product._id}>
                  <td className="px-[18px] py-[13px] align-middle max-sm:px-3 max-sm:py-2.5">
                    <div className="flex items-center gap-3">
                      {product.image?.[0] ? (
                        <img className="w-[42px] h-[42px] rounded-lg object-cover border border-[#e8e8e4]" src={product.image[0]} alt="" />
                      ) : (
                        <div className="w-[42px] h-[42px] rounded-lg bg-[#f2f2ef] border border-[#e8e8e4] flex items-center justify-center">
                          📦
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-[#1a1a1a] overflow-hidden text-ellipsis whitespace-nowrap">
                          {product.name}
                        </div>
                        <div className="text-[11.5px] text-[#aaa] overflow-hidden text-ellipsis whitespace-nowrap">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[18px] py-[13px] align-middle max-sm:hidden">
                    <span className="inline-block text-[11.5px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">
                      {product.category || '—'}
                    </span>
                  </td>
                  <td className="px-[18px] py-[13px] align-middle max-sm:hidden">
                    <div className="flex flex-col">
                      <span className="font-['DM_Mono',monospace] font-medium text-[#1a1a1a]">
                        {currency}{product.offerPrice.toLocaleString()}
                      </span>
                      {product.price !== product.offerPrice && (
                        <span className="font-['DM_Mono',monospace] text-[11px] text-[#bbb] line-through">
                          {currency}{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-[18px] py-[13px] align-middle">
                    <StockToggle
                      productId={product._id}
                      inStock={product.inStock}
                      onToggled={fetchProducts}
                      axios={axios}
                    />
                  </td>
                  <td className="px-[18px] py-[13px] align-middle">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button 
                        className="w-8 h-8 rounded-lg border border-[#e0e0da] bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-emerald-50 hover:border-emerald-500"
                        onClick={() => setEditProduct(product)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg border border-[#e0e0da] bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-red-50 hover:border-red-200"
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
          <div className="font-['DM_Mono',monospace] text-[11px] text-[#bbb] py-2.5 px-[18px] bg-[#fafaf8] border-t border-[#e8e8e4] text-right">
            Showing {filtered.length} of {products.length} products
          </div>
        )}
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
    </div>
  );
};

export default ProductList;