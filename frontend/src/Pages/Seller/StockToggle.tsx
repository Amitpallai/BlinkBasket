import React, { useState } from 'react';
import {toast} from 'sonner';

interface StockToggleProps {
  productId: string;
  inStock: boolean;
  onToggled: () => void;
  axios: any;
}

const StockToggle: React.FC<StockToggleProps> = ({ productId, inStock, onToggled, axios }) => {
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(inStock);

  // Keep optimistic in sync when parent data refreshes
  React.useEffect(() => {
    setOptimistic(inStock);
  }, [inStock]);

  const handleToggle = async () => {
    const next = !optimistic;
    setOptimistic(next);   // instant UI feedback
    setLoading(true);
    try {
      const { data } = await axios.post('/api/product/stock', {
        id: productId,
        inStock: next,
      });
      if (data.success) {
        toast.success(data.message || (next ? 'Marked in stock' : 'Marked out of stock'));
        onToggled();
      } else {
        // Revert on failure
        setOptimistic(!next);
        toast.error(data.message);
      }
    } catch (err: any) {
      setOptimistic(!next);
      toast.error(err?.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap');

        .st-wrap {
          display: inline-flex; align-items: center; gap: 9px;
        }

        .st-track {
          position: relative; width: 38px; height: 21px; flex-shrink: 0;
        }
        .st-track input { opacity: 0; width: 0; height: 0; position: absolute; }

        .st-bg {
          position: absolute; inset: 0; border-radius: 21px;
          background: #d9d9d3; transition: background 0.2s; cursor: pointer;
        }
        .st-track input:checked ~ .st-bg { background: #1a1a1a; }
        .st-track input:disabled ~ .st-bg { opacity: 0.5; cursor: not-allowed; }

        .st-knob {
          position: absolute; top: 3.5px; left: 3.5px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; transition: transform 0.2s;
          pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .st-track input:checked ~ .st-bg .st-knob { transform: translateX(17px); }

        .st-badge {
          font-family: 'Outfit', sans-serif;
          font-size: 11.5px; font-weight: 500;
          padding: 3px 9px; border-radius: 5px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .st-badge.in  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .st-badge.out { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        .st-loading-dot {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid #d9d9d3; border-top-color: #555;
          animation: st-spin 0.6s linear infinite; flex-shrink: 0;
        }
        @keyframes st-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="st-wrap">
        {loading ? (
          <div className="st-loading-dot" />
        ) : (
          <label className="st-track">
            <input
              type="checkbox"
              checked={optimistic}
              onChange={handleToggle}
              disabled={loading}
            />
            <div className="st-bg">
              <div className="st-knob" />
            </div>
          </label>
        )}
        <span className={`st-badge ${optimistic ? 'in' : 'out'}`}>
          {optimistic ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </>
  );
};

export default StockToggle;