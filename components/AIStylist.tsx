
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIStylistProps {
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

const AIStylist: React.FC<AIStylistProps> = ({ onClose, onAddToCart }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Konnichiwa. I am your Kaiju style consultant. I specialize in modern Japanese silhouettes and avant-garde coordination. How can I assist your selection today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const productContext = PRODUCTS.map(p => 
        `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are an elite fashion consultant for Kaiju, a brand specializing in modern Japanese attire. 
          Your tone is minimalist, sophisticated, and culturally informed. 
          Recommend products from our catalog based on the user's inquiry about occasions, weather, or style.
          
          Our Catalog:
          ${productContext}
          
          Guidelines:
          - If they want something for summer, suggest Yukatas or lightweight Haoris.
          - If they want architectural style, suggest Hakama or Tabi boots.
          - If they want formal, suggest the Red Kimono or Indigo Shibori.
          - Be concise. Focus on materials and silhouette.`,
          temperature: 0.6,
        },
      });

      const text = response.text || "I apologize, my stylistic intuition is temporarily clouded. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "A connectivity error occurred with the style archives. Please refresh." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-none shadow-2xl overflow-hidden flex flex-col h-[650px] border border-gray-100">
        {/* Header */}
        <div className="p-8 bg-black text-white flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-2 border border-white/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em]">Kaiju Stylist AI</h2>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Cultural Intuition Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:opacity-50 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 h-8 w-8 flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${msg.role === 'user' ? 'bg-gray-100' : 'bg-black text-white'}`}>
                  {msg.role === 'user' ? 'U' : 'K'}
                </div>
                <div className={`p-5 text-[11px] leading-relaxed tracking-wide ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white shadow-sm border border-gray-100 text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="p-2 h-8 w-8 bg-black text-white flex items-center justify-center text-[10px] font-bold">K</div>
                <div className="p-5 bg-white shadow-sm border border-gray-100 flex space-x-1 items-center">
                  <div className="w-1 h-1 bg-black rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-black rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-black rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-gray-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire about modern silhouettes..."
              className="flex-1 bg-gray-50 border-none px-4 py-4 text-[11px] font-medium tracking-wider focus:ring-1 focus:ring-black outline-none transition-all"
            />
            <button
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-80 disabled:opacity-30 transition-all shadow-lg"
            >
              SEND
            </button>
          </form>
          <p className="mt-4 text-[8px] text-gray-400 text-center uppercase tracking-[0.3em]">
            Tradition meets artificial intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIStylist;
