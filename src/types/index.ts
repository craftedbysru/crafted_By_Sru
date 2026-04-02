export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  image?: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  items: any;
  total: number;
  status: string;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: string;
  shippingAddress: any;
  createdAt: Date;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  userId: string;
}
