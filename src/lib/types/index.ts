export interface Product {
    id: string;
    name: string;
    price: number;
    barcode: string;
    categoryId: string;
    stock: number;
    image?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Sale {
    id: string;
    timestamp: Date;
    items: CartItem[];
    total: number;
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE' | 'BANK';
    sellerId: string;
    customerId?: string;
    taxAmount: number;
}

export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
}

export interface Settings {
    appName: string;
    appLogo: string;
    taxRate: number;
    currency: string;
}

export interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'SELLER';
}
