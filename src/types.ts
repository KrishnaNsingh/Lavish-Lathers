export interface Product {
  _id: string;

  registryId: string;

  name: string;

  shortDescription: string;

  detailedDescription: string;

  price: number;

  stock: number;

  category:
    | 'Herbal Soaps'
    | 'Essential Oils'
    | 'Gift Boxes'
    | 'Souvenirs';

  artistryType:
    | 'Skincare formulation'
    | 'Keepsake Souvenir';

  imageUrl: string;

  featured: boolean;

  souvenir: boolean;

  ingredients?: string[];

  benefits?: string[];

  customMessageAvailable: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };

  items: OrderItem[];

  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
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

export interface OrderItem {
  productId: string;
  registryId: string;

  name: string;

  price: number;

  quantity: number;

  isGift?: boolean;

  giftNote?: string;

  giftRecipient?: string;
}

export interface Order {
  _id: string;

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };

  items: OrderItem[];

  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  orderStatus:
  | "pending"
  | "packaging"
  | "shipped"
  | "delivered";

  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}
