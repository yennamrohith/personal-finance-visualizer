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
  type: "Income" | "Expense";
  amount: number;
  date: string; // Assuming 'date' is a string that can be parsed by new Date()
  description: string; // Although not used in this component, keeping it for completeness
  category: string; // Although not used in this component, keeping it for completeness
}

// --- Component Props Interface ---
interface MonthlyBarChartProps {
  transactions: TransactionType[];
}

// --- Custom Legend Component ---
const CustomChartLegend = () => (
  <div className="flex items-center space-x-4 text-sm text-gray-300">
    <div className="flex items-center">
      <span className="inline-block w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: '#EF4444' }}></span>
      <span>Expense</span>
    </div>
    <div className="flex items-center">
      <span className="inline-block w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: '#22C55E' }}></span>
      <span>Income</span>
    </div>
  </div>
);

// --- MonthlyBarChart Component ---
export default function MonthlyBarChart({ transactions }: MonthlyBarChartProps) {
  // --- Data Aggregation Memoization ---
  const monthlyData = useMemo(() => {
    // Group transactions by month and year
    const grouped: Record<
      string, // Key format: "Mon YYYY" (e.g., "Jul 2025")
      {
        month: string;
        income: number;
        expense: number;
      }
    > = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      // Create a unique key for each month (e.g., "Jan 2023", "Feb 2023")
      const key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;

      // Initialize month entry if it doesn't exist
      if (!grouped[key]) {
        grouped[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      // Aggregate income and expense
      if (tx.type === "Income") {
        grouped[key].income += tx.amount;
      } else {
        grouped[key].expense += tx.amount;
      }
    });

    // Convert the grouped object into an array and sort by date
    return Object.values(grouped).sort((a, b) => {
      // Create Date objects for proper chronological sorting
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, [transactions]); // Recalculate only when transactions change

  // --- Custom Tooltip Component for Recharts ---
  // Define the type for the data structure within Recharts payload
  interface PayloadItem {
    value: number;
    name: string;
    color: string;
    // Recharts payload can have other properties, but these are the ones used
    // payload: { income: number; expense: number; month: string; }; // This might be present but not directly used in the tooltip rendering logic here
  }

  // Define the props for Recharts Custom Tooltip
  interface CustomTooltipProps {
    active?: boolean; // Recharts provides this
    payload?: PayloadItem[]; // Recharts provides this, an array of data items
    label?: string; // Recharts provides this (the dataKey value for the active point)
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 rounded-md bg-neutral-800 text-white shadow-lg text-sm space-y-1">
          <p className="font-semibold text-base">{label}</p>
          {payload.map((entry, index: number) => ( // Changed 'entry: any' to 'entry' as it's now typed by PayloadItem
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Main Component Render ---
  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-zinc-900 rounded-lg shadow-xl">
      {/* Chart Header and Legend */}
      <div className="w-full relative mb-6">
        <h2 className="text-xl font-bold text-gray-200 tracking-wider text-center w-full">Monthly Overview</h2>
        <div className="absolute top-0 right-4">
          <CustomChartLegend />
        </div>
      </div>

      {/* Responsive Bar Chart */}
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barGap={4} // Gap between bars within the same category (income/expense)
          barCategoryGap="40%" // Gap between different categories (months)
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} /> {/* Horizontal grid lines */}

          <XAxis
            dataKey="month"
            angle={-30} // Rotate labels for better readability
            textAnchor="end"
            interval={0} // Show all labels
            stroke="#666"
            tick={{ fill: '#aaa', fontSize: 12 }}
            height={60} // Provide enough height for rotated labels
          />
          <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

          {/* Bars for Expense and Income */}
          <Bar dataKey="expense" fill="#EF4444" name="Expense" />
          <Bar dataKey="income" fill="#22C55E" name="Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}