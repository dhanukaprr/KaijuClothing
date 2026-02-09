
import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  onCheckout 
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em]">Your Selection</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-widest">Bag is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-6">
                <div className="w-20 h-28 bg-gray-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                      <p className="text-[10px] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 text-gray-400 hover:text-black">-</button>
                      <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 text-gray-400 hover:text-black">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Subtotal</span>
              <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-red-600 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl"
            >
              Confirm & Checkout
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
