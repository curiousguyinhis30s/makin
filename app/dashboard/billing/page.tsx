"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  X,
  Loader2,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock data for demo
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInvoices([
        {
          id: "1",
          invoiceNumber: "INV-2024-001",
          amount: 2500,
          status: "PENDING",
          dueDate: "2024-02-15",
          createdAt: "2024-01-15",
          description: "HR Services - January 2024",
        },
        {
          id: "2",
          invoiceNumber: "INV-2024-002",
          amount: 1800,
          status: "PAID",
          dueDate: "2024-01-31",
          createdAt: "2024-01-01",
          description: "Government Relations Services",
        },
        {
          id: "3",
          invoiceNumber: "INV-2023-012",
          amount: 3200,
          status: "PAID",
          dueDate: "2023-12-31",
          createdAt: "2023-12-01",
          description: "Annual Accounting Package",
        },
        {
          id: "4",
          invoiceNumber: "INV-2024-003",
          amount: 950,
          status: "OVERDUE",
          dueDate: "2024-01-10",
          createdAt: "2023-12-25",
          description: "Legal Consultation",
        },
      ]);

      setPaymentMethods([
        {
          id: "1",
          type: "card",
          last4: "4242",
          brand: "Visa",
          isDefault: true,
        },
        {
          id: "2",
          type: "bank",
          last4: "7890",
          bankName: "Al Rajhi Bank",
          isDefault: false,
        },
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "OVERDUE":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const handlePayment = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update invoice status
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice?.id ? { ...inv, status: "PAID" } : inv
      )
    );

    setIsProcessing(false);
    setPaymentSuccess(true);

    // Close modal after showing success
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setSelectedInvoice(null);
    }, 2000);
  };

  const totalPending = invoices
    .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Billing & Payments
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your invoices and payment methods
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-1">
              Outstanding Balance
            </p>
            <p className="text-2xl font-bold text-foreground">
              SAR {totalPending.toLocaleString()}
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">
              SAR {totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Invoices</p>
            <p className="text-2xl font-bold text-foreground">
              {invoices.filter((i) => i.status !== "PAID").length}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Invoices Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Invoices
              </h2>

              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-foreground">
                            {invoice.invoiceNumber}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-foreground">
                          SAR {invoice.amount.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {invoice.status !== "PAID" && (
                            <button
                              onClick={() => handlePayment(invoice)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Payment Methods
                </h2>
                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-xl transition-colors ${
                      method.isDefault
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {method.type === "card" ? (
                        <CreditCard className="w-8 h-8 text-primary" />
                      ) : (
                        <Building2 className="w-8 h-8 text-primary" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {method.type === "card"
                            ? `${method.brand} •••• ${method.last4}`
                            : `${method.bankName} •••• ${method.last4}`}
                        </p>
                        {method.isDefault && (
                          <p className="text-xs text-primary">Default</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="w-full p-3 text-left text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors">
                  Download All Invoices
                </button>
                <button className="w-full p-3 text-left text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors">
                  Request Statement
                </button>
                <button className="w-full p-3 text-left text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors">
                  Update Billing Address
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedInvoice && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowPaymentModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-panel rounded-2xl shadow-2xl z-50 p-6"
              >
                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-muted-foreground">
                      Your payment has been processed successfully.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground">
                        Pay Invoice
                      </h2>
                      <button
                        onClick={() => setShowPaymentModal(false)}
                        disabled={isProcessing}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-xl mb-6">
                      <p className="text-sm text-muted-foreground">
                        {selectedInvoice.invoiceNumber}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        SAR {selectedInvoice.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedInvoice.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-medium text-foreground mb-3">
                        Select Payment Method
                      </p>
                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              defaultChecked={method.isDefault}
                              className="text-primary"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {method.type === "card" ? (
                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className="text-foreground">
                                {method.type === "card"
                                  ? `${method.brand} •••• ${method.last4}`
                                  : `${method.bankName} •••• ${method.last4}`}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={processPayment}
                      disabled={isProcessing}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay SAR {selectedInvoice.amount.toLocaleString()}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      This is a demo payment. No real transaction will occur.
                    </p>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
