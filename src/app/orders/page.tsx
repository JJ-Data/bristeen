"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart, Plus, Search, ChefHat, Clock, CheckCircle2,
    Truck, XCircle, Package, FileText, MoreVertical, Phone
} from "lucide-react";
import { orderStorage, MENU_ITEMS, type Order, type OrderStatus, type MenuItem } from "@/lib/storage";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
    "Pending":    { label: "Pending",     color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", icon: Clock },
    "In Progress":{ label: "In Progress", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",         icon: ChefHat },
    "Ready":      { label: "Ready",       color: "bg-primary/10 text-primary border-primary/20",                                icon: Package },
    "Delivered":  { label: "Delivered",   color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",     icon: CheckCircle2 },
    "Cancelled":  { label: "Cancelled",   color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",             icon: XCircle },
};

type CartItem = { item: MenuItem; qty: number };

function formatCurrency(n: number) {
    return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
    const [showNewOrder, setShowNewOrder] = useState(false);
    const [showDetail, setShowDetail] = useState<Order | null>(null);
    const [mounted, setMounted] = useState(false);

    // New order form state
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [menuSearch, setMenuSearch] = useState("");
    const [menuTab, setMenuTab] = useState<"All" | "Starter" | "Main" | "Side" | "Dessert" | "Drink">("All");

    useEffect(() => {
        setMounted(true);
        setOrders(orderStorage.getAll());
    }, []);

    if (!mounted) return <div className="flex items-center justify-center h-screen"><div className="text-muted-foreground">Loading...</div></div>;

    const filtered = orders.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            o.orderNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "All" || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const todayStr = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
    const todayRevenue = todayOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const inProgressCount = orders.filter(o => o.status === "In Progress").length;

    // Cart helpers
    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
            return [...prev, { item, qty: 1 }];
        });
    };
    const removeFromCart = (id: string) => setCart(prev => prev.filter(c => c.item.id !== id));
    const updateQty = (id: string, qty: number) => {
        if (qty <= 0) return removeFromCart(id);
        setCart(prev => prev.map(c => c.item.id === id ? { ...c, qty } : c));
    };
    const cartSubtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
    const cartTax = cartSubtotal * 0.075;
    const cartTotal = cartSubtotal + cartTax;

    const filteredMenu = MENU_ITEMS.filter(m =>
        (menuTab === "All" || m.category === menuTab) &&
        m.name.toLowerCase().includes(menuSearch.toLowerCase())
    );

    const handleSubmitOrder = () => {
        if (!customerName.trim() || cart.length === 0) return;
        const newOrder = orderStorage.add({
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim() || undefined,
            tableNumber: tableNumber.trim() || undefined,
            items: cart.map(c => ({ menuItemId: c.item.id, menuItemName: c.item.name, quantity: c.qty, unitPrice: c.item.price })),
            status: "Pending",
            paymentStatus: "Unpaid",
            notes: notes.trim() || undefined,
        });
        setOrders(orderStorage.getAll());
        setShowNewOrder(false);
        setCustomerName(""); setCustomerPhone(""); setTableNumber(""); setNotes(""); setCart([]);
    };

    const updateOrderStatus = (id: string, status: OrderStatus) => {
        orderStorage.update(id, { status });
        setOrders(orderStorage.getAll());
        if (showDetail?.id === id) setShowDetail(prev => prev ? { ...prev, status } : null);
    };

    const STATUSES: OrderStatus[] = ["Pending", "In Progress", "Ready", "Delivered", "Cancelled"];

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">Orders</h1>
                    <p className="text-muted-foreground text-lg">Manage restaurant orders in real-time</p>
                </div>
                <Button
                    size="lg"
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 group"
                    onClick={() => setShowNewOrder(true)}
                >
                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Order
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Orders Today", value: todayOrders.length, icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                    { label: "In Progress", value: inProgressCount, icon: ChefHat, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Revenue Today", value: formatCurrency(todayRevenue), icon: FileText, color: "text-green-500", bg: "bg-green-500/10", wide: true },
                ].map((stat, i) => (
                    <Card key={i} className={cn("group relative overflow-hidden bg-card border-border", (stat as any).wide && "col-span-2 md:col-span-1")}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold font-heading text-foreground">{stat.value}</div>
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
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search orders or customer..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["All", ...STATUSES] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s as any)}
                            className={cn(
                                "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                filterStatus === s
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                            )}
                        >{s}</button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <Card className="bg-card border-border">
                        <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <ShoppingCart className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground text-lg">No orders found</p>
                                <p className="text-muted-foreground text-sm mt-1">
                                    {orders.length === 0 ? "Create your first order to get started." : "Try adjusting your search or filter."}
                                </p>
                            </div>
                            {orders.length === 0 && (
                                <Button onClick={() => setShowNewOrder(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Plus className="mr-2 h-4 w-4" /> New Order
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : filtered.map(order => {
                    const cfg = STATUS_CONFIG[order.status];
                    const Icon = cfg.icon;
                    return (
                        <Card key={order.id} className="group bg-card border-border hover:border-primary/30 transition-all cursor-pointer" onClick={() => setShowDetail(order)}>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <ShoppingCart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-foreground font-heading">{order.orderNumber}</span>
                                            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1", cfg.color)}>
                                                <Icon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium",
                                                order.paymentStatus === "Paid" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                    order.paymentStatus === "Partial" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                                                        "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                            {order.customerName}
                                            {order.tableNumber && ` · Table ${order.tableNumber}`}
                                            {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-bold text-foreground font-heading">{formatCurrency(order.total)}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{timeAgo(order.createdAt)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* ── New Order Dialog ── */}
            {showNewOrder && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-8 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl my-4">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-foreground">New Order</h2>
                                <p className="text-sm text-muted-foreground">Select items and fill in customer details</p>
                            </div>
                            <button onClick={() => setShowNewOrder(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 grid gap-6 md:grid-cols-[1fr_300px]">
                            {/* Left - Menu */}
                            <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    {(["All", "Starter", "Main", "Side", "Dessert", "Drink"] as const).map(t => (
                                        <button key={t} onClick={() => setMenuTab(t)}
                                            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                                menuTab === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"
                                            )}>{t}</button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Search menu..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                                    {filteredMenu.map(item => {
                                        const inCart = cart.find(c => c.item.id === item.id);
                                        return (
                                            <button key={item.id} onClick={() => addToCart(item)}
                                                className={cn("text-left p-3 rounded-xl border transition-all", inCart
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                                                )}>
                                                <div className="font-medium text-sm text-foreground">{item.name}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                                                <div className="text-xs text-primary font-semibold mt-1">{formatCurrency(item.price)}</div>
                                                {inCart && <div className="text-xs text-primary mt-1">× {inCart.qty} in cart</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right - Cart + Customer */}
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-foreground">Customer Name *</label>
                                    <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter name..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                                        <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="08..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Table #</label>
                                        <input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. 5" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                </div>

                                {/* Cart items */}
                                {cart.length > 0 && (
                                    <div className="space-y-2 max-h-36 overflow-y-auto">
                                        {cart.map(c => (
                                            <div key={c.item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium text-foreground truncate">{c.item.name}</div>
                                                    <div className="text-xs text-muted-foreground">{formatCurrency(c.item.price)} each</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => updateQty(c.item.id, c.qty - 1)} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-xs font-bold">−</button>
                                                    <span className="text-sm font-medium text-foreground w-6 text-center">{c.qty}</span>
                                                    <button onClick={() => updateQty(c.item.id, c.qty + 1)} className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 text-xs font-bold">+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {cart.length > 0 && (
                                    <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1 text-sm">
                                        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
                                        <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>{formatCurrency(cartTax)}</span></div>
                                        <div className="flex justify-between font-bold text-foreground border-t border-border pt-1 mt-1"><span>Total</span><span className="text-primary">{formatCurrency(cartTotal)}</span></div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special requests..." rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                                </div>

                                <Button
                                    onClick={handleSubmitOrder}
                                    disabled={!customerName.trim() || cart.length === 0}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Place Order {cart.length > 0 && `· ${formatCurrency(cartTotal)}`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Order Detail Dialog ── */}
            {showDetail && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-8 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl my-4">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-foreground">{showDetail.orderNumber}</h2>
                                <p className="text-sm text-muted-foreground">{new Date(showDetail.createdAt).toLocaleString("en-NG")}</p>
                            </div>
                            <button onClick={() => setShowDetail(null)} className="text-muted-foreground hover:text-foreground">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Customer */}
                            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
                                <p className="font-semibold text-foreground">{showDetail.customerName}</p>
                                {showDetail.customerPhone && <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{showDetail.customerPhone}</p>}
                                {showDetail.tableNumber && <p className="text-sm text-muted-foreground">Table {showDetail.tableNumber}</p>}
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">Items Ordered</h3>
                                <div className="space-y-2">
                                    {showDetail.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-foreground">{item.menuItemName} × {item.quantity}</span>
                                            <span className="text-muted-foreground">{formatCurrency(item.unitPrice * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-border space-y-1 text-sm">
                                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(showDetail.subtotal)}</span></div>
                                    <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>{formatCurrency(showDetail.tax)}</span></div>
                                    <div className="flex justify-between font-bold text-foreground text-base"><span>Total</span><span className="text-primary">{formatCurrency(showDetail.total)}</span></div>
                                </div>
                            </div>

                            {/* Status update */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">Update Status</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {STATUSES.map(s => {
                                        const cfg = STATUS_CONFIG[s];
                                        return (
                                            <button key={s} onClick={() => updateOrderStatus(showDetail.id, s)}
                                                className={cn("px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                                    showDetail.status === s ? cn("border-primary text-foreground", cfg.color) : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                                                )}>{s}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {showDetail.notes && (
                                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">Notes</p>
                                    <p className="text-sm text-foreground">{showDetail.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
