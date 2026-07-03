import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Printer
} from 'lucide-react';

interface BrandIntroProps {
  onCustomizeClick?: (productType: string, initialText?: string) => void;
  lang?: 'EN' | 'HI';
}

const HERO_THEMES = [
  { id: 'tshirt', name: 'Classic Cotton Tee', color: '#FF007F', text: 'Classic Cotton Tee', slogan: 'Premium 240 GSM organic cotton streetwear.' },
  { id: 'hoodie', name: 'Premium Heavyweight Hoodie', color: '#FF5400', text: 'Premium Heavyweight Hoodie', slogan: 'Cozy 400 GSM fleece-lined oversized hoodie.' },
  { id: 'mug', name: 'Ceramic Coffee Mug', color: '#7209B7', text: 'Ceramic Coffee Mug', slogan: 'Premium matte finish 350ml ceramic mug.' },
  { id: 'notebook', name: 'Executive Notebook', color: '#0077B6', text: 'Executive Wirebound Notebook', slogan: 'A5 spiral bound ruled 120 GSM notebook.' },
  { id: 'pen', name: 'Executive Pen', color: '#ADFF2F', text: 'Matte Executive Pen', slogan: 'Full metal body ballpoint pen with Swiss ink.' },
  { id: 'phone_case', name: 'Premium Mobile Cover', color: '#E0A96D', text: 'Premium Matte Mobile Cover', slogan: 'Polycarbonate hard shell wrap-around printing case.' }
];

const PREVIEW_PRODUCTS = [
  { 
    id: 'tshirt', 
    name: 'Classic Cotton Tee', 
    image: '/blank_tshirt.png', 
    defaultPrice: 499, 
    placement: { top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: '38%', fontSize: '1.2rem', textTransform: 'uppercase' as const } 
  },
  { 
    id: 'hoodie', 
    name: 'Premium Heavyweight Hoodie', 
    image: '/blank_hoodie.png', 
    defaultPrice: 899, 
    placement: { top: '38%', left: '50%', transform: 'translate(-50%, -50%)', width: '36%', fontSize: '1.1rem', textTransform: 'uppercase' as const } 
  },
  { 
    id: 'mug', 
    name: 'Ceramic Coffee Mug', 
    image: '/blank_mug.png', 
    defaultPrice: 249, 
    placement: { top: '48%', left: '46%', transform: 'translate(-50%, -50%)', width: '34%', fontSize: '0.8rem', textTransform: 'uppercase' as const } 
  },
  { 
    id: 'notebook', 
    name: 'Executive Wirebound Notebook', 
    image: '/blank_notebook.png', 
    defaultPrice: 199, 
    placement: { top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '45%', fontSize: '0.9rem', textTransform: 'uppercase' as const } 
  },
  { 
    id: 'pen', 
    name: 'Matte Executive Pen', 
    image: '/blank_pen.png', 
    defaultPrice: 49, 
    placement: { top: '48%', left: '50%', transform: 'translate(-50%, -50%) rotate(-5deg)', width: '55%', fontSize: '0.4rem', textTransform: 'uppercase' as const } 
  },
  { 
    id: 'phone_case', 
    name: 'Premium Mobile Cover', 
    image: '/blank_phone_case.png', 
    defaultPrice: 319, 
    placement: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '45%', fontSize: '0.8rem', textTransform: 'uppercase' as const } 
  },
];

const CANVAS_SHADES = [
  { name: 'Signature Black', hex: '#090A0F' },
  { name: 'Signature White', hex: '#FAF9F6' },
  { name: 'Monsoon Blue', hex: '#0077B6' },
  { name: 'Masala Orange', hex: '#FF5400' },
  { name: 'Royal Purple', hex: '#7209B7' }
];

const INK_COLORS = [
  { name: 'Bhangra Pink', hex: '#FF007F' },
  { name: 'Desi Lime', hex: '#ADFF2F' },
  { name: 'Masala Orange', hex: '#FF5400' },
  { name: 'Royal Purple', hex: '#7209B7' },
  { name: 'Signature White', hex: '#FAF9F6' }
];

const MARQUEE_ITEMS_1 = [
  "💥 PREMIUM CUSTOM APPAREL", "📦 NO MINIMUM ORDER QUANTITY", "⚡ EXPRESS NATIONWIDE SHIPPING", "🎨 VIBRANT HIGH-FIDELITY PRINTING", "🏢 CORPORATE BULK DISCOUNTS"
];
const MARQUEE_ITEMS_2 = [
  "🧵 HIGH GSM PREMIUM FABRICS", "🌱 ECO-FRIENDLY ORGANIC COTTON", "🏆 SUPERIOR PRINT DURABILITY", "🛡️ QUALITY ASSURANCE SECURED", "🤝 LOCAL MANUFACTURING PARTNERS"
];

