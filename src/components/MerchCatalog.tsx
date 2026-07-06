import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Info, 
  Star, 
  Heart, 
  Search, 
  SlidersHorizontal,
  Scissors,
  ChevronRight
} from 'lucide-react';

// Product Interface definition matching the app requirements
export interface Product {
  id: string;
  name: string;
  category: 'Accessories' | 'Tees & Hoodies' | 'Stationery & Mugs';
  description: string;
  basePrice: number;
  commission: number; // Press Book platform service cut
  totalPrice: number;
  aspect: string;
  imageUrl: string;      // Main image (primary angle)
  imageHoverUrl: string; // Secondary angle/mockup hover state
  rating: number;
  reviewsCount: number;
  tags: string[];        // Floating tags (e.g., "POPULAR", "100% COTTON")
  variants: string[];    // Sizing/variants quick selector
}

interface MerchCatalogProps {
  onCustomizeProduct: (product: {
    id: string;
    name: string;
    basePrice: number;
    commission: number;
    totalPrice: number;
    aspect: string;
    description: string;
    imageUrl: string;
  }) => void;
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    variant: string;
    imageUrl: string;
  }) => void;
}

// Curated collections similar to The Souled Store accessories & apparel
const CATALOG_PRODUCTS: Product[] = [
  // --- ACCESSORIES COLLECTION ---
  {
    id: 'stickers-pack',
    name: 'Minimalist Slate Sticker Pack (15-Piece)',
    category: 'Accessories',
    description: 'Ultra-durable, waterproof matte vinyl stickers featuring minimalist custom designs, typography, and premium patterns.',
    basePrice: 130,
    commission: 19,
    totalPrice: 149,
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1572375995501-4b0894dbe0d1?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 320,
    tags: ['PREMIUM SELLER', '☔ Weatherproof', '✨ Vibe Approved'],
    variants: ['Classic Pack', 'Special Edition', 'Minimalist Designs']
  },
  {
    id: 'funky-socks',
    name: 'Signature White Crew Socks (Pair of 3)',
    category: 'Accessories',
    description: 'Combed cotton socks with extra cushioning, featuring clean patterns and minimalist accents.',
    basePrice: 260,
    commission: 39,
    totalPrice: 299,
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1608228088998-57828365d486?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 142,
    tags: ['☁️ Super Soft', '🔥 Loved by all'],
    variants: ['Free Size', 'S/M', 'L/XL']
  },
  {
    id: 'kantaap-cap',
    name: 'Classic Retro Snapback Cap',
    category: 'Accessories',
    description: 'High-crown structured baseball cap with contrast brim and front thick premium embroidery.',
    basePrice: 400,
    commission: 49,
    totalPrice: 449,
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 98,
    tags: ['🪡 Fancy Stitching', 'STREETWEAR STYLE'],
    variants: ['Standard Adjustable', 'Snapback XL']
  },
  {
    id: 'canvas-tote',
    name: 'Executive Canvas Tote Bag',
    category: 'Accessories',
    description: 'Heavy duty 400 GSM raw canvas tote with reinforced handles, zip closure, and interior pocket.',
    basePrice: 310,
    commission: 39,
    totalPrice: 349,
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviewsCount: 215,
    tags: ['ECO-FRIENDLY', 'HEAVY DUTY'],
    variants: ['Standard (15"x16")', 'Oversized (18"x20")']
  },
  {
    id: 'phone_case',
    name: 'Premium Matte Mobile Cover',
    category: 'Accessories',
    description: 'Polycarbonate hard shell case with wrap-around premium printing and soft matte finish.',
    basePrice: 280,
    commission: 39,
    totalPrice: 319,
    aspect: '2:3',
    imageUrl: '/blank_phone_case.png',
    imageHoverUrl: '/blank_phone_case.png',
    rating: 4.8,
    reviewsCount: 154,
    tags: ['HD PRINT', 'HARD SHELL', '🔥 Loved by all'],
    variants: ['iPhone 15 Pro', 'iPhone 15', 'OnePlus 12', 'Samsung S24 Ultra']
  },

  // --- TEES & HOODIES COLLECTION ---
  {
    id: 'tshirt',
    name: 'Classic Cotton Tee',
    category: 'Tees & Hoodies',
    description: 'Ultra-cozy drop shoulder t-shirt made of heavyweight 240 GSM organic cotton. Feels premium, classic fit.',
    basePrice: 440,
    commission: 59,
    totalPrice: 499,
    aspect: '4:5',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 512,
    tags: ['☁️ Super Soft', 'CLASSIC FIT', 'MUST-HAVE'],
    variants: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'hoodie',
    name: 'Premium Heavyweight Hoodie',
    category: 'Tees & Hoodies',
    description: 'Premium heavyweight 400 GSM fleece-lined oversized hoodie with double-layered hood and front pouch pocket.',
    basePrice: 880,
    commission: 119,
    totalPrice: 999,
    aspect: '4:5',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 189,
    tags: ['WINTER SPECIAL', '🛋️ Comfy Oversized', 'HIGH HEAT'],
    variants: ['S', 'M', 'L', 'XL', 'XXL']
  },

  // --- STATIONERY & MUGS COLLECTION ---
  {
    id: 'notebook',
    name: 'Executive Wirebound Notebook',
    category: 'Stationery & Mugs',
    description: 'A5 spiral bound ruled notebook, 160 pages of 120 GSM ink-friendly paper. Perfect for notes & ideas.',
    basePrice: 170,
    commission: 29,
    totalPrice: 199,
    aspect: '4:5',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 88,
    tags: ['IN-HOUSE ORIGINAL', '120 GSM'],
    variants: ['Ruled', 'Unruled / Plain', 'Dotted Grid']
  },
  {
    id: 'mug',
    name: 'Ceramic Coffee Mug',
    category: 'Stationery & Mugs',
    description: 'Premium ceramic mug with custom matte finish. Holds 350ml of your favorite beverage.',
    basePrice: 220,
    commission: 29,
    totalPrice: 249,
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 174,
    tags: ['💎 Smooth Matte', 'MICROWAVE SAFE'],
    variants: ['Midnight Black', 'Signature White', 'Royal Purple']
  },
  {
    id: 'pen',
    name: 'Matte Executive Pen',
    category: 'Stationery & Mugs',
    description: 'Full metal body ballpoint pen with fine matte texture and solid weight balance. Swiss ink refill.',
    basePrice: 85,
    commission: 14,
    totalPrice: 99,
    aspect: '3:1',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600&auto=format&fit=crop',
    imageHoverUrl: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 63,
    tags: ['MATTE METAL', 'SWISS INK'],
    variants: ['Black Ink', 'Monsoon Blue Ink']
  }
];

