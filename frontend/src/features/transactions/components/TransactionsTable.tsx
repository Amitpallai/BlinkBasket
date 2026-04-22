import type { Transaction } from "../types";

type TransactionsTableProps = {
  transactions: Transaction[];
  currency: string;
};

const statusClass = (status: string): string => {
  const key = status.toLowerCase();
  if (key === "paid") return "bg-green-100 text-green-700";
  if (key === "pending") return "bg-amber-100 text-amber-700";
  if (key === "failed") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function TransactionsTable({
  transactions,
  currency,
}: TransactionsTableProps) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-[#ede8df] bg-[#fffdf9] p-8 text-center text-sm text-[#7a6e58]">
        No transactions found yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#ede8df] bg-[#fffdf9]">
      <table className="min-w-full text-sm">
        <thead className="bg-[#f7f2ea] text-[#4a3e2a]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Order ID</th>
            <th className="px-4 py-3 text-left font-semibold">Amount</th>
            <th className="px-4 py-3 text-left font-semibold">Method</th>
            <th className="px-4 py-3 text-left font-semibold">Payment</th>
            <th className="px-4 py-3 text-left font-semibold">Txn Ref</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id} className="border-t border-[#f0ebe0]">
              <td className="px-4 py-3 font-mono text-xs text-[#1a2e1a]">
                {txn.orderId.slice(-8).toUpperCase()}
              </td>
              <td className="px-4 py-3 font-semibold text-[#1a2e1a]">
                {currency}
                {txn.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-[#7a6e58]">{txn.paymentMethod}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(txn.paymentStatus)}`}>
                  {txn.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-[#7a6e58]">
                {txn.txnRef || "-"}
              </td>
              <td className="px-4 py-3 text-[#7a6e58]">
                {new Date(txn.createdAt).toLocaleDateString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
