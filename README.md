# Personal Finance Visualizer

A simple, responsive web application built with Next.js and React for tracking personal finances, visualizing spending habits, and managing budgets.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)

---

## About the Project

The Personal Finance Visualizer is designed to help users gain better insights into their income and expenses. It provides tools to add and manage transactions, view a dashboard summary, analyze spending by category and over time, set monthly budgets, and compare actual spending against those budgets.

---

## Features

### Transaction Management:

- Add new income and expense transactions with description, amount, date, type, and category.
- Edit existing transactions.
- Delete transactions.
- View a list of all recorded transactions.

### Dashboard Summary:

- Quick overview of total income, total expenses, and net balance.
- Displays the most recent transaction for quick reference.

### Category Pie Charts:

- Visualizes income distribution by category.
- Visualizes expense distribution by category.

### Monthly Bar Chart:

- Compares total income and total expenses on a monthly basis.

### Budgeting:

- Set monthly budgets for different spending categories.
- Budgets are saved per month and can be adjusted.

### Budget Comparison Chart:

- Compares actual spending against set budgets for each category per month.

### Spending Insights:

- Provides actionable insights, highlighting categories where you've overspent or how much of your budget you've utilized.

### Responsive Design:

- Optimized for various screen sizes (mobile, tablet, desktop).

### Error States:

- Graceful handling of scenarios like no data available for charts.

---

## Tech Stack

- **Framework**: Next.js (React Framework)
- **UI Components**: shadcn/ui
- **Charting Library**: Recharts
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **Form Management**: React Hook Form
- **Icons**: React Icons (FaExclamationCircle)

---

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/personal-finance-visualizer.git](https://github.com/your-username/personal-finance-visualizer.git)
    cd personal-finance-visualizer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  **Open in your browser:**
    The application will be accessible at `http://localhost:3000`.

---

## Usage

- **Add Transactions**: Use the "Transaction Form" section to input your income and expenses. Fill in the description, amount, date, type (Income/Expense), and category. Click "Add Transaction".
- **View Transactions**: Your added transactions will appear in the "Transaction List" on the right. You can "Edit" or "Delete" them as needed.
- **Dashboard Summary**: See your overall financial health at a glance in the "Dashboard Summary" section.
- **Analyze Spending**:
  - The "Category Pie Charts" show how your income and expenses are distributed across different categories.
  - The "Monthly Overview" bar chart provides a visual comparison of your total income versus total expenses each month.
- **Set Budgets**: Use the "Set Monthly Budgets" form to define how much you plan to spend in each category for a selected month. Remember to click "Save Budget".
- **Budget Comparison**: The "Budget vs Actual" chart visually compares your actual spending against the budgets you've set.
- **Get Insights**: The "Spending Insights" section provides textual feedback on your spending habits, highlighting overspending or budget utilization.
