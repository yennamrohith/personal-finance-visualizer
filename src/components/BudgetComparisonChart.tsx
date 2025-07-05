"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

// Assuming TransactionType is defined elsewhere, but including a placeholder
// for clarity if it's not provided in the same file.
// If it's indeed imported from "./TransactionForm", then this can be removed.
export interface TransactionType {
  date: string; // Assuming 'date' is a string that can be parsed by new Date()
  category: string;
  amount: number;
}

// --- Component Props Interface ---
interface BudgetComparisonChartProps {
  transactions: TransactionType[];
  budgets: Record<string, Record<string, number>>; // budgets: { [monthYear: string]: { [category: string]: number } }
}

// --- BudgetComparisonChart Component ---
export default function BudgetComparisonChart({ transactions, budgets }: BudgetComparisonChartProps) {
  // --- Data Preparation Memoization ---
  const data = useMemo(() => {
    // Map to store actual expenses by month and category
    const actuals: Record<string, Record<string, number>> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      // Format month as "Mon YYYY" (e.g., "Jul 2025")
      const month = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      if (!actuals[month]) actuals[month] = {};
      actuals[month][tx.category] = (actuals[month][tx.category] || 0) + tx.amount;
    });

    // Array to hold combined budget and actual data
    const combined: {
      key: string; // Unique key for each data point (e.g., "Jul 2025 - Groceries")
      month: string;
      category: string;
      Budgeted: number;
      Actual: number;
    }[] = [];

    // Populate combined data with budgeted amounts and corresponding actuals
    Object.entries(budgets).forEach(([month, categories]) => {
      Object.entries(categories).forEach(([category, budgetAmount]) => {
        const actualAmount = actuals[month]?.[category] || 0; // Get actual, default to 0 if not found
        combined.push({
          key: `${month} - ${category}`,
          month,
          category,
          Budgeted: budgetAmount,
          Actual: actualAmount,
        });
      });
    });

    // Add any actual expenses that don't have a corresponding budget entry
    Object.entries(actuals).forEach(([month, categories]) => {
      Object.entries(categories).forEach(([category, actualAmount]) => {
        // Check if this month-category combination already exists in 'combined'
        const exists = combined.some(item => item.month === month && item.category === category);
        if (!exists) {
          combined.push({
            key: `${month} - ${category}`,
            month,
            category,
            Budgeted: 0, // Budgeted is 0 if no budget was set
            Actual: actualAmount,
          });
        }
      });
    });

    // Sort the combined data for consistent chart display
    return combined.sort((a, b) => {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const [aMonthStr, aYearStr] = a.month.split(' ');
      const [bMonthStr, bYearStr] = b.month.split(' ');
      const aYear = parseInt(aYearStr);
      const bYear = parseInt(bYearStr);

      // Sort by year first
      if (aYear !== bYear) {
        return aYear - bYear;
      }
      // Then by month
      const aMonthIndex = monthOrder.indexOf(aMonthStr);
      const bMonthIndex = monthOrder.indexOf(bMonthStr);

      if (aMonthIndex !== bMonthIndex) {
        return aMonthIndex - bMonthIndex;
      }
      // Finally by category
      return a.category.localeCompare(b.category);
    });
  }, [transactions, budgets]); // Re-run memoization if transactions or budgets change

  // --- Custom Tooltip Component for Recharts ---

  // Define the type for the data structure within Recharts payload
  interface PayloadItem {
    value: number;
    name: string;
    payload: {
      key: string;
      month: string;
      category: string;
      Budgeted: number;
      Actual: number;
    };
  }

  // Define the props for Recharts Custom Tooltip
  interface CustomTooltipProps {
    active?: boolean; // Recharts provides this
    payload?: PayloadItem[]; // Recharts provides this, an array of data items
    // label?: string; // We've removed this from the destructuring as it's not used
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload; // Access the data item
      return (
        <div className="p-3 rounded-lg bg-neutral-700 text-white shadow-xl text-sm border border-neutral-600">
          <p className="font-semibold text-base mb-1 text-blue-300">{item.key}</p>
          <p>Budgeted: <span className="font-medium text-green-300">₹{item.Budgeted.toLocaleString()}</span></p>
          <p>Actual: <span className="font-medium text-red-300">₹{item.Actual.toLocaleString()}</span></p>
        </div>
      );
    }
    return null;
  };

  // --- Main Component Render ---
  return (
    <div className="w-full mt-8 bg-zinc-900 rounded-lg p-6 shadow-lg">
      {/* Chart Header and Legend */}
      <div className="flex items-center mb-4">
        <div className="flex-grow text-center">
          <h2 className="text-xl font-bold text-white">Budget vs Actual</h2>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#EF4444] rounded-full mr-1"></span> {/* Actual color */}
            <span className="text-white">Actual</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#3B82F6] rounded-full mr-1"></span> {/* Budgeted color */}
            <span className="text-white">Budgeted</span>
          </div>
        </div>
      </div>

      {/* Responsive Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barCategoryGap="20%" // Gap between categories (e.g., between "Groceries" and "Utilities" bars)
          barGap={2} // Gap between bars within the same category (Budgeted vs Actual)
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#4a4a4a" /> {/* Grid lines */}
          <XAxis
            dataKey="key" // Each bar represents a unique key (month - category)
            angle={-55} // Rotate labels for better readability
            textAnchor="end"
            interval="preserveStartEnd"
            height={100} // Give more height for rotated labels
            tick={{ fill: "#ccc", fontSize: 11 }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
          />
          <YAxis
            tick={{ fill: "#ccc", fontSize: 11 }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
            tickFormatter={(value) => `₹${value.toLocaleString()}`} // Format Y-axis labels as currency
          />
          <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
          <Bar dataKey="Budgeted" fill="#3B82F6" barSize={30} /> {/* Blue for Budgeted */}
          <Bar dataKey="Actual" fill="#EF4444" barSize={30} /> {/* Red for Actual */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}