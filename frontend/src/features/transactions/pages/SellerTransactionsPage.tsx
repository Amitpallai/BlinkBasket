import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionsTable from "../components/TransactionsTable";
import { fetchSellerTransactions } from "../api";
import type { Transaction } from "../types";
import { useAppContext } from "@/context/AppContext";
import { debugError } from "@/lib/debug";

export default function SellerTransactionsPage() {
  const { currency } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchSellerTransactions();
        setTransactions(data);
      } catch (error: any) {
        debugError("transactions:seller:page", error);
        toast.error(error?.message || "Failed to load seller transactions");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-[#1a1a1a]">Transactions</h1>
      <p className="mb-5 text-sm text-[#7a6e58]">
        Full transaction ledger for seller dashboard.
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
