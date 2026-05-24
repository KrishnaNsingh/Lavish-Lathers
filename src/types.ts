export interface Product {
  id: string;
  name: string;
  type: 'skincare' | 'souvenir' | 'giftbox' | 'other';
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string; // Dynamic marketing text
  ingredients?: string[];
  benefits?: string[];
  images: string[];
  stock: number;
  isBestSeller?: boolean;
  isCollectible?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isGift: boolean;
  giftNote?: string;
  giftRecipient?: string;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingDetails: CheckoutDetails;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  paymentId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'processing' | 'shipped' | 'delivered';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}
