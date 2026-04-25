import type { Transaction } from "../types";

type TransactionsTableProps = {
  transactions: Transaction[];
  currency: string;
};

const statusClass = (status: string): string => {
  const key = status.toLowerCase();
  if (key === "paid") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (key === "pending") return "bg-amber-50 text-amber-700 border border-amber-100";
  if (key === "failed") return "bg-red-50 text-red-700 border border-red-100";
  return "bg-gray-50 text-gray-700 border border-gray-100";
};

export default function TransactionsTable({
  transactions,
  currency,
}: TransactionsTableProps) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-400">
        <div className="text-3xl mb-2">📄</div>
        No transactions found yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
          <tr>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Order ID</th>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Amount</th>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Method</th>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Status</th>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Txn Ref</th>
            <th className="px-5 py-4 text-left font-medium uppercase tracking-wider text-[10px]">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((txn) => (
            <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-4 font-mono text-xs text-gray-900">
                #{txn.orderId.slice(-8).toUpperCase()}
              </td>
              <td className="px-5 py-4 font-semibold text-gray-900">
                {currency}{txn.amount.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-gray-600">{txn.paymentMethod}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${statusClass(txn.paymentStatus)}`}>
                  {txn.paymentStatus}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-gray-500">
                {txn.txnRef || "-"}
              </td>
              <td className="px-5 py-4 text-gray-500">
                {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}