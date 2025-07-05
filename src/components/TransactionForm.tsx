"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

// --- Type Definitions ---
export type TransactionType = {
  description: string;
  amount: number;
  date: string; // ISO 8601 string (e.g., "YYYY-MM-DD")
  type: "Income" | "Expense";
  category: string;
};

// --- Component Props Interface ---
type TransactionFormProps = {
  onAdd: (tx: TransactionType) => void; // Callback function to add a new transaction
};

// --- Constants ---
const CATEGORIES = [
  "Food",
  "Rent",
  "Salary",
  "Entertainment",
  "Utilities",
  "Travel",
  "Other",
];

// --- TransactionForm Component ---
export default function TransactionForm({ onAdd }: TransactionFormProps) {
  // --- Form Hook Initialization ---
  const {
    register, // Function to register input fields with React Hook Form
    handleSubmit, // Function to handle form submission
    reset, // Function to reset form fields
    setValue, // Function to programmatically set form values
    watch, // Function to watch form values (used for Select components)
  } = useForm<TransactionType>({
    // Set default values for the form fields
    defaultValues: {
      type: "Expense", // Default transaction type
      category: "Other", // Default transaction category
    },
  });

  // --- Form Submission Handler ---
  const onSubmit = (data: TransactionType) => {
    // Call the `onAdd` prop with the new transaction data, ensuring amount is a number
    onAdd({ ...data, amount: Number(data.amount) });
    // Reset the form fields after submission, keeping type and category as default
    reset({ ...data, type: "Expense", category: "Other" });
  };

  // --- Main Component Render ---
  return (
    <Card className="bg-zinc-900 text-white w-full h-full border-none">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: true })} // Register input with validation
              placeholder="e.g. Rent, Salary"
              className="text-white placeholder:text-gray-400 bg-zinc-800"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: true, valueAsNumber: true })} // Register as number
              placeholder="e.g. 2000"
              className="text-white placeholder:text-gray-400 bg-zinc-800"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: true })}
              className="text-white placeholder:text-gray-400 bg-zinc-800"
            />
          </div>

          {/* Type and Category Selects */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Select */}
            <div className="w-full space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={watch("type")} // Watch the current value for display
                onValueChange={(value) =>
                  setValue("type", value as "Income" | "Expense") // Update form value
                }
              >
                <SelectTrigger id="type" className="bg-zinc-800 text-white w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div className="w-full space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")} // Watch the current value for display
                onValueChange={(value) => setValue("category", value)} // Update form value
              >
                <SelectTrigger id="category" className="bg-zinc-800 text-white w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-900 text-white">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}