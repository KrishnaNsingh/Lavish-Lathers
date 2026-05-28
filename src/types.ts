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
