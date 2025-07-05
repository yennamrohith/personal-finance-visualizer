"use client";

import { useState } from "react";

// --- Component Imports ---
import TransactionForm, { TransactionType } from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetForm from "@/components/BudgetForm";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import SpendingInsights from "@/components/SpendingInsights";

// --- Main Home Component ---
export default function Home() {
  // --- State Management ---
  // State for all financial transactions
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  // State to manage which transaction is currently being edited (stores its index)
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // State for storing budget data, organized by month and then by category
  const [budgets, setBudgets] = useState<Record<string, Record<string, number>>>({});

  // --- Transaction Handlers ---
  /**
   * Handles adding a new transaction or updating an existing one.
   * If `editIndex` is set, it updates the transaction at that index; otherwise, it adds a new transaction.
   * @param newTx The new transaction object to add or update.
   */
  const handleAddTransaction = (newTx: TransactionType) => {
    if (editIndex !== null) {
      // Logic for editing an existing transaction
      const updated = [...transactions]; // Create a shallow copy to avoid direct mutation
      updated[editIndex] = newTx; // Update the transaction at the specific index
      setTransactions(updated); // Set the updated transactions array
      setEditIndex(null); // Reset editIndex to null as editing is complete
    } else {
      // Logic for adding a new transaction
      setTransactions((prev) => [...prev, newTx]); // Add the new transaction to the end of the array
    }
  };

  /**
   * Handles deleting a transaction by its index.
   * @param index The index of the transaction to be deleted.
   */
  const handleDelete = (index: number) => {
    // Filter out the transaction at the specified index
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Sets the `editIndex` to the index of the transaction to be edited.
   * This typically triggers the `TransactionForm` to pre-fill with the transaction's data.
   * @param index The index of the transaction to be edited.
   */
  const handleEdit = (index: number) => {
    setEditIndex(index);
    // In a full implementation, you would also pass the transaction data
    // to the form so it can be pre-filled.
    // For example, if TransactionForm accepted a 'transactionToEdit' prop.
  };

  // --- Component Render ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 md:px-10 lg:px-16 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Finance Visualizer</h1>

      <div className="flex flex-col gap-y-10">
        {/* Transaction Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TransactionForm onAdd={handleAddTransaction} />
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        {/* Financial Summary */}
        <DashboardSummary transactions={transactions} />

        {/* Visualizations Section */}
        {/* Category Pie Charts (Income and Expenses) */}
        <CategoryPieChart transactions={transactions} />

        {/* Monthly Bar Chart (Income vs. Expense over time) */}
        <MonthlyBarChart transactions={transactions} />

        {/* Budgeting Section */}
        {/* Form to set monthly budgets */}
        <BudgetForm budgets={budgets} setBudgets={setBudgets} />

        {/* Chart comparing budgeted vs. actual spending */}
        <BudgetComparisonChart transactions={transactions} budgets={budgets} />

        {/* Spending Insights based on budgets and actuals */}
        <SpendingInsights transactions={transactions} budgets={budgets} />
      </div>
    </main>
  );
}