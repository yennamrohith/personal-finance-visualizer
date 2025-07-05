"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

// Define the TransactionType interface.
// Assuming TransactionType is defined elsewhere, but including a placeholder
// for clarity if it's not provided in the same file.
// If it's indeed imported from "./TransactionForm", then this can be removed.
export interface TransactionType {
  type: "Income" | "Expense";
  category: string;
  amount: number;
}

// --- Constants ---
const COLORS = ["#36A2EB", "#FFCE56", "#00C49F", "#FF8042", "#A28EFF", "#FF6384"];
const NO_DATA_COLOR = "#444";

// --- Component Props Interface ---
interface CategoryPieChartProps {
  transactions: TransactionType[];
}

// --- CategoryPieChart Component ---
export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // --- Data Transformation Memoization ---
  const { incomeData, expenseData } = useMemo(() => {
    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      const map = tx.type === "Income" ? incomeMap : expenseMap;
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });

    const toPieData = (map: Record<string, number>) =>
      Object.entries(map).map(([name, value]) => ({ name, value }));

    return {
      incomeData: toPieData(incomeMap),
      expenseData: toPieData(expenseMap),
    };
  }, [transactions]); // Re-run memoization if transactions change

  // --- Chart Rendering Function ---
  const renderChart = (data: { name: string; value: number }[], title: string) => {
    // If no data, display a "No Data" slice
    const chartData = data.length > 0 ? data : [{ name: "No Data", value: 1 }];

    return (
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8" // Default fill, overridden by Cell fill
              label={data.length > 0} // Only show labels if there's actual data
              isAnimationActive={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={data.length > 0 ? COLORS[index % COLORS.length] : NO_DATA_COLOR}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // --- Main Component Render ---
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {renderChart(incomeData, "Income by Category")}
      {renderChart(expenseData, "Expenses by Category")}
    </div>
  );
}