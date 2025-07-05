"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// --- Component Props Interface ---
interface BudgetFormProps {
  budgets: Record<string, Record<string, number>>; // e.g., { "Jul 2025": { "Food": 5000, "Rent": 15000 } }
  setBudgets: (updated: Record<string, Record<string, number>>) => void;
}

// --- Constants ---
const CATEGORIES = ["Food", "Rent", "Salary", "Entertainment", "Utilities", "Travel", "Other"];

// --- BudgetForm Component ---
export default function BudgetForm({ budgets, setBudgets }: BudgetFormProps) {
  // --- State Management ---
  // State for the currently selected month in the dropdown
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
  });

  // State for the form input values (stringly typed for input elements)
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    // Initialize form values from existing budget data for the current month
    const existing = budgets[selectedMonth] || {};
    const stringified: Record<string, string> = {};
    for (const [cat, num] of Object.entries(existing)) {
      stringified[cat] = num.toString();
    }
    return stringified;
  });

  // --- Handlers ---
  // Handles changes to individual budget input fields
  const handleChange = (category: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Handles saving the budget data
  const handleSave = () => {
    const updated: Record<string, number> = {};
    for (const [cat, val] of Object.entries(formValues)) {
      // Convert string input to number, default to 0 if invalid
      updated[cat] = Number(val) || 0;
    }

    // Update the parent's budgets state with the new or updated month's budget
    setBudgets({
      ...budgets,
      [selectedMonth]: updated,
    });
  };

  // Handles changing the selected month from the dropdown
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    // When month changes, update formValues to reflect the budget for the newly selected month
    const existing = budgets[value] || {};
    const stringified: Record<string, string> = {};
    for (const [cat, num] of Object.entries(existing)) {
      stringified[cat] = num.toString();
    }
    setFormValues(stringified);
  };

  // --- Main Component Render ---
  return (
    <Card className="bg-zinc-900 text-white w-full border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        {/* Left spacer for centering the title */}
        <div className="flex-1"></div>

        <CardTitle className="text-xl font-bold">Set Monthly Budgets</CardTitle>

        {/* Right section for month selection */}
        <div className="flex-1 flex justify-end">
          <Label htmlFor="month-select" className="sr-only">Select Month</Label>
          <Select
            value={selectedMonth}
            onValueChange={handleMonthChange} // Use the dedicated handler
          >
            <SelectTrigger id="month-select" className="bg-zinc-800 text-white w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {/* Generate month options for the current year */}
              {Array.from({ length: 12 }).map((_, i) => {
                const date = new Date();
                date.setMonth(i);
                const label = `${date.toLocaleString("default", {
                  month: "short",
                })} ${new Date().getFullYear()}`;
                return (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {/* Render input fields for each category */}
          {CATEGORIES.map((category) => (
            <div key={category} className="space-y-2">
              <Label htmlFor={category.toLowerCase().replace(/\s/g, '-')}>{category}</Label>
              <Input
                id={category.toLowerCase().replace(/\s/g, '-')}
                type="number"
                className="bg-zinc-800 text-white"
                placeholder="₹0"
                value={formValues[category] || ""} // Display current value or empty string
                onChange={(e) => handleChange(category, e.target.value)}
              />
            </div>
          ))}
          {/* Save Budget Button */}
          <div className="col-span-1 pt-4">
            <Button onClick={handleSave} className="bg-blue-900 text-white w-full">
              Save Budget
            </Button>
          </div>
          {/* Hidden div for layout on larger screens */}
          <div className="hidden sm:block"></div>
        </div>
      </CardContent>
    </Card>
  );
}