// Audio Context Web Synth helper (No-op to silence sound synthesis)
const playSynthSound = (..._args: any[]) => {};

export default function BrandIntro({ onCustomizeClick, lang = 'EN' }: BrandIntroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  
  // Hero section State
  const [heroProductIdx, setHeroProductIdx] = useState(0);
  const activeHeroProduct = PREVIEW_PRODUCTS[heroProductIdx];
  const activeHeroTheme = HERO_THEMES[heroProductIdx];

  // Squeegee Simulator State
  const [squeegeePos, setSqueegeePos] = useState(0); // 0 to 100 percentage
  const [isSqueegeeDragging, setIsSqueegeeDragging] = useState(false);
  const [printCured, setPrintCured] = useState(false);
  const squeegeeScreenRef = useRef<HTMLDivElement>(null);
  const squeegeeDraggingRef = useRef(false);

  // Mockup customizer State
  const [previewProductIdx, setPreviewProductIdx] = useState(0);
  const [customText, setCustomText] = useState('MINIMALIST');
  const [selectedShadeIdx, setSelectedShadeIdx] = useState(0);
  const [selectedInkIdx, setSelectedInkIdx] = useState(0);

  // Monitor Window Scroll for Parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate product assembly carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!squeegeeDraggingRef.current) {
        setHeroProductIdx((prev) => (prev + 1) % PREVIEW_PRODUCTS.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update squeegee drag positions
  const updateSqueegeePos = (clientY: number) => {
    if (!squeegeeScreenRef.current) return;
    const rect = squeegeeScreenRef.current.getBoundingClientRect();
    let percentage = ((clientY - rect.top) / rect.height) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    setSqueegeePos(prev => {
      if (percentage > prev && prev < 100) {
        playSynthSound('squeegee', soundMuted);
      }
      if (percentage >= 100 && prev < 100) {
        playSynthSound('success', soundMuted);
        setPrintCured(true);
      }
      return percentage;
    });
  };

  // Window-level events for mouse dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!squeegeeDraggingRef.current) return;
      updateSqueegeePos(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!squeegeeDraggingRef.current) return;
      if (e.touches.length > 0) {
        updateSqueegeePos(e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      squeegeeDraggingRef.current = false;
      setIsSqueegeeDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [soundMuted]);

  const activeProduct = PREVIEW_PRODUCTS[previewProductIdx];
  const activeShade = CANVAS_SHADES[selectedShadeIdx];
  const activeInk = INK_COLORS[selectedInkIdx];



  const handleResetSqueegee = () => {
    playSynthSound('click', soundMuted);
    setSqueegeePos(0);
    setPrintCured(false);
  };

  const triggerCustomizeLab = () => {
    playSynthSound('success', soundMuted);
    if (onCustomizeClick) {
      onCustomizeClick(activeProduct.id, customText);
    }
  };

  // Dynamically calculate parallax styles
  const heroParallaxStyle = {
    transform: `translateY(${Math.min(250, scrollY * 0.18)}px) rotate(${Math.min(10, scrollY * 0.005)}deg)`,
    opacity: Math.max(0.2, 1 - scrollY / 700)
  };

  const badgeParallaxStyle = {
    transform: `translateY(${Math.min(120, scrollY * -0.08)}px) rotate(${Math.min(5, scrollY * -0.003)}deg)`
  };

  return (
    <div className="space-y-24 pb-12 overflow-hidden relative">
      {/* Self-contained CSS for marquee and other custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes custom-marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 22s linear infinite;
        }
        .animate-custom-marquee-reverse {
          animation: custom-marquee-reverse 22s linear infinite;
        }
        .neo-brutalist-border {
          border: 3px solid #090A0F;
        }
        .neo-brutalist-shadow-pink {
          box-shadow: 6px 6px 0px 0px #FF007F;
        }
        .neo-brutalist-shadow-lime {
          box-shadow: 6px 6px 0px 0px #ADFF2F;
        }
        .neo-brutalist-shadow-orange {
          box-shadow: 6px 6px 0px 0px #FF5400;
        }
        .neo-brutalist-shadow-black {
          box-shadow: 6px 6px 0px 0px #090A0F;
        }
        .custom-glow-pulse {
          animation: glow-pulse-keyframes 2s infinite ease-in-out;
        }
        @keyframes glow-pulse-keyframes {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 0, 127, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 0, 127, 0.8)); }
        }
        @keyframes hero-base-assemble {
          0% { transform: translateX(-180px) rotate(-10deg) scale(0.7); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes hero-color-fade {
          0% { opacity: 0; }
          100% { opacity: 0.55; }
        }
        @keyframes hero-graphic-assemble {
          0% { transform: translate(-50%, -150px) scale(0.4); opacity: 0; }
          60% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes hero-text-assemble {
          0% { transform: translateX(180px) scale(0.6); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes hero-flash-overlay {
          0% { opacity: 0.85; filter: brightness(1.2); }
          100% { opacity: 0; }
        }
      `}} />

      {/* Audio volume controller floating badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setSoundMuted(!soundMuted)}
          className="p-3 bg-jugaad-black-900 border-2 border-white/20 hover:border-bhangra-pink-500 rounded-full text-white transition shadow-lg flex items-center justify-center"
          title={soundMuted ? "Unmute Sound Feedback" : "Mute Sound Feedback"}
        >
          {soundMuted ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="text-bhangra-pink-500 animate-pulse" />}
        </button>
      </div>

      {/* 1. HERO SECTION WITH INTEGRATED SLANG PICKER */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-12 px-4 border-b-4 border-jugaad-black-950 overflow-hidden bg-radial from-jugaad-black-900 to-jugaad-black-950">
        
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Floating Decals (Parallax Scroll) */}
        <div 
          style={heroParallaxStyle}
          className="absolute -top-12 -left-12 md:left-20 w-44 h-44 bg-bhangra-pink-500/10 border-3 border-jugaad-black rounded-3xl p-4 flex flex-col justify-between transform -rotate-12 pointer-events-none select-none z-0"
        >
          <span className="text-kulfi-white-400 font-mono text-3xs uppercase">Identity Decal</span>
          <div className="font-heading font-black text-white text-3xl tracking-tighter leading-none">चप</div>
          <span className="text-bhangra-pink-500 font-mono text-2xs uppercase tracking-widest font-extrabold">RAW SWAG</span>
        </div>

        <div 
          style={badgeParallaxStyle}
          className="absolute top-1/4 -right-16 md:right-16 w-36 h-36 bg-desi-lime-500/10 border-3 border-jugaad-black rounded-full p-4 flex flex-col justify-center items-center transform rotate-12 pointer-events-none select-none z-0"
        >
          <Sparkles className="text-desi-lime-500 animate-spin mb-1" size={24} />
          <span className="text-white font-heading font-black text-base uppercase leading-none">NO MINS</span>
          <span className="text-kulfi-white-400 font-mono text-[9px]">EVER LIMIT</span>
        </div>

        {/* Main Grid Content */}
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 text-left">
          
          {/* Left Column: Brand Copy & Slang Selectors */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 bg-jugaad-black-900 border-2 border-white/10 rounded-full px-4 py-1">
              <Flame size={12} className="text-masala-orange-500 animate-bounce" />
              <span className="text-3xs md:text-2xs font-mono uppercase tracking-widest text-kulfi-white-300">
                {lang === 'EN' ? '✨ Cozy Custom Merchandise Studio' : '✨ आरामदायक कस्टम मर्चेंडाइज स्टूडियो'}
              </span>
            </div>

            <div className="relative w-full">
              <h1 
                className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-none uppercase select-none text-white"
              >
                CUSTOM DESIGN & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bhangra-pink-500 via-masala-orange-500 to-desi-lime-500 filter drop-shadow-[0_4px_12px_rgba(255,0,127,0.35)]">
                  {activeHeroTheme.name}
                </span>
              </h1>
            </div>

            {/* Core branding statement */}
            <div className="space-y-4">
              <p className="text-kulfi-white-400 text-sm md:text-base leading-relaxed font-sans font-medium">
                {activeHeroTheme.slogan}
              </p>
              <div className="text-xs font-mono text-desi-lime-500 uppercase tracking-widest font-extrabold flex items-center gap-1">
                <Printer size={12} /> Premium custom design and printing services. Powered by Local Partners.
              </div>
            </div>

            {/* Interactive Slang Picker Buttons */}
            <div className="space-y-3 pt-4">
              <span className="text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest block font-bold">
                {lang === 'EN' ? 'Choose a template, design it your way 💖' : 'एक टेम्पलेट चुनें, अपने तरीके से डिज़ाइन करें 💖'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PREVIEW_PRODUCTS.map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      playSynthSound('click', soundMuted);
                      setHeroProductIdx(idx);
                    }}
                    className={`py-3 px-2 rounded-xl text-3xs font-heading font-black uppercase tracking-wider transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] border-2 ${
                      heroProductIdx === idx
                        ? 'bg-bhangra-pink-500/10 border-bhangra-pink-500 text-white shadow-neo-flat'
                        : 'bg-jugaad-black-900/60 hover:bg-jugaad-black-900 border-white/10 text-kulfi-white-400 hover:text-white'
                    }`}
                    style={heroProductIdx === idx ? { boxShadow: `4px 4px 0px 0px #090A0F, 6px 6px 0px 0px #FF007F` } : {}}
                  >
                    {prod.id === 'tshirt' ? '👕 Tee' : prod.id === 'hoodie' ? '🧥 Hood' : prod.id === 'mug' ? '☕ Mug' : prod.id === 'notebook' ? '📓 Book' : prod.id === 'phone_case' ? '📱 Case' : '🖊️ Pen'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Jacket-Style Structural Assembly Preview */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            {/* Assembly Visual Arena */}
            <div 
              className="relative w-full max-w-[320px] aspect-square rounded-[32px_8px_32px_8px] border-3 border-jugaad-black-950 shadow-neo-flat overflow-hidden flex justify-center items-center transition-all duration-300"
              style={{ 
                backgroundColor: activeHeroTheme.color,
                boxShadow: `4px 4px 0px 0px #090A0F, 8px 8px 0px 0px ${activeHeroTheme.color}` 
              }}
            >
              {/* Decorative print target overlay */}
              <div className="absolute inset-4 border border-dashed border-white/10 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border border-white/5 rounded-full"></div>
              </div>

              {/* 1. Base Layer (slides in from left) */}
              <div 
                key={`base-${heroProductIdx}`} 
                className="absolute inset-0 p-6 pointer-events-none flex justify-center items-center"
                style={{
                  animation: 'hero-base-assemble 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              >
                <img 
                  src={activeHeroProduct.image}
                  className="max-w-[90%] max-h-[90%] object-contain" 
                  style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
                  alt="Base Blank"
                />
              </div>

              {/* 3. Printing Design Graphic layer (drops down from top) */}
              <div 
                key={`graphic-${heroProductIdx}`}
                className="absolute aspect-square pointer-events-none flex justify-center items-center"
                style={{
                  top: activeHeroProduct.placement.top,
                  left: activeHeroProduct.placement.left,
                  transform: activeHeroProduct.placement.transform,
                  width: activeHeroProduct.placement.width,
                  animation: 'hero-graphic-assemble 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              >
                <img 
                  src={[
                    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop'
                  ][heroProductIdx]} 
                  className="w-full h-full object-contain filter drop-shadow-md rounded"
                  style={{ mixBlendMode: 'multiply' }}
                  alt="Print Graphic" 
                />
              </div>

              {/* 4. Text layer (slides from right) */}
              <div 
                key={`text-${heroProductIdx}`}
                className="absolute w-full text-center pointer-events-none select-none font-heading font-black tracking-tight"
                style={{
                  bottom: '10%',
                  color: '#FAF9F6',
                  textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                  fontSize: activeHeroProduct.placement.fontSize || '1.1rem',
                  animation: 'hero-text-assemble 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              >
                {activeHeroTheme.text}
              </div>

              {/* 5. CMYK laser flash overlay */}
              <div 
                key={`flash-${heroProductIdx}`}
                className="absolute inset-0 bg-desi-lime-500 pointer-events-none mix-blend-color z-20"
                style={{
                  animation: 'hero-flash-overlay 0.7s ease-out forwards'
                }}
              ></div>
            </div>

            {/* Quick Action Button under product model */}
            <button
              onClick={() => {
                if (onCustomizeClick) {
                  onCustomizeClick(activeHeroProduct.id);
                }
              }}
              className="mt-6 px-6 py-2.5 rounded-lg border-2 border-white/20 hover:border-desi-lime-500 text-xs font-mono font-bold uppercase text-white hover:text-desi-lime-500 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center gap-1.5 bg-jugaad-black-900/60"
            >
              Let's Print This! 🎨
            </button>
          </div>

        </div>

      </section>

      {/* 2. HORIZONTAL SCROLLING STICKER MARQUEE */}
      <section className="py-2 border-y-4 border-jugaad-black-950 bg-jugaad-black-900 relative overflow-hidden transform rotate-1">
        
        {/* Track 1: Moving Left */}
        <div className="flex whitespace-nowrap overflow-hidden py-2.5">
          <div className="flex gap-4 items-center animate-custom-marquee font-heading text-sm md:text-base font-black text-jugaad-black select-none">
            {/* Repetitive list to allow smooth loop */}
            {[...MARQUEE_ITEMS_1, ...MARQUEE_ITEMS_1].map((text, i) => (
              <div 
                key={`m1-${i}`}
                className={`px-6 py-2 rounded-xl border-2 border-jugaad-black-950 shadow-neo-flat transition-transform hover:scale-105 active:scale-95 cursor-pointer uppercase ${
                  i % 3 === 0 ? 'bg-bhangra-pink-500 text-white' : i % 3 === 1 ? 'bg-desi-lime-500 text-jugaad-black-950' : 'bg-masala-orange-500 text-white'
                }`}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Moving Right */}
        <div className="flex whitespace-nowrap overflow-hidden border-t-2 border-jugaad-black-950/20 py-2.5">
          <div className="flex gap-4 items-center animate-custom-marquee-reverse font-heading text-sm md:text-base font-black text-jugaad-black select-none">
            {[...MARQUEE_ITEMS_2, ...MARQUEE_ITEMS_2].map((text, i) => (
              <div 
                key={`m2-${i}`}
                className={`px-6 py-2 rounded-xl border-2 border-jugaad-black-950 shadow-neo-flat transition-transform hover:scale-105 active:scale-95 cursor-pointer uppercase ${
                  i % 3 === 0 ? 'bg-vibe-purple-500 text-white' : i % 3 === 1 ? 'bg-kulfi-white-100 text-jugaad-black-950' : 'bg-desi-lime-500 text-jugaad-black-950'
                }`}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. CORE IDENTITY: SQUEEGEE SILKSCREEN PRINT SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded bg-vibe-purple-500/10 text-vibe-purple-500 border border-vibe-purple-500/20 font-mono text-xs uppercase tracking-widest">
            {lang === 'EN' ? 'HOW THE MAGIC HAPPENS' : 'प्रिंटिंग प्रक्रिया अनुभव करें'}
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase leading-none">
            {lang === 'EN' ? 'TACTILE SILKSCREEN EXPERIENCE' : 'सिल्क स्क्रीन प्रिंटिंग का अनुभव'}
          </h2>
          <p className="text-kulfi-white-400 text-sm md:text-base">
            {lang === 'EN' 
              ? "Grab the heavy wood squeegee handle below and pull it all the way down to flood ink across the mesh. Experience the raw compression that binds dye onto fibers."
              : "नीचे दिए गए लकड़ी के हैंडल को पकड़ें और इसे नीचे की ओर खींचें। महसूस करें कि कैसे स्याही कपड़े में समा जाती है।"}
          </p>
        </div>

        {/* Silkscreen frame mockup */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-jugaad-black-900 border-4 border-jugaad-black-950 rounded-[16px_48px_16px_48px] overflow-hidden relative shadow-2xl p-4 md:p-6 bg-gradient-to-b from-jugaad-black-900 to-jugaad-black-950">
            
            {/* Screen border styling */}
            <div className="absolute top-2 left-2 text-3xs font-mono text-white/30 uppercase tracking-widest z-20">
              FRAME MESH NO. 120T • ALUMINUM TENSION
            </div>
            
            {/* Cured Overlay / Sparks */}
            {printCured && (
              <div className="absolute inset-0 bg-jugaad-black-950/80 z-30 flex flex-col items-center justify-center text-center p-6 animate-print-slide">
                <div className="w-16 h-16 bg-desi-lime-500 text-jugaad-black-950 rounded-full flex items-center justify-center mb-4 shadow-glow-lime">
                  <Sparkles size={32} className="animate-spin" />
                </div>
                <h3 className="font-heading text-2xl font-black text-white uppercase">PRINT SECURED & CURED!</h3>
                <p className="text-kulfi-white-400 text-xs mt-2 max-w-sm">
                  Premium Custom Printing. The ink has cured at 160°C. Silkscreen process completed successfully.
                </p>
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleResetSqueegee}
                    className="px-4 py-2 border-2 border-white/20 hover:border-white text-white rounded-lg text-xs font-mono uppercase transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Reset Screen
                  </button>
                  <button 
                    onClick={triggerCustomizeLab}
                    className="px-5 py-2 bg-bhangra-pink-500 text-white rounded-lg text-xs font-heading font-extrabold uppercase transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center gap-1.5"
                  >
                    Load in Customizer &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Canvas workspace (Vertical Dragging Area) */}
            <div 
              ref={squeegeeScreenRef}
              onMouseDown={(e) => {
                squeegeeDraggingRef.current = true;
                setIsSqueegeeDragging(true);
                updateSqueegeePos(e.clientY);
              }}
              onTouchStart={(e) => {
                squeegeeDraggingRef.current = true;
                setIsSqueegeeDragging(true);
                if (e.touches.length > 0) {
                  updateSqueegeePos(e.touches[0].clientY);
                }
              }}
              className="h-[360px] md:h-[420px] w-full rounded-[32px_8px_32px_8px] relative overflow-hidden bg-jugaad-black-950 border-2 border-white/10 select-none cursor-ns-resize"
            >
              
              {/* Mesh texture screen layer */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:3px_3px] opacity-70 pointer-events-none"></div>

              {/* Design Underneath (Fully Revealed based on squeegee position) */}
              <div 
                className="absolute inset-0 select-none pointer-events-none bg-jugaad-black-900 flex flex-col justify-center items-center p-6 text-center"
                style={{ clipPath: `inset(0 0 ${100 - squeegeePos}% 0)` }}
              >
                {/* Pop art typography / Graphic inside the mesh */}
                <div className="relative border-4 border-dashed border-bhangra-pink-500/30 p-8 rounded-xl bg-jugaad-black-950/80 max-w-sm w-full space-y-4">
                  <div className="absolute -top-3 left-6 px-2 bg-bhangra-pink-500 text-white font-mono text-[9px] uppercase tracking-wider rounded">
                    SQUEEGEE ALIGNED
                  </div>

                  {/* Stunning pop art vector simulation */}
                  <svg className="w-24 h-24 mx-auto text-desi-lime-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" className="animate-spin-gradient" style={{ transformOrigin: '50px 50px' }} />
                    <path d="M30 65C30 65 38 72 50 72C62 72 70 65 70 65" stroke="#FF007F" strokeWidth="4" strokeLinecap="round" />
                    <rect x="35" y="38" width="10" height="10" rx="2" fill="currentColor" />
                    <rect x="55" y="38" width="10" height="10" rx="2" fill="currentColor" />
                    <path d="M42 34H58" stroke="currentColor" strokeWidth="3" />
                  </svg>

                  <div className="space-y-1">
                    <span className="font-heading font-black text-2xl text-white uppercase block tracking-tighter">
                      PRESS BOOK LABS
                    </span>
                    <span className="font-mono text-3xs text-kulfi-white-400 block tracking-widest uppercase">
                      Mumbai • Ludhiana • Cyberabad
                    </span>
                  </div>

                  <div className="font-heading text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-bhangra-pink-500 to-masala-orange-500 uppercase tracking-widest">
                    RAW PRINT PRIDE
                  </div>
                </div>
              </div>

              {/* Unprinted screen filter overlay (Semi-transparent mesh layer covering design) */}
              <div 
                className="absolute inset-0 bg-jugaad-black-950/85 pointer-events-none z-10 flex flex-col justify-center items-center"
                style={{ clipPath: `inset(${squeegeePos}% 0 0 0)` }}
              >
                <div className="text-center p-8 space-y-3 opacity-60">
                  <Printer size={36} className="mx-auto text-white/40 animate-pulse" />
                  <div className="text-xs font-mono uppercase text-white/50 tracking-wider">
                    Swipe down to print some magic! ✨
                  </div>
                </div>
              </div>

              {/* The Squeegee Squeegee Handle (Visual Bar) */}
              <div 
                className="absolute left-0 right-0 h-10 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-y-3 border-jugaad-black-950 shadow-lg flex items-center justify-center z-20 cursor-grab active:cursor-grabbing"
                style={{ 
                  top: `calc(${squeegeePos}% - 20px)`,
                  transition: isSqueegeeDragging ? 'none' : 'top 0.2s ease-out'
                }}
              >
                {/* Wooden handle metallic brace */}
                <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-4 bg-gray-300/20 border-y border-white/10 rounded flex items-center justify-between px-4 font-mono text-[9px] text-white/60">
                  <span>◀ DRAG HANDLE ▶</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                    <span>PRESSURE READY</span>
                  </div>
                  <span>{Math.round(squeegeePos)}%</span>
                </div>
                {/* Rubber squeegee blade sticking out underneath */}
                <div className="absolute bottom-[-10px] left-0 right-0 h-[10px] bg-desi-lime-500 opacity-90"></div>
              </div>

            </div>

            {/* Instructions bottom helper */}
            <div className="mt-3 flex justify-between items-center text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest">
              <span>Squeegee Speed: 24cm/sec</span>
              <span className="text-desi-lime-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-desi-lime-500 rounded-full animate-pulse"></span>
                Swipe down to print some magic! ✨
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* 4. INTERACTIVE CARD REEL & LIVE APPAREL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-jugaad-black-950 pb-6 gap-4">
          <div>
            <span className="px-3 py-1 rounded bg-bhangra-pink-500/10 text-bhangra-pink-500 border border-bhangra-pink-500/20 font-mono text-xs uppercase tracking-widest">
              {lang === 'EN' ? 'INTERACTIVE MOCKUP CENTER' : 'लाइव मर्चेंट प्रीव्यू'}
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mt-2">
              {lang === 'EN' ? 'PREVIEW ON BLANK APPAREL' : 'ब्लैंक मर्च पर प्रीव्यू करें'}
            </h2>
          </div>
          <p className="text-kulfi-white-400 text-sm max-w-sm font-sans">
            {lang === 'EN'
              ? "Select any blank merchandise, choose a canvas shade, configure your slang print text, and see it render live before entering the Custom Lab."
              : "किसी भी आइटम को चुनें, कैनवास शेड चुनें, स्लोगन टेक्स्ट लिखें और कस्टमाइज़ेशन लैब में जाने से पहले लाइव प्रीव्यू देखें।"}
          </p>
        </div>

        {/* Custom Mockup Creator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Live Canvas Presentation */}
          <div className="lg:col-span-7 bg-jugaad-black-900 border-3 border-jugaad-black-950 rounded-[32px_8px_32px_8px] p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-[460px] bg-radial from-jugaad-black-900 to-jugaad-black-950">
            
            {/* Abs backdrop blur details */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-bhangra-pink-500/10 rounded-full filter blur-[80px] pointer-events-none z-0"></div>

            {/* Spec Sheet Badge info */}
            <div className="w-full flex justify-between items-center z-10">
              <div className="text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest space-y-0.5">
                <div>DPI: <span className="text-desi-lime-500">300 VIBE LEVEL</span></div>
                <div>RENDER: <span className="text-white">STREETWEAR FIT</span></div>
              </div>
              <div className="bg-jugaad-black-950 border border-white/10 px-3 py-1 rounded text-3xs font-mono text-white">
                ₹{activeProduct.defaultPrice} MOCKUP
              </div>
            </div>

            {/* Render Blank apparel Image with text superimposed */}
            <div 
              className="my-8 relative rounded-xl shadow-2xl flex justify-center items-center w-full max-w-[320px] transition-all duration-300"
              style={{ 
                backgroundColor: activeShade.hex,
                aspectRatio: activeProduct.id === 'phone_case' ? '2/3' : (activeProduct.id === 'tshirt' || activeProduct.id === 'hoodie' || activeProduct.id === 'notebook') ? '4/5' : activeProduct.id === 'pen' ? '3/1' : '1/1'
              }}
            >
              {/* Product mockup mask overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden flex justify-center items-center p-6">
                <img 
                  src={activeProduct.image} 
                  className="max-w-[90%] max-h-[90%] object-contain" 
                  style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
                  alt={activeProduct.name} 
                />
              </div>

              {/* Dynamic printed text overlay layer */}
              <div 
                className="absolute text-center select-none pointer-events-none z-10 px-3 truncate max-w-full font-heading font-black tracking-tight"
                style={{
                  top: activeProduct.placement.top,
                  left: activeProduct.placement.left,
                  transform: activeProduct.placement.transform,
                  width: activeProduct.placement.width,
                  color: activeInk.hex,
                  textShadow: '0 2px 10px rgba(0,0,0,0.65)',
                  fontSize: activeProduct.placement.fontSize,
                  textTransform: activeProduct.placement.textTransform
                }}
              >
                {customText || 'PRESS BOOK'}
              </div>

            </div>

            {/* Spec Sheet Footer inside Canvas */}
            <div className="w-full border-t border-white/5 pt-4 grid grid-cols-3 text-center gap-2 font-mono text-3xs text-kulfi-white-400 z-10 uppercase">
              <div>
                <span className="block text-[8px]">SELECTED SWAG</span>
                <span className="text-white font-bold">{activeProduct.name}</span>
              </div>
              <div>
                <span className="block text-[8px]">CANVAS DYE</span>
                <span className="text-white font-bold">{activeShade.name}</span>
              </div>
              <div>
                <span className="block text-[8px]">INK PIGMENT</span>
                <span className="text-desi-lime-500 font-bold">{activeInk.name}</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Live Workstation Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-jugaad-black-900 border-3 border-jugaad-black-950 rounded-[16px_48px_16px_48px] p-6 space-y-6">
            
            <div className="space-y-6">
              
              {/* Product Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest font-bold">
                  <span>1. CHOOSE MERCHANDISE</span>
                  <span className="text-bhangra-pink-500">{previewProductIdx + 1} / {PREVIEW_PRODUCTS.length}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PREVIEW_PRODUCTS.map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        playSynthSound('click', soundMuted);
                        setPreviewProductIdx(idx);
                      }}
                      className={`py-3 rounded-lg text-center font-heading font-black text-2xs uppercase tracking-wide transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] border-2 ${
                        previewProductIdx === idx
                          ? 'border-bhangra-pink-500 bg-bhangra-pink-500/10 text-white shadow-neo-flat shadow-desi-lime-500'
                          : 'border-white/10 text-kulfi-white-400 bg-jugaad-black-950/40 hover:bg-jugaad-black-950'
                      }`}
                    >
                      {prod.id === 'tshirt' ? '👕 Tee' : prod.id === 'hoodie' ? '🧥 Hood' : prod.id === 'mug' ? '☕ Mug' : prod.id === 'notebook' ? '📓 Book' : prod.id === 'phone_case' ? '📱 Case' : '🖊️ Pen'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Shade Picker */}
              <div className="space-y-2">
                <span className="text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest font-bold block">
                  🎨 Pick a canvas shade
                </span>
                <div className="flex flex-wrap gap-2">
                  {CANVAS_SHADES.map((shade, idx) => (
                    <button
                      key={shade.name}
                      onClick={() => {
                        playSynthSound('click', soundMuted);
                        setSelectedShadeIdx(idx);
                      }}
                      className={`w-9 h-9 rounded-full border-3 transition-transform ${
                        selectedShadeIdx === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Text Input */}
              <div className="space-y-2">
                <span className="text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest font-bold block">
                  What should it say? ✍️
                </span>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                    className="w-full bg-jugaad-black-950 border-2 border-white/10 rounded-xl px-4 py-3 text-sm text-white font-heading font-black uppercase tracking-wider focus:outline-none focus:border-bhangra-pink-500 transition"
                    placeholder="Enter custom slogan..."
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-4xs font-mono text-kulfi-white-400">
                    {customText.length}/16
                  </div>
                </div>
              </div>

              {/* Ink Color Picker */}
              <div className="space-y-2">
                <span className="text-3xs font-mono text-kulfi-white-400 uppercase tracking-widest font-bold block">
                  4. SELECT INK PIGMENT
                </span>
                <div className="flex flex-wrap gap-2">
                  {INK_COLORS.map((ink, idx) => (
                    <button
                      key={ink.name}
                      onClick={() => {
                        playSynthSound('click', soundMuted);
                        setSelectedInkIdx(idx);
                      }}
                      className={`h-8 px-3 rounded-lg border-2 text-2xs font-heading font-black uppercase transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] ${
                        selectedInkIdx === idx 
                          ? 'border-white scale-105 shadow-md' 
                          : 'border-white/10 hover:border-white/30 hover:scale-102'
                      }`}
                      style={{ backgroundColor: ink.hex, color: ink.hex === '#FAF9F6' ? '#090A0F' : '#FAF9F6' }}
                    >
                      {ink.name.split(' ')[1] || ink.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Launch Lab Trigger */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-kulfi-white-400">
                <span>ESTIMATED PRICE</span>
                <span className="text-lg font-heading font-black text-white">₹{activeProduct.defaultPrice}</span>
              </div>

              <button
                onClick={triggerCustomizeLab}
                className="w-full py-4 rounded-xl font-heading font-black uppercase tracking-widest bg-bhangra-pink-500 hover:bg-bhangra-pink-600 text-white border-2 border-jugaad-black-950 shadow-neo-flat shadow-desi-lime-500 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2"
                style={{ boxShadow: '4px 4px 0px 0px #090A0F, 6px 6px 0px 0px #ADFF2F' }}
              >
                <Sparkles size={16} className="animate-spin" /> Open Customizer Lab
              </button>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
