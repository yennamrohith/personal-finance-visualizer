"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// Assuming TransactionType is defined elsewhere, but including a placeholder
// for clarity if it's not provided in the same file.
// If it's indeed imported from "./TransactionForm", then this can be removed.
export type TransactionType = {
  description: string;
  amount: number;
  date: string; // ISO 8601 string (e.g., "YYYY-MM-DD")
  type: "Income" | "Expense";
  category: string;
};

// --- Component Props Interface ---
interface TransactionListProps {
  transactions: TransactionType[]; // Array of transaction objects to display
  onDelete: (index: number) => void; // Callback function for deleting a transaction
  onEdit: (index: number) => void; // Callback function for editing a transaction
}

// --- TransactionList Component ---
export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  return (
    <Card className="bg-zinc-900 text-white w-full h-[420px] flex flex-col border-none">
      <CardContent className="p-4 overflow-y-auto space-y-4">
        {/* Map through the transactions array to render each transaction */}
        {transactions.map((tx, idx) => (
          <div
            key={idx} // Using index as key is acceptable here since transactions are not reordered or filtered in this component
            className="bg-zinc-800 rounded-md p-4 flex justify-between items-center"
          >
            {/* Transaction Details */}
            <div>
              <div className="text-lg font-semibold">{tx.description}</div>
              <div className="text-sm text-gray-400">
                {format(new Date(tx.date), "d/M/yyyy")} • {tx.type} •{" "}
                <span className="italic">{tx.category}</span>
              </div>
            </div>

            {/* Transaction Amount and Actions */}
            <div className="flex items-center gap-3">
              {/* Formatted Amount with conditional coloring */}
              <div
                className={`text-lg font-bold ${
                  tx.type === "Income" ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{tx.amount.toLocaleString()}
              </div>
              {/* Edit Button */}
              <Button
                size="sm"
                variant="outline"
                className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => onEdit(idx)} // Pass the index to the edit handler
              >
                Edit
              </Button>
              {/* Delete Button */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(idx)} // Pass the index to the delete handler
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}