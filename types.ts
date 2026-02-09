
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Men' | 'Women' | 'Accessories';
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AppState {
  cart: CartItem[];
  isCartOpen: boolean;
  view: 'shop' | 'checkout' | 'stylist';
}
