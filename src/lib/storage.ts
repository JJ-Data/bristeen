// ============================================================
// INVENTORY
// ============================================================
export type Category = "Spices" | "Vegetables" | "Meat" | "Wines" | "Dry Goods" | "Dairy" | "Other";

export interface InventoryItem {
    id: string;
    name: string;
    category: Category;
    quantity: number;
    unit: string;
    minStock: number;
    price: number;
    lastUpdated: string;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
    { id: "1", name: "Thyme", category: "Spices", quantity: 50, unit: "jars", minStock: 10, price: 1200, lastUpdated: new Date().toISOString() },
    { id: "2", name: "Basmati Rice", category: "Dry Goods", quantity: 12, unit: "bags", minStock: 5, price: 45000, lastUpdated: new Date().toISOString() },
    { id: "3", name: "Red Wine (Merlot)", category: "Wines", quantity: 8, unit: "bottles", minStock: 12, price: 8500, lastUpdated: new Date().toISOString() },
    { id: "4", name: "Fresh Tomatoes", category: "Vegetables", quantity: 5, unit: "crates", minStock: 2, price: 15000, lastUpdated: new Date().toISOString() },
    { id: "5", name: "Chicken Breast", category: "Meat", quantity: 20, unit: "kg", minStock: 15, price: 3500, lastUpdated: new Date().toISOString() },
];

const STORAGE_KEY = "bristeen_inventory_v1";

export type TransactionType = 'restock' | 'usage' | 'adjustment' | 'correction';

export interface InventoryTransaction {
    id: string;
    itemId: string;
    itemName: string;
    amount: number;
    type: TransactionType;
    date: string;
    note?: string;
}

const HISTORY_KEY = "bristeen_inventory_history_v1";

export const historyStorage = {
    getAll: (): InventoryTransaction[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(HISTORY_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    },
    add: (transaction: Omit<InventoryTransaction, "id" | "date">) => {
        const history = historyStorage.getAll();
        const newTransaction: InventoryTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        const newHistory = [newTransaction, ...history];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newTransaction;
    },
    getByItem: (itemId: string) => {
        return historyStorage.getAll().filter(h => h.itemId === itemId);
    },
    getUsageStats: (days: number = 7) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return historyStorage.getAll().filter(h =>
            h.type === 'usage' && new Date(h.date) >= cutoff
        );
    }
};

export const inventoryStorage = {
    getAll: (): InventoryItem[] => {
        if (typeof window === "undefined") return INITIAL_INVENTORY;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
            return INITIAL_INVENTORY;
        }
        return JSON.parse(stored);
    },
    add: (item: InventoryItem) => {
        const items = inventoryStorage.getAll();
        const newItems = [item, ...items];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        historyStorage.add({ itemId: item.id, itemName: item.name, amount: item.quantity, type: 'restock', note: 'Initial Stock' });
        return newItems;
    },
    update: (id: string, updates: Partial<InventoryItem>) => {
        const items = inventoryStorage.getAll();
        const newItems = items.map(item => item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
    },
    delete: (id: string) => {
        const items = inventoryStorage.getAll().filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return items;
    },
};

// ============================================================
// MENU ITEMS
// ============================================================
export type MenuCategory = "Starter" | "Main" | "Dessert" | "Drink" | "Side";

export interface MenuItem {
    id: string;
    name: string;
    category: MenuCategory;
    price: number;
    description?: string;
}

