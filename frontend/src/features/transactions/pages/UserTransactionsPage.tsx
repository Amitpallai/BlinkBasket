import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionsTable from "../components/TransactionsTable";
import { fetchUserTransactions } from "../api";
import type { Transaction } from "../types";
import { useAppContext } from "@/context/AppContext";
import { debugError } from "@/lib/debug";

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
    <div className="mx-auto mt-16 max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Transactions</h1>
          <p className="text-sm text-gray-500">Payment history for your orders.</p>
        </div>

        <button 
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
        >
          <span className={`${refreshing ? "animate-spin" : ""}`}>↻</span>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-500">
          Loading transactions...
        </div>
      ) : (
        <TransactionsTable transactions={transactions} currency={currency} />
      )}
    </div>
  );
}