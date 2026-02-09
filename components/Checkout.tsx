
import React, { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  onBack: () => void;
  items: CartItem[];
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, items, onComplete }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 25.00;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
        onComplete();
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <div className="flex justify-center">
            <CheckCircle2 size={80} className="text-green-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-widest">Order Confirmed</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for choosing Lumora. Your avant-garde selection is being prepared for shipment. You will receive a confirmation email shortly.
          </p>
          <button 
            onClick={onComplete}
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest mb-8 hover:text-gray-500 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Bag</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-xl font-display font-bold uppercase tracking-widest mb-6 flex items-center space-x-2">
                <Truck size={20} />
                <span>Shipping Details</span>
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input className="col-span-1 bg-white border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="First Name" required />
                <input className="col-span-1 bg-white border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="Last Name" required />
                <input className="col-span-2 bg-white border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="Street Address" required />
                <input className="col-span-1 bg-white border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="City" required />
                <input className="col-span-1 bg-white border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="Postal Code" required />
              </form>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold uppercase tracking-widest mb-6 flex items-center space-x-2">
                <CreditCard size={20} />
                <span>Payment Information</span>
              </h2>
              <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4">
                <div className="space-y-4">
                  <input className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="Card Number" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="bg-gray-50 border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="MM / YY" required />
                    <input className="bg-gray-50 border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-black" placeholder="CVC" required />
                  </div>
                </div>
              </div>
            </section>

            <button 
              onClick={handleSubmit}
              className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl flex items-center justify-center space-x-3"
            >
              <ShieldCheck size={20} />
              <span>Authorize Payment — ${total.toFixed(2)}</span>
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-8 sticky top-24 shadow-sm">
              <h2 className="text-lg font-display font-bold uppercase tracking-widest mb-8">Summary</h2>
              <div className="space-y-6 mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-gray-50">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider">{item.name}</p>
                        <p className="text-[10px] text-gray-400">QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                  <span>Priority Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold uppercase tracking-widest pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
