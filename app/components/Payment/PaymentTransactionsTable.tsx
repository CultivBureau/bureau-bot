'use client';

import { DollarSign, Check, X, Download } from 'lucide-react';
import { Button } from '../landing/ui/button';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
  description?: string;
}

interface PaymentTransactionsTableProps {
  transactions?: Transaction[];
}

// Mock transactions data - Replace with actual API call
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-01',
    amount: 49.99,
    status: 'paid',
    invoice: 'INV-001',
    description: 'Professional Plan - Monthly',
  },
  {
    id: '2',
    date: '2023-12-01',
    amount: 49.99,
    status: 'paid',
    invoice: 'INV-002',
    description: 'Professional Plan - Monthly',
  },
  {
    id: '3',
    date: '2023-11-01',
    amount: 49.99,
    status: 'paid',
    invoice: 'INV-003',
    description: 'Professional Plan - Monthly',
  },
  {
    id: '4',
    date: '2023-10-01',
    amount: 29.99,
    status: 'paid',
    invoice: 'INV-004',
    description: 'Starter Plan - Monthly',
  },
];

export function PaymentTransactionsTable({ transactions = mockTransactions }: PaymentTransactionsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Paid
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 rounded-full bg-yellow-500/15 px-3 py-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <span className="h-4 w-4 rounded-full bg-yellow-600 dark:bg-yellow-400 animate-pulse" />
            Pending
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400">
            <X className="h-4 w-4" />
            Failed
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-hero-text">Payment History</h2>
        <Button variant="outline" size="sm" className="rounded-full">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No payment history found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">Invoice</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-card-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-card-foreground">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-card-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-muted/50 transition"
                >
                  <td className="py-4 px-4 text-sm text-card-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-4 px-4 text-sm text-card-foreground">
                    {transaction.description || 'Subscription Payment'}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                    {transaction.invoice}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-card-foreground text-right">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-center">{getStatusBadge(transaction.status)}</td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => {
                        // TODO: Implement download invoice
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

