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

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchUserTransactions();
        setTransactions(data);
      } catch (error: any) {
        debugError("transactions:user:page", error);
        toast.error(error?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="mx-auto mt-16 max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-[#1a2e1a]">My Transactions</h1>
      <p className="mb-5 text-sm text-[#7a6e58]">
        Payment history for your orders.
      </p>
      {loading ? (
        <div className="rounded-2xl border border-[#ede8df] bg-[#fffdf9] p-8 text-center text-sm text-[#7a6e58]">
          Loading transactions...
        </div>
      ) : (
        <TransactionsTable transactions={transactions} currency={currency} />
      )}
    </div>
  );
}
