import { useEffect, useState } from "react";
import { toast } from "sonner";
import TransactionsTable from "../components/TransactionsTable";
import { fetchUserTransactions } from "../api";
import type { Transaction } from "../types";
import { useAppContext } from "@/context/AppContext";
import { debugError } from "@/lib/debug";

/* ─── Skeleton Loader Component ─── */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Card-based Skeleton Layout
const TransactionsCardSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function UserTransactionsPage() {
  const { currency } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await fetchUserTransactions();
      setTransactions(data);
    } catch (error: any) {
      debugError("transactions:user:page", error);
      toast.error(error?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
      if (isRefresh) setTimeout(() => setRefreshing(false), 600);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Transactions</h1>
          <p className="text-sm text-gray-500">Payment history for your orders.</p>
        </div>

        <button 
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={`${refreshing ? "animate-spin" : ""}`}>↻</span>
          Refresh
        </button>
      </div>

      {loading ? (
        <TransactionsCardSkeleton />
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No transactions yet
          </h3>
          <p className="text-sm text-gray-500">
            Your payment history will appear here once you make a purchase.
          </p>
        </div>
      ) : (
        <TransactionsTable transactions={transactions} currency={currency} />
      )}
    </div>
  );
}