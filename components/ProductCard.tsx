
import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative flex flex-col bg-white">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur shadow-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="mt-4 flex flex-col space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 tracking-tight uppercase">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
