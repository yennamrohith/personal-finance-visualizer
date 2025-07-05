"use client";

import { useMemo } from "react";
import { FaExclamationCircle } from "react-icons/fa";

// Assuming TransactionType is defined elsewhere, but including a placeholder
// for clarity if it's not provided in the same file.
// If it's indeed imported from "./TransactionForm", then this can be removed.
export interface TransactionType {
  type: "Income" | "Expense";
  amount: number;
  date: string; // Assuming 'date' is a string that can be parsed by new Date()
  description: string;
  category: string;
}

// --- Component Props Interface ---
interface SpendingInsightsProps {
  transactions: TransactionType[];
  budgets: Record<string, Record<string, number>>; // budgets: { [monthYear: string]: { [category: string]: number } }
}

// --- SpendingInsights Component ---
export default function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  // --- Data Analysis Memoization ---
  const insights = useMemo(() => {
    const insights: { type: 'overspent' | 'budgeted', message: string, category?: string }[] = [];
    const actuals: Record<string, Record<string, number>> = {}; // Stores actual spending by month and category

    // Aggregate actual expenses from transactions
    transactions.forEach((tx) => {
      if (tx.type !== "Expense") return; // Only consider expenses for insights
      const date = new Date(tx.date);
      // Format month as "Mon YYYY" (e.g., "Jul 2025")
      const month = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      if (!actuals[month]) actuals[month] = {};
      actuals[month][tx.category] = (actuals[month][tx.category] || 0) + tx.amount;
    });

    // Compare actual spending against budgets to generate insights
    Object.entries(budgets).forEach(([month, categoryBudgets]) => {
      Object.entries(categoryBudgets).forEach(([category, budget]) => {
        const spent = actuals[month]?.[category] || 0; // Get actual spent, default to 0 if no transactions

        if (spent > budget) {
          // If actual spending exceeds budget
          insights.push(
            {
                type: 'overspent',
                message: `${month}: Overspent ₹${(spent - budget).toLocaleString()} in "${category}" (Spent ₹${spent.toLocaleString()}, Budget ₹${budget.toLocaleString()})`,
                category: category
            }
          );
        } else if (spent > 0 && budget > 0) {
          // If there's spending and a budget, show percentage spent
          const pct = Math.round((spent / budget) * 100);
          insights.push({
              type: 'budgeted',
              message: `${month}: Spent ${pct}% of "${category}" budget`
          });
        }
      });
    });

    return insights;
  }, [transactions, budgets]); // Recalculate insights when transactions or budgets change

  // --- Main Component Render ---
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">Spending Insights</h2>
      {insights.length === 0 ? (
        // Display message if no insights are available
        <p className="text-base text-gray-400">No spending insights yet. Keep tracking your expenses!</p>
      ) : (
        // Display list of insights
        <ul className="space-y-3">
          {insights.map((insight, idx) => (
            <li
              key={idx} // Using index as key is acceptable here as the list is not reordered or filtered
              className={`flex items-start p-3 rounded-lg ${
                insight.type === 'overspent'
                  ? 'bg-red-900/40 text-red-300 border border-red-700' // Styling for overspent insights
                  : 'bg-zinc-800 text-gray-200' // Styling for budgeted insights
              }`}
            >
              {insight.type === 'overspent' && (
                <FaExclamationCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={18} />
              )}
              <span className="flex-grow">{insight.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}