export const MENU_ITEMS: MenuItem[] = [
    { id: "m1",  name: "Jollof Rice (Special)",    category: "Main",    price: 4500,  description: "Signature smoky party jollof" },
    { id: "m2",  name: "Pounded Yam & Egusi",       category: "Main",    price: 5500,  description: "With assorted meat" },
    { id: "m3",  name: "Grilled Chicken",            category: "Main",    price: 6000,  description: "Marinated & grilled to perfection" },
    { id: "m4",  name: "Fried Rice",                 category: "Main",    price: 4000,  description: "With mixed vegetables & protein" },
    { id: "m5",  name: "Pepper Soup",                category: "Starter", price: 3500,  description: "Spicy catfish or goat meat" },
    { id: "m6",  name: "Asun",                       category: "Starter", price: 4000,  description: "Spicy peppered goat meat" },
    { id: "m7",  name: "Spring Rolls (6 pcs)",       category: "Starter", price: 2800,  description: "Freshly fried vegetable rolls" },
    { id: "m8",  name: "Fruit Salad",                category: "Dessert", price: 2000,  description: "Seasonal fresh fruits" },
    { id: "m9",  name: "Puff Puff",                  category: "Dessert", price: 1200,  description: "Warm & fluffy, lightly sweetened" },
    { id: "m10", name: "Chapman",                    category: "Drink",   price: 1500,  description: "Classic Nigerian Chapman" },
    { id: "m11", name: "Zobo (Bottle)",              category: "Drink",   price: 800,   description: "Hibiscus drink, chilled" },
    { id: "m12", name: "Malt Drink",                 category: "Drink",   price: 600,   description: "Chilled malt" },
    { id: "m13", name: "Moi Moi",                    category: "Side",    price: 1500,  description: "Steamed bean pudding" },
    { id: "m14", name: "Coleslaw",                   category: "Side",    price: 1200,  description: "Creamy vegetable coleslaw" },
    { id: "m15", name: "Chin Chin (Pack)",           category: "Side",    price: 1000,  description: "Freshly fried assorted chin chin" },
];

// ============================================================
// ORDERS
// ============================================================
export type OrderStatus = "Pending" | "In Progress" | "Ready" | "Delivered" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid";

export interface OrderItem {
    menuItemId: string;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    tableNumber?: string;
    items: OrderItem[];
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

const ORDER_KEY = "bristeen_orders_v1";
const TAX_RATE = 0.075; // 7.5% VAT

export const orderStorage = {
    getAll: (): Order[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(ORDER_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    },

    add: (order: Omit<Order, "id" | "orderNumber" | "subtotal" | "tax" | "total" | "createdAt" | "updatedAt">): Order => {
        const orders = orderStorage.getAll();
        const subtotal = order.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        const newOrder: Order = {
            ...order,
            id: crypto.randomUUID(),
            orderNumber: `ORD-${String(orders.length + 1001).padStart(5, '0')}`,
            subtotal,
            tax,
            total,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(ORDER_KEY, JSON.stringify([newOrder, ...orders]));
        return newOrder;
    },

    update: (id: string, updates: Partial<Order>): Order[] => {
        const orders = orderStorage.getAll();
        const newOrders = orders.map(o =>
            o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
        );
        localStorage.setItem(ORDER_KEY, JSON.stringify(newOrders));
        return newOrders;
    },

    delete: (id: string): Order[] => {
        const orders = orderStorage.getAll().filter(o => o.id !== id);
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
        return orders;
    },
};

// ============================================================
// CATERING EVENTS
// ============================================================
export type EventStatus = "Inquiry" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
export type MenuPackage = "Basic" | "Standard" | "Premium" | "Custom";

export interface CateringEvent {
    id: string;
    eventName: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    eventDate: string;
    venue: string;
    guestCount: number;
    menuPackage: MenuPackage;
    status: EventStatus;
    budget: number;
    deposit: number;
    notes?: string;
    createdAt: string;
}

const EVENT_KEY = "bristeen_events_v1";

export const eventStorage = {
    getAll: (): CateringEvent[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(EVENT_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    },

    add: (event: Omit<CateringEvent, "id" | "createdAt">): CateringEvent => {
        const events = eventStorage.getAll();
        const newEvent: CateringEvent = {
            ...event,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem(EVENT_KEY, JSON.stringify([newEvent, ...events]));
        return newEvent;
    },

    update: (id: string, updates: Partial<CateringEvent>): CateringEvent[] => {
        const events = eventStorage.getAll();
        const newEvents = events.map(e => e.id === id ? { ...e, ...updates } : e);
        localStorage.setItem(EVENT_KEY, JSON.stringify(newEvents));
        return newEvents;
    },

    delete: (id: string): CateringEvent[] => {
        const events = eventStorage.getAll().filter(e => e.id !== id);
        localStorage.setItem(EVENT_KEY, JSON.stringify(events));
        return events;
    },
};
