
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import AIStylist from './components/AIStylist.tsx';
import Checkout from './components/Checkout.tsx';
import { PRODUCTS } from './data/products.ts';
import { Product, CartItem, AppState } from './types.ts';
import { ChevronRight, ChevronLeft, Sparkles, ShoppingCart } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    cart: [],
    isCartOpen: false,
    view: 'shop'
  });
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState<Product['category'] | 'All'>('All');

  const filteredProducts = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  
  useEffect(() => {
    if (activeIdx >= filteredProducts.length) {
      setActiveIdx(0);
    }
  }, [filter, filteredProducts.length, activeIdx]);

  const product = filteredProducts[activeIdx] || PRODUCTS[0];

  const addToCart = useCallback((prod: Product) => {
    setState(prev => {
      const existing = prev.cart.find(item => item.id === prod.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item),
          isCartOpen: true
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { ...prod, quantity: 1 }],
        isCartOpen: true
      };
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== id)
    }));
  }, []);

  const nextProduct = () => {
    setActiveIdx((prev) => (prev + 1) % filteredProducts.length);
  };

  const prevProduct = () => {
    setActiveIdx((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  if (state.view === 'checkout') {
    return (
      <Checkout 
        items={state.cart} 
        onBack={() => setState(prev => ({ ...prev, view: 'shop' }))} 
        onComplete={() => setState(prev => ({ ...prev, view: 'shop', cart: [], isCartOpen: false }))} 
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <Navbar 
        cartCount={state.cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setState(prev => ({ ...prev, isCartOpen: true }))}
        onGoHome={() => { setFilter('All'); setActiveIdx(0); }}
        onSetFilter={(cat) => { setFilter(cat); setActiveIdx(0); }}
      />

      <main className="flex-1 flex overflow-hidden">
        <section className="relative w-full lg:w-3/4 bg-[#f4f4f5] h-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="text-[20rem] md:text-[40rem] font-bold leading-none">怪獣</span>
          </div>

          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex flex-col space-y-6 md:space-y-12 opacity-30 z-0">
            <div className="w-20 md:w-40 aspect-[3/4] overflow-hidden rounded bg-gray-200 shadow-sm transition-all duration-700">
               <img key={`ghost-1-${product.id}`} src={product.image} className="w-full h-full object-cover grayscale brightness-110" alt="Pose 1" />
            </div>
            <div className="w-20 md:w-40 aspect-[3/4] overflow-hidden rounded bg-gray-200 shadow-sm transition-all duration-700">
               <img key={`ghost-2-${product.id}`} src={product.image} className="w-full h-full object-cover object-bottom" alt="Pose 2" />
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-20 pointer-events-none">
            <img 
              key={product.id}
              src={product.image} 
              className="h-[70%] md:h-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-fade-in-scale transition-all duration-700 pointer-events-auto" 
              alt={product.name} 
            />
          </div>

          <div className="absolute left-6 md:left-32 bottom-20 flex items-center space-x-4 text-[10px] font-bold tracking-widest text-gray-400 z-30 bg-white/50 backdrop-blur-sm p-2 rounded md:bg-transparent">
             <button 
               onClick={(e) => { e.stopPropagation(); prevProduct(); }} 
               className="hover:text-black flex items-center transition-colors group p-2"
             >
               <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> PREV
             </button>
             <span>|</span>
             <button 
               onClick={(e) => { e.stopPropagation(); nextProduct(); }} 
               className="hover:text-black flex items-center transition-colors group p-2"
             >
               NEXT <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right mr-10 whitespace-nowrap hidden lg:block select-none">
            <span className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase">View Collections</span>
            <div className="inline-block w-12 h-[1px] bg-black ml-4 align-middle"></div>
          </div>

          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-30">
             <button 
               onClick={(e) => { e.stopPropagation(); nextProduct(); }}
               className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-lg bg-white active:scale-95 transform"
             >
               <ChevronRight size={20} />
             </button>
          </div>

          <div className="absolute left-0 bottom-0 flex h-20 w-full max-w-sm shadow-xl z-20">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-red-600 text-white flex items-center justify-center space-x-3 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700 transition-colors"
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
            <div className="w-24 md:w-32 bg-white flex items-center justify-center text-[10px] font-bold tracking-widest border-t border-gray-100 uppercase select-none">
              Size 42
            </div>
          </div>
        </section>

        <section className="hidden lg:flex w-1/4 bg-white h-full border-l border-gray-100 flex-col p-12 overflow-y-auto z-40">
          <div className="mb-12">
            <div className="aspect-[3/4] bg-gray-50 mb-8 overflow-hidden rounded shadow-sm">
              <img 
                key={product.id + '-detail'}
                src={product.image} 
                className="w-full h-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-500" 
                alt="Detail view" 
              />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 leading-tight">{product.name}</h2>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-6 uppercase tracking-wider">
              {product.description}
            </p>
            <div className="text-sm font-bold tracking-widest mb-12">
              ${product.price.toFixed(2)}
            </div>
            
            <button className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
              Size Guide
            </button>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
             <button 
               onClick={() => setIsStylistOpen(true)}
               className="w-full flex items-center justify-center space-x-3 py-4 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all group"
             >
               <Sparkles size={16} className="group-hover:text-yellow-400 transition-colors" />
               <span>Ask AI Stylist</span>
             </button>
          </div>
        </section>
      </main>

      <CartDrawer 
        isOpen={state.isCartOpen} 
        onClose={() => setState(prev => ({ ...prev, isCartOpen: false }))}
        items={state.cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => setState(prev => ({ ...prev, view: 'checkout', isCartOpen: false }))}
      />

      {isStylistOpen && (
        <AIStylist 
          onClose={() => setIsStylistOpen(false)} 
          onAddToCart={(id) => {
            const prod = PRODUCTS.find(p => p.id === id);
            if (prod) addToCart(prod);
          }}
        />
      )}

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
