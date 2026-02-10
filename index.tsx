
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingCart, LayoutGrid, X, Trash2, ShoppingBag, 
  ChevronRight, ChevronLeft, Sparkles, Send, Bot, 
  User, CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2, Plus 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- DATA ---
const PRODUCTS = [
  {
    id: '1',
    name: 'Japanese Attire - Red Kimono',
    price: 340.00,
    category: 'Women',
    description: 'A striking scarlet kimono featuring intricate floral embroidery. Crafted from premium silk-satin for a fluid, elegant drape.',
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '2',
    name: 'Ceremonial White Yukata',
    price: 280.00,
    category: 'Women',
    description: 'A pristine white yukata designed for summer ceremonies. Features lightweight cotton weave with subtle geometric patterns.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '3',
    name: 'Modern Haori Jacket',
    price: 195.00,
    category: 'Men',
    description: 'A contemporary take on the traditional haori jacket, designed for urban layering with a weather-resistant finish.',
    image: 'https://images.unsplash.com/photo-1617130863154-933611689255?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '4',
    name: 'Charcoal Zen Robe',
    price: 220.00,
    category: 'Men',
    description: 'Minimalist loungewear inspired by Zen monastic attire. Features oversized sleeves and a hidden internal tie closure.',
    image: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '5',
    name: 'Crimson Silk Hakama',
    price: 410.00,
    category: 'Women',
    description: 'Architectural wide-leg trousers crafted from heavy-weight silk. Deep pleats provide a structured silhouette.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '6',
    name: 'Obsidian Tabi Boots',
    price: 385.00,
    category: 'Accessories',
    description: 'Modern split-toe footwear in matte black leather. Combines tradition with a sleek urban aesthetic.',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: '9',
    name: 'Indigo Shibori Kimono',
    price: 450.00,
    category: 'Men',
    description: 'Authentic indigo-dyed kimono using the shibori tie-dye technique. Each piece features a unique, hand-crafted pattern.',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1600'
  }
];

// --- COMPONENTS ---

const Navbar = ({ cartCount, onOpenCart, onGoHome, onSetFilter }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-20 flex items-center justify-between">
    <div className="flex items-center space-x-16">
      <h1 onClick={onGoHome} className="text-2xl font-kaiju cursor-pointer select-none">kaiju</h1>
      <div className="hidden md:flex space-x-8 text-[10px] font-bold tracking-widest text-gray-500">
        <button onClick={() => onSetFilter('Men')} className="hover:text-black transition-colors uppercase">Men</button>
        <button onClick={() => onSetFilter('Women')} className="hover:text-black transition-colors uppercase">Women</button>
        <button onClick={() => onSetFilter('Accessories')} className="hover:text-black transition-colors uppercase">Accessories</button>
      </div>
    </div>
    <div className="flex items-center space-x-6">
      <button onClick={onOpenCart} className="relative p-2 text-black hover:opacity-70 transition-opacity">
        <ShoppingCart size={20} strokeWidth={1.5} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </nav>
);

const CartDrawer = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em]">Your Selection</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
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
                  <div className="flex justify-between items-start">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                    <p className="text-[10px] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 text-gray-400 hover:text-black">-</button>
                      <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 text-gray-400 hover:text-black">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={16} /></button>
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
            <button onClick={onCheckout} className="w-full bg-red-600 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl">Confirm & Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Checkout = ({ onBack, items, onComplete }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + 25.00;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(onComplete, 3000);
  };

  if (isSuccess) return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <CheckCircle2 size={80} className="text-green-500 mx-auto animate-bounce" />
        <h2 className="text-3xl font-bold uppercase tracking-widest">Order Confirmed</h2>
        <p className="text-gray-500 text-sm">Your avant-garde selection is being prepared.</p>
        <button onClick={onComplete} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest">Return to Store</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-12 px-8">
      <button onClick={onBack} className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest mb-12"><ArrowLeft size={14} /><span>Back to Shop</span></button>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <form onSubmit={handleSubmit} className="space-y-8">
           <h2 className="text-xl font-bold uppercase tracking-widest border-b pb-4 flex items-center gap-3"><Truck size={20}/> Shipping</h2>
           <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="border p-4 text-xs uppercase" required />
              <input placeholder="Last Name" className="border p-4 text-xs uppercase" required />
              <input placeholder="Address" className="col-span-2 border p-4 text-xs uppercase" required />
           </div>
           <h2 className="text-xl font-bold uppercase tracking-widest border-b pb-4 flex items-center gap-3"><CreditCard size={20}/> Payment</h2>
           <input placeholder="Card Number" className="w-full border p-4 text-xs" required />
           <button type="submit" className="w-full bg-black text-white py-6 font-bold uppercase tracking-widest text-[10px]">Authorize — ${total.toFixed(2)}</button>
        </form>
        <div className="bg-white p-8 border">
          <h3 className="font-bold uppercase tracking-widest mb-8 border-b pb-4">Order Summary</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-[10px] uppercase font-bold mb-4">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIStylist = ({ onClose, onAddToCart }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Konnichiwa. I am your Kaiju stylist. How can I curate your modern silhouette today?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input; setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: "You are an elite Kaiju fashion stylist. Be minimalist and professional." }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Archive connection failed. Please retry." }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white h-[600px] flex flex-col">
        <div className="p-6 bg-black text-white flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Stylist AI</span>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 text-[11px] leading-relaxed">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 max-w-[80%] ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-6 border-t flex gap-4">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Inquire about collections..." className="flex-1 border-b text-xs outline-none" />
          <button className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest">Send</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState('shop');
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState('All');
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  const filtered = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  const current = filtered[activeIdx] || PRODUCTS[0];

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  if (view === 'checkout') return <Checkout items={cart} onBack={() => setView('shop')} onComplete={() => { setCart([]); setView('shop'); }} />;

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onGoHome={() => { setFilter('All'); setActiveIdx(0); }}
        onSetFilter={f => { setFilter(f); setActiveIdx(0); }}
      />
      
      <main className="flex-1 flex mt-20">
        <section className="relative w-full lg:w-3/4 bg-[#f8f8f8] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none text-[30rem] font-bold">怪獣</div>
          
          <img key={current.id} src={current.image} className="h-[80%] object-contain drop-shadow-2xl z-10" />
          
          <div className="absolute left-10 bottom-10 flex gap-4 text-[10px] font-bold tracking-[0.3em] uppercase z-20">
            <button onClick={() => setActiveIdx((activeIdx - 1 + filtered.length) % filtered.length)}>Prev</button>
            <span>/</span>
            <button onClick={() => setActiveIdx((activeIdx + 1) % filtered.length)}>Next</button>
          </div>

          <div className="absolute left-0 bottom-0 h-20 w-64 bg-black flex text-white z-20">
             <button onClick={() => addToCart(current)} className="flex-1 font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
               <Plus size={14}/> Add to Cart
             </button>
          </div>
        </section>

        <section className="hidden lg:flex w-1/4 border-l p-12 flex-col">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">{current.name}</h2>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-8">{current.category}</p>
          <p className="text-xs leading-relaxed text-gray-500 mb-12">{current.description}</p>
          <div className="text-xl font-bold mb-auto">${current.price.toFixed(2)}</div>
          
          <button onClick={() => setIsStylistOpen(true)} className="w-full py-4 border border-black flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            <Sparkles size={16}/> Ask AI Stylist
          </button>
        </section>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
        onCheckout={() => { setView('checkout'); setIsCartOpen(false); }}
      />
      {isStylistOpen && <AIStylist onClose={() => setIsStylistOpen(false)} onAddToCart={addToCart}/>}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
