import type { Product, Category, CartItem, Sale, Settings, User, Customer } from '../types';

export const categoriesState = $state<Category[]>([
    { id: '1', name: 'Boissons' },
    { id: '2', name: 'Snacks' },
    { id: '3', name: 'Électronique' },
    { id: '4', name: 'Alimentation' },
]);

export const productsState = $state<Product[]>([
    { id: '1', name: 'Coca Cola 33cl', price: 15.5, barcode: '5449000000996', categoryId: '1', stock: 100, image: '/products/coca-cola.png' },
    { id: '2', name: 'Fanta 33cl', price: 14.5, barcode: '5449000012487', categoryId: '1', stock: 80, image: '/products/fanta.png' },
    { id: '3', name: 'Chips Lay\'s Classic', price: 12.0, barcode: '8410199000213', categoryId: '2', stock: 50 },
    { id: '4', name: 'Batterie Externe 10000mAh', price: 150.0, barcode: '6934177708510', categoryId: '3', stock: 20, image: '/products/powerbank.png' },
    { id: '5', name: 'Pain de Mie', price: 5.5, barcode: '3222472888631', categoryId: '4', stock: 30 },
]);

// Helper class for cart management
export class CartStore {
    items = $state<CartItem[]>([]);
    
    get total() {
        return this.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    }
    
    addItem(product: Product) {
        const existing = this.items.find((i: CartItem) => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
    }
    
    removeItem(productId: string) {
        this.items = this.items.filter((i: CartItem) => i.id !== productId);
    }
    
    updateQuantity(productId: string, quantity: number) {
        const item = this.items.find((i: CartItem) => i.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
        }
    }
    
    clear() {
        this.items = [];
    }
}

export const cart = new CartStore();

export const salesHistoryState = $state<Sale[]>([]);

export const settingsState = $state<Settings>({
    appName: 'G-POS Pro',
    appLogo: '🛍️',
    taxRate: 20,
    currency: 'USD'
});

export const currentUserState = $state<User | null>({
    id: 'u1',
    username: 'misa',
    role: 'ADMIN' // Default for development
});

export const customersState = $state<Customer[]>([]);
