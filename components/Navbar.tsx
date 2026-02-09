
import React from 'react';
import { ShoppingCart, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
  onSetFilter: (cat: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onGoHome, onSetFilter }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-8 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-16">
        <h1 
          onClick={onGoHome}
          className="text-2xl font-kaiju cursor-pointer select-none"
        >
          kaiju
        </h1>
        <div className="hidden md:flex space-x-8 text-[10px] font-bold tracking-widest text-gray-500">
          <button onClick={() => onSetFilter('Men')} className="hover:text-black transition-colors">MEN</button>
          <button onClick={() => onSetFilter('Women')} className="hover:text-black transition-colors">WOMEN</button>
        </div>
      </div>

      <div className="flex items-center space-x-12">
        <div className="hidden lg:flex items-center border-b border-black pb-1">
          <span className="text-[10px] font-bold tracking-widest mr-2">SEARCH</span>
          <div className="w-4 h-[2px] bg-black"></div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-black hover:opacity-70 transition-opacity"
          >
            <ShoppingCart size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-all">
            <LayoutGrid size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
