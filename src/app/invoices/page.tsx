"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText, Search, Printer, CheckCircle2, Clock, XCircle,
    Download, Eye, ChevronDown
} from "lucide-react";
import { orderStorage, type Order, type PaymentStatus } from "@/lib/storage";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
    return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

const PAYMENT_CONFIG: Record<PaymentStatus, { color: string; icon: React.ElementType }> = {
    "Unpaid":  { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",    icon: XCircle },
    "Partial": { color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", icon: Clock },
    "Paid":    { color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", icon: CheckCircle2 },
};

export default function InvoicesPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [filterPayment, setFilterPayment] = useState<PaymentStatus | "All">("All");
    const [viewInvoice, setViewInvoice] = useState<Order | null>(null);
    const [mounted, setMounted] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setOrders(orderStorage.getAll());
    }, []);

    if (!mounted) return <div className="flex items-center justify-center h-screen"><div className="text-muted-foreground">Loading...</div></div>;

    const filtered = orders.filter(o => {
        const invNum = `INV-${o.orderNumber.replace("ORD-", "")}`;
        const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            invNum.toLowerCase().includes(search.toLowerCase()) ||
            o.orderNumber.toLowerCase().includes(search.toLowerCase());
        const matchPayment = filterPayment === "All" || o.paymentStatus === filterPayment;
        return matchSearch && matchPayment;
    });

    const totalRevenue = orders.filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
    const unpaidCount = orders.filter(o => o.paymentStatus === "Unpaid").length;
    const unpaidAmount = orders.filter(o => o.paymentStatus === "Unpaid").reduce((s, o) => s + o.total, 0);

    const markPayment = (id: string, paymentStatus: PaymentStatus) => {
        orderStorage.update(id, { paymentStatus });
        setOrders(orderStorage.getAll());
        if (viewInvoice?.id === id) setViewInvoice(prev => prev ? { ...prev, paymentStatus } : null);
    };

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
            <head>
                <title>Invoice - ${viewInvoice?.orderNumber}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Arial', sans-serif; color: #1a1a1a; padding: 40px; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #e09420; padding-bottom: 24px; }
                    .brand-name { font-size: 28px; font-weight: 800; color: #e09420; }
                    .brand-sub { font-size: 14px; color: #666; margin-top: 4px; }
                    .invoice-label { font-size: 32px; font-weight: 700; color: #1a1a1a; text-align: right; }
                    .invoice-meta { text-align: right; color: #666; font-size: 13px; margin-top: 6px; }
                    .section { margin-bottom: 24px; }
                    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #999; margin-bottom: 8px; }
                    .customer-name { font-size: 18px; font-weight: 600; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th { background: #f7f4ef; text-align: left; padding: 10px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
                    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; }
                    .totals { margin-left: auto; width: 280px; }
                    .totals tr td { padding: 6px 14px; }
                    .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #e09420; padding-top: 12px; color: #e09420; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                    .paid { background: #dcfce7; color: #16a34a; }
                    .unpaid { background: #fee2e2; color: #dc2626; }
                </style>
            </head>
            <body>${content.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    const invoiceNumber = (order: Order) => `INV-${order.orderNumber.replace("ORD-", "")}`;

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">Invoices</h1>
                    <p className="text-muted-foreground text-lg">View and manage all billing records</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {[
                    { label: "Total Invoices", value: orders.length, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Revenue Collected", value: formatCurrency(totalRevenue), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Outstanding", value: `${unpaidCount} · ${formatCurrency(unpaidAmount)}`, icon: Clock, color: "text-red-500", bg: "bg-red-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="group relative overflow-hidden bg-card border-border">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <div className="text-xl font-bold font-heading text-foreground">{stat.value}</div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice or customer..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="flex gap-2">
                    {(["All", "Unpaid", "Partial", "Paid"] as const).map(s => (
                        <button key={s} onClick={() => setFilterPayment(s)}
                            className={cn("px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                filterPayment === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                            )}>{s}</button>
                    ))}
                </div>
            </div>

            {/* Invoice Table */}
            <Card className="bg-card border-border overflow-hidden">
                {filtered.length === 0 ? (
                    <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-lg">No invoices found</p>
                            <p className="text-muted-foreground text-sm mt-1">Invoices are generated automatically when you create orders.</p>
                        </div>
                    </CardContent>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    {["Invoice #", "Order #", "Customer", "Date", "Amount", "Payment", "Actions"].map(h => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order, i) => {
                                    const cfg = PAYMENT_CONFIG[order.paymentStatus];
                                    const Icon = cfg.icon;
                                    return (
                                        <tr key={order.id} className={cn("border-b border-border hover:bg-muted/20 transition-colors", i % 2 === 0 ? "" : "bg-muted/5")}>
                                            <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">{invoiceNumber(order)}</td>
                                            <td className="px-5 py-4 text-sm text-muted-foreground">{order.orderNumber}</td>
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-sm text-foreground">{order.customerName}</div>
                                                {order.customerPhone && <div className="text-xs text-muted-foreground">{order.customerPhone}</div>}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                            <td className="px-5 py-4 font-semibold text-foreground font-heading whitespace-nowrap">{formatCurrency(order.total)}</td>
                                            <td className="px-5 py-4">
                                                <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 w-fit", cfg.color)}>
                                                    <Icon className="h-3 w-3" />
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setViewInvoice(order)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="View Invoice">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {order.paymentStatus !== "Paid" && (
                                                        <button onClick={() => markPayment(order.id, "Paid")}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all border border-green-500/20">
                                                            Mark Paid
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* ── Invoice View Modal ── */}
            {viewInvoice && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-8 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl my-4">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                            <h2 className="text-lg font-bold font-heading">{invoiceNumber(viewInvoice)}</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                                    <Printer className="h-4 w-4" /> Print
                                </Button>
                                {viewInvoice.paymentStatus !== "Paid" && (
                                    <Button size="sm" onClick={() => markPayment(viewInvoice.id, "Paid")} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                        <CheckCircle2 className="h-4 w-4" /> Mark Paid
                                    </Button>
                                )}
                                <button onClick={() => setViewInvoice(null)} className="text-muted-foreground hover:text-foreground ml-2">
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Printable Invoice Content */}
                        <div ref={printRef} className="p-8 space-y-8">
                            {/* Invoice header */}
                            <div className="flex justify-between items-start pb-6 border-b-2 border-primary">
                                <div>
                                    <div className="text-2xl font-bold text-primary font-heading">Bristeen Catering</div>
                                    <div className="text-sm text-muted-foreground mt-1">Premium Catering & Restaurant Services</div>
                                    <div className="text-xs text-muted-foreground mt-3 space-y-0.5">
                                        <div>Lagos, Nigeria</div>
                                        <div>info@bristeen.com</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-foreground">INVOICE</div>
                                    <div className="text-sm text-muted-foreground mt-2 space-y-0.5">
                                        <div className="font-mono font-semibold text-primary">{invoiceNumber(viewInvoice)}</div>
                                        <div>Date: {formatDate(viewInvoice.createdAt)}</div>
                                        <div>Order: {viewInvoice.orderNumber}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Billed To */}
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Billed To</p>
                                <p className="text-lg font-semibold text-foreground">{viewInvoice.customerName}</p>
                                {viewInvoice.customerPhone && <p className="text-sm text-muted-foreground">{viewInvoice.customerPhone}</p>}
                                {viewInvoice.tableNumber && <p className="text-sm text-muted-foreground">Table {viewInvoice.tableNumber}</p>}
                            </div>

                            {/* Items */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50 rounded-lg">
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground rounded-l-lg">Item</th>
                                        <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Qty</th>
                                        <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Unit Price</th>
                                        <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground rounded-r-lg">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewInvoice.items.map((item, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="px-4 py-3 text-foreground">{item.menuItemName}</td>
                                            <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</td>
                                            <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(item.unitPrice * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="ml-auto w-64 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span><span>{formatCurrency(viewInvoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>VAT (7.5%)</span><span>{formatCurrency(viewInvoice.tax)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-primary border-t-2 border-primary pt-2">
                                    <span>Total</span><span>{formatCurrency(viewInvoice.total)}</span>
                                </div>
                                <div className={cn("text-center text-xs px-3 py-1.5 rounded-full border font-semibold mt-2",
                                    PAYMENT_CONFIG[viewInvoice.paymentStatus].color)}>
                                    {viewInvoice.paymentStatus}
                                </div>
                            </div>

                            {viewInvoice.notes && (
                                <div className="p-4 rounded-xl border border-border bg-muted/30">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Notes</p>
                                    <p className="text-sm text-foreground">{viewInvoice.notes}</p>
                                </div>
                            )}

                            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
                                Thank you for choosing Bristeen Catering. We look forward to serving you again.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
