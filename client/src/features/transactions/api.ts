import axios from "axios";
import { debugError, debugLog } from "@/lib/debug";
import type { Transaction, TransactionsResponse } from "./types";

const normalizeError = (error: any, fallback: string): string =>
  error?.response?.data?.message || error?.message || fallback;

export const fetchUserTransactions = async (): Promise<Transaction[]> => {
  try {
    debugLog("transactions:user", "request:start");
    const { data } = await axios.get<TransactionsResponse>("/api/transaction/user");
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user transactions");
    }
    debugLog("transactions:user", "request:success", { count: data.transactions?.length || 0 });
    return data.transactions || [];
  } catch (error: any) {
    debugError("transactions:user", error);
    throw new Error(normalizeError(error, "Failed to fetch user transactions"));
  }
};

export const fetchSellerTransactions = async (): Promise<Transaction[]> => {
  try {
    debugLog("transactions:seller", "request:start");
    const { data } = await axios.get<TransactionsResponse>("/api/transaction/seller");
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch seller transactions");
    }
    debugLog("transactions:seller", "request:success", { count: data.transactions?.length || 0 });
    return data.transactions || [];
  } catch (error: any) {
    debugError("transactions:seller", error);
    throw new Error(normalizeError(error, "Failed to fetch seller transactions"));
  }
};
