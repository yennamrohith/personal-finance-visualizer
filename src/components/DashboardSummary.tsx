"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { format } from "date-fns";

// Assuming TransactionType is defined elsewhere, but including a placeholder
// for clarity if it's not provided in the same file.
// If it's indeed imported from "./TransactionForm", then this can be removed.
export interface TransactionType {
  type: "Income" | "Expense";
  amount: number;
  date: string; // Assuming 'date' is a string that can be parsed by new Date()
  description: string;
  category: string; // Although not used in this component, keeping it for completeness if from TransactionForm
}

// --- Component Props Interface ---
interface DashboardSummaryProps {
  transactions: TransactionType[];
}

// --- DashboardSummary Component ---
export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  // --- Data Calculation Memoization ---
  const { totalIncome, totalExpense, netBalance, recentTransaction } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let recent: TransactionType | null = null; // Initialize recent to null

    // Find the most recent transaction if transactions exist
    if (transactions.length > 0) {
      recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }

    // Calculate total income and total expense
    transactions.forEach((tx) => {
      if (tx.type === "Income") {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense, // Calculate net balance
      recentTransaction: recent,
    };
  }, [transactions]); // Recalculate only when the transactions array changes

  // --- Main Component Render ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Income Card */}
      <Card className="bg-green-900 text-white">
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-300">Total Income</h2>
          <p className="text-2xl font-bold text-green-400">₹{totalIncome.toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card className="bg-red-900 text-white">
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-300">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-400">₹{totalExpense.toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Net Balance Card */}
      <Card className="bg-blue-900 text-white">
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-300">Net Balance</h2>
          <p className="text-2xl font-bold">₹{netBalance.toLocaleString()}</p>
          {/* Display recent transaction details if available */}
          {recentTransaction && (
            <p className="text-xs text-gray-400 mt-2">
              Last: {recentTransaction.description} • ₹{recentTransaction.amount} on{" "}
              {format(new Date(recentTransaction.date), "dd MMM yyyy")} {/* Format date */}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}