export default function MerchCatalog({ onCustomizeProduct, onAddToCart }: MerchCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Swag');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [pricingBreakdownOpen, setPricingBreakdownOpen] = useState<string | null>(null);
  const [expandedDescProductId, setExpandedDescProductId] = useState<string | null>(null);

  // Toggle wishlist state
  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Select a variant for a specific product
  const selectVariant = (productId: string, variant: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  // Filter and sort products
  const filteredProducts = CATALOG_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All Swag' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.totalPrice - b.totalPrice;
    if (sortBy === 'price-high') return b.totalPrice - a.totalPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    // Default popularity: reviewsCount * rating desc
    return (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating);
  });

  const categories = [
    { name: 'All Swag', count: CATALOG_PRODUCTS.length },
    { name: 'Accessories', count: CATALOG_PRODUCTS.filter(p => p.category === 'Accessories').length },
    { name: 'Tees & Hoodies', count: CATALOG_PRODUCTS.filter(p => p.category === 'Tees & Hoodies').length },
    { name: 'Stationery & Mugs', count: CATALOG_PRODUCTS.filter(p => p.category === 'Stationery & Mugs').length },
  ];

  return (
    <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full h-full lg:max-h-[85vh] pt-4">
      {/* LEFT SIDE: Heading, Search, Filter */}
      <div className="lg:w-[35%] flex flex-col gap-6 md:gap-8 lg:border-r-2 lg:border-white/10 lg:pr-8 shrink-0">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-bhangra-pink-500 animate-pulse" size={28} />
              Swag & Accessories Hub
            </h2>
            <p className="text-kulfi-white-300 text-sm md:text-base mt-1">
              Select premium bases, inspect transparent pricing, and design in the Custom Lab.
            </p>
          </div>
          <span className="self-start text-xs font-mono bg-jugaad-black-900 text-desi-lime-500 px-3.5 py-1.5 rounded-full border border-desi-lime-500/30 uppercase font-semibold tracking-wider">
            ⚡ Premium Design Selection
          </span>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col gap-6">
          {/* Category Tabs */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none snap-x">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`snap-start flex-shrink-0 px-4 py-2.5 rounded-neo-pill font-heading text-xs uppercase font-extrabold tracking-wider border-2 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center gap-2 ${
                    isActive 
                      ? 'bg-bhangra-pink-500 text-white border-desi-lime-500/30 shadow-neo-flat shadow-desi-lime-500 translate-y-[-2px]' 
                      : 'bg-jugaad-black-900/60 text-kulfi-white-300 border-white/10 hover:border-desi-lime-500/30 hover:text-white'
                  }`}
                >
                  {cat.name}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white text-bhangra-pink-500' : 'bg-white/10 text-kulfi-white-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col gap-4 pt-4 border-t-2 border-white/10">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-kulfi-white-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search sticker, tee, mug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-jugaad-black-900 border-2 border-white/10 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-bhangra-pink-500 focus:shadow-glow-pink transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 bg-jugaad-black-900 border-2 border-white/10 rounded-lg text-white font-sans text-sm font-semibold focus:outline-none focus:border-bhangra-pink-500 transition-all cursor-pointer"
              >
                <option value="popular">🔥 Popularity</option>
                <option value="price-low">💸 Price: Low to High</option>
                <option value="price-high">📈 Price: High to Low</option>
                <option value="rating">⭐️ Top Rated</option>
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-kulfi-white-400">
                <SlidersHorizontal size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Sub-Scroll Menu for Items */}
      <div className="lg:w-[65%] h-full lg:max-h-[85vh] overflow-y-auto scrollbar-thin pr-4 pb-24 overscroll-contain">
        {filteredProducts.length === 0 ? (
          <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-12 text-center max-w-xl mx-auto space-y-4">
            <p className="text-kulfi-white-400 font-sans text-base">No items found matching your filters.</p>
            <button 
              onClick={() => { setSelectedCategory('All Swag'); setSearchQuery(''); }}
              className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-heading text-xs uppercase"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filteredProducts.map((product, idx) => {
            const isHovered = hoveredCardId === product.id;
            const isWishlisted = wishlist.includes(product.id);
            const selectedVariant = selectedVariants[product.id] || product.variants[0];
            const isPricingOpen = pricingBreakdownOpen === product.id;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  setPricingBreakdownOpen(null);
                }}
                className={`bg-jugaad-black-900/60 border border-white/5 p-5 hover:border-desi-lime-500/30 hover:shadow-neo-flat hover:shadow-bhangra-pink-500 transition-all duration-300 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex flex-col justify-between relative group ${
                  idx % 2 === 1 ? 'lg:translate-y-8 rounded-[32px_12px_32px_12px]' : 'rounded-[12px_32px_12px_32px]'
                }`}
              >
                {/* 1. Image Container (with secondary angle hover state & variant overlay) */}
                <div 
                  className="aspect-[4/5] w-full bg-jugaad-black-950 rounded-lg mb-4 relative overflow-hidden flex justify-center items-center border border-white/5 select-none"
                  style={product.imageUrl.endsWith('.png') ? { background: 'radial-gradient(circle, rgba(0, 200, 151, 0.15) 0%, rgba(5, 32, 22, 0.95) 100%)' } : {}}
                >
                  {/* Floating Tags (e.g., "POPULAR", "100% COTTON") */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start pointer-events-none">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-heading font-black tracking-wider px-2.5 py-0.5 rounded-sm uppercase ${
                          tag.includes('Vibe Approved') || tag.includes('Loved by all') || tag.includes('HIGH HEAT')
                            ? 'bg-bhangra-pink-500/20 text-bhangra-pink-500 border border-bhangra-pink-500/30'
                            : tag.includes('Weatherproof') || tag.includes('Fancy Stitching') || tag.includes('DESI SELLER') || tag.includes('NEON EMBROIDERY')
                            ? 'bg-desi-lime-500/20 text-desi-lime-500 border border-desi-lime-500/30'
                            : 'bg-masala-orange-500/20 text-masala-orange-500 border border-masala-orange-500/30'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Wishlist Button (Kantaap Click) */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    aria-label="Add to Wishlist"
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full border border-white/10 bg-jugaad-black-900/80 flex items-center justify-center text-white hover:text-bhangra-pink-500 hover:border-bhangra-pink-500 hover:scale-110 active:scale-95 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96]"
                  >
                    <Heart size={16} fill={isWishlisted ? '#FF007F' : 'none'} className={isWishlisted ? 'text-bhangra-pink-500' : ''} />
                  </button>

                  {/* Main / Hover Mockup Image */}
                  <div className="w-full h-full absolute inset-0 transition-opacity duration-300 flex justify-center items-center p-6">
                    <div className="absolute w-36 h-36 bg-desi-lime-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
                    {product.imageUrl.endsWith('.png') ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className={`max-w-[90%] max-h-[90%] object-contain transition-transform duration-500 ${
                          isHovered ? 'scale-105' : 'scale-100'
                        }`}
                        style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.45))' }}
                      />
                    ) : (
                      <>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-90'
                          }`}
                        />
                        <img
                          src={product.imageHoverUrl}
                          alt={`${product.name} Detail`}
                          loading="lazy"
                          className={`w-full h-full object-cover absolute inset-0 transition-transform duration-500 ${
                            isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                          }`}
                        />
                      </>
                    )}
                  </div>

                  {/* Size / Variant Quick Selector Popup Overlay on Hover */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-20 bg-jugaad-black-950/95 border-t border-white/10 p-3.5 transform transition-transform duration-300 flex flex-col gap-2 ${
                      isHovered ? 'translate-y-0' : 'translate-y-full'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-kulfi-white-400 uppercase tracking-widest block text-left">
                      Quick Pick Option:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant === v;
                        return (
                          <button
                            key={v}
                            onClick={(e) => selectVariant(product.id, v, e)}
                            className={`px-2 py-1 rounded text-[10px] font-heading font-extrabold uppercase transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] ${
                              isSelected
                                ? 'bg-desi-lime-500 text-jugaad-black-950 border border-desi-lime-500 font-black'
                                : 'bg-white/5 text-kulfi-white-300 border border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Rating & Reviews info */}
                <div className="flex items-center gap-1.5 text-2xs text-kulfi-white-400 mb-1.5">
                  <div className="flex items-center gap-0.5 bg-chai-gold-500/10 border border-chai-gold-500/20 px-1.5 py-0.5 rounded text-chai-gold-500 font-bold">
                    <Star size={10} fill="currentColor" className="text-chai-gold-500" />
                    <span>{product.rating}</span>
                  </div>
                  <span>({product.reviewsCount} reviews)</span>
                </div>

                {/* 3. Product Info */}
                <div>
                  <h3 className="font-heading text-base md:text-lg font-bold text-white group-hover:text-bhangra-pink-500 transition-colors duration-150 leading-snug">
                    {product.name}
                  </h3>
                  <div className="relative">
                    <p className={`text-kulfi-white-300 text-xs mt-1 leading-normal transition-all duration-300 ${
                      expandedDescProductId === product.id ? '' : 'line-clamp-2 h-8'
                    }`}>
                      {product.description}
                    </p>
                    {product.description.length > 60 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDescProductId(expandedDescProductId === product.id ? null : product.id);
                        }}
                        className="text-[10px] font-mono text-desi-lime-500 hover:text-white transition-colors mt-1 block cursor-pointer"
                      >
                        {expandedDescProductId === product.id ? 'Show Less ▴' : 'Show More ▾'}
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Price & Cost Transparency List */}
                <div className="mt-4 border-t border-white/5 pt-3.5 relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-kulfi-white-400 uppercase">Retail Price</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg md:text-xl font-heading font-black text-white">
                          ₹{product.totalPrice}
                        </span>
                        {/* Info trigger for transparent pricing breakdown */}
                        <button
                          onMouseEnter={() => setPricingBreakdownOpen(product.id)}
                          onMouseLeave={() => setPricingBreakdownOpen(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPricingBreakdownOpen(isPricingOpen ? null : product.id);
                          }}
                          className="text-kulfi-white-400 hover:text-desi-lime-500 transition-colors"
                          aria-label="Price transparency info"
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-desi-lime-500 block">
                        Base: ₹{product.basePrice} + Service Cut
                      </span>
                    </div>

                    {/* Quick Add Button */}
                    {onAddToCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart({
                            id: `${product.id}-${selectedVariant}`,
                            name: `${product.name} (${selectedVariant})`,
                            price: product.totalPrice,
                            variant: selectedVariant,
                            imageUrl: product.imageUrl
                          });
                        }}
                        className="p-2 rounded bg-white/5 border border-white/10 hover:bg-desi-lime-500 hover:text-jugaad-black-950 hover:border-desi-lime-500 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] text-white"
                        title={`Quick Add ${selectedVariant} to Cart`}
                      >
                        <ShoppingBag size={15} />
                      </button>
                    )}
                  </div>

                  {/* Transparent Pricing Breakdown Overlay Panel (Zero layout shift popup) */}
                  {isPricingOpen && (
                    <div className="absolute bottom-full left-0 z-30 mb-2 w-64 bg-jugaad-black-900/95 border-2 border-desi-lime-500/30 rounded-lg p-3.5 shadow-2xl animate-print-slide backdrop-blur-md">
                      <div className="text-[10px] font-mono text-desi-lime-500 uppercase tracking-widest border-b border-white/10 pb-1.5 mb-2 font-bold flex justify-between">
                        <span>Price Breakdown</span>
                        <span>100% Transparent</span>
                      </div>
                      <div className="space-y-1.5 text-2xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-kulfi-white-400">Item Maker Cost 🧵:</span>
                          <span className="text-white font-bold">₹{product.basePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-kulfi-white-400">Press Book Studio Fee ☕:</span>
                          <span className="text-desi-lime-500 font-bold">₹{product.commission}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-kulfi-white-400">GST (18% included):</span>
                          <span className="text-white">₹{Math.round(product.totalPrice * 0.18)}</span>
                        </div>
                        <div className="flex justify-between pt-1 font-heading text-xs font-black">
                          <span className="text-white uppercase">Final Price:</span>
                          <span className="text-chai-gold-500 font-black">₹{product.totalPrice}</span>
                        </div>
                      </div>
                      {/* Decorative scanning-bar on popup */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-desi-lime-500 to-transparent mt-2"></div>
                    </div>
                  )}
                </div>

                {/* 5. Custom Lab Edit Button */}
                <button
                  onClick={() => onCustomizeProduct({
                    id: product.id,
                    name: product.name,
                    basePrice: product.basePrice,
                    commission: product.commission,
                    totalPrice: product.totalPrice,
                    aspect: product.aspect,
                    description: product.description,
                    imageUrl: product.imageUrl
                  })}
                  className="w-full mt-4 py-2.5 rounded-neo-pill font-heading font-extrabold uppercase text-2xs tracking-wider bg-transparent border-2 border-white/15 text-white hover:border-bhangra-pink-500 hover:text-white hover:bg-bhangra-pink-500/5 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-1.5"
                >
                  <Scissors size={12} className="rotate-90" /> Tweak in Custom Lab 🧪 <ChevronRight size={10} />
                </button>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
