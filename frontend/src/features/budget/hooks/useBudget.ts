import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionType, NewTransactionInput, Category } from '../api/types';
import {
  createCategory,
  createTransaction,
  deleteTransaction,
  fetchBudgetSummary,
  fetchCategories,
  fetchTransactions,
  updateTransaction,
} from '../api/budgetApi';

export function useTransactions(from?: string, to?: string, type?: TransactionType) {
  return useQuery({
    queryKey: ['budget', 'transactions', from, to, type],
    queryFn: () => fetchTransactions({ from, to, type }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['budget', 'categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000,
  });
}

export function useBudgetSummary(month: string) {
  return useQuery({
    queryKey: ['budget', 'summary', month],
    queryFn: () => fetchBudgetSummary(month),
  });
}

function useInvalidateBudget() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['budget'] });
}

export function useCreateTransaction() {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: (input: NewTransactionInput) => createTransaction(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: NewTransactionInput }) => updateTransaction(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: invalidate,
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: (input: Omit<Category, 'id'>) => createCategory(input),
    onSuccess: invalidate,
  });
}
