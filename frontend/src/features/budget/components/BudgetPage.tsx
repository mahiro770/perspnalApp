import { useState } from 'react';
import { Plus } from 'lucide-react';
import { getMonthRange } from '@/lib/date';
import { currentMonthKey } from '../api/mockData';
import { useBudgetSummary, useCategories, useGoal, useTransactions } from '../hooks/useBudget';
import { MonthSwitcher } from './MonthSwitcher';
import { SummaryCards } from './SummaryCards';
import { GoalCard } from './GoalCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TransactionList } from './TransactionList';
import { TransactionFormModal } from './TransactionFormModal';
import { Transaction } from '../api/types';

export function BudgetPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const { from, to } = getMonthRange(month);

  const { data: summary } = useBudgetSummary(month);
  const { data: goal } = useGoal(month);
  const { data: transactions = [] } = useTransactions(from, to);
  const { data: categories = [] } = useCategories();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>(undefined);

  function openCreate() {
    setEditingTx(undefined);
    setFormOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditingTx(tx);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-4 pb-16">
      <h1 className="hidden text-xl font-bold text-text md:block">家計簿</h1>
      <MonthSwitcher month={month} onChange={setMonth} />
      <SummaryCards totalIncome={summary?.totalIncome ?? 0} totalExpense={summary?.totalExpense ?? 0} />
      <GoalCard
        month={month}
        targetAmount={goal?.targetAmount ?? 0}
        balance={(summary?.totalIncome ?? 0) - (summary?.totalExpense ?? 0)}
      />
      <CategoryBreakdown items={summary?.byCategory ?? []} />
      <TransactionList transactions={transactions} categories={categories} onSelect={openEdit} />

      <button
        onClick={openCreate}
        aria-label="支出・収入を記録"
        className="fixed bottom-20 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 md:bottom-8"
      >
        <Plus className="h-6 w-6" />
      </button>

      <TransactionFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTx}
        defaultDate={undefined}
      />
    </div>
  );
}
