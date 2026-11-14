export type Transaction = {
  _id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  txnRef: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type TransactionsResponse = {
  success: boolean;
  transactions: Transaction[];
  message?: string;
};
