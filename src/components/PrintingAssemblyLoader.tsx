import React, { useState, useEffect, useMemo, useRef } from 'react';

export interface PrintingAssemblyLoaderProps {
  /**
   * Type of item to customize and print
   * @default 'tshirt'
   */
  itemType?: 'tshirt' | 'mug';
  /**
   * Custom text to print on the item
   * @default 'FRESH PRINT'
   */
  customText?: string;
  /**
   * Color of the custom text (HEX, HSL, RGB or keyword)
   * @default '#ff3366'
   */
  customTextColor?: string;
  /**
   * Preset graphic template to print
   * @default 'retro'
   */
  customGraphic?: 'retro' | 'mountain' | 'geometric' | 'custom';
  /**
   * Image URL to use if customGraphic is set to 'custom'
   */
  customGraphicUrl?: string;
  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: 'slow' | 'normal' | 'fast';
  /**
   * If true, runs as an overlay loader, hiding local customization controls
   * @default false
   */
  loadingMode?: boolean;
  /**
   * Whether to start the animation automatically on mount
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Whether to loop the animation continuously
   * @default true
   */
  loop?: boolean;
  /**
   * Callback fired when a single print cycle finishes
   */
  onPrintComplete?: () => void;
  /**
   * Primary color for the printer machine
   * @default '#00f2fe'
   */
  accentColor?: string;
  /**
   * Color of the blank T-shirt
   * @default '#ffffff'
   */
  shirtColor?: string;
  /**
   * Color of the blank Mug
   * @default '#f8fafc'
   */
  mugColor?: string;
  /**
   * Custom class name for the wrapper
   */
  className?: string;
}

type PrintingStep = 'idle' | 'feeding' | 'aligning' | 'pressing' | 'revealing' | 'complete';

// Animation speed configurations (ms)
const SPEED_CONFIGS = {
  fast: { feed: 400, align: 500, press: 800, reveal: 350, complete: 250, total: 2300 },
  normal: { feed: 900, align: 1100, press: 1600, reveal: 600, complete: 400, total: 4600 },
  slow: { feed: 1600, align: 1800, press: 2800, reveal: 1100, complete: 700, total: 8000 }
};

// Preset Graphics
const RetroGraphic: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="retro-sun" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff007f" />
        <stop offset="40%" stopColor="#ff5500" />
        <stop offset="100%" stopColor="#ffcc00" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="45" r="28" fill="url(#retro-sun)" />
    {/* Sun cuts */}
    <rect x="15" y="44" width="70" height="2" fill="var(--pal-item-bg, #ffffff)" />
    <rect x="15" y="50" width="70" height="3" fill="var(--pal-item-bg, #ffffff)" />
    <rect x="15" y="57" width="70" height="3.5" fill="var(--pal-item-bg, #ffffff)" />
    <rect x="15" y="65" width="70" height="4" fill="var(--pal-item-bg, #ffffff)" />
    {/* Grid floor */}
    <path d="M 10 74 L 90 74 M 10 74 L 28 96 M 90 74 L 72 96 M 50 74 L 50 96 M 30 74 L 41 96 M 70 74 L 59 96" stroke="#00f2fe" strokeWidth="1.2" opacity="0.7" />
    <line x1="20" y1="79" x2="80" y2="79" stroke="#00f2fe" strokeWidth="0.8" opacity="0.6" />
    <line x1="16" y1="86" x2="84" y2="86" stroke="#00f2fe" strokeWidth="0.8" opacity="0.6" />
    {/* Palms */}
    <path d="M 22 74 Q 20 54 15 44 C 22 42 27 41 29 40 M 15 44 Q 9 39 5 41 M 15 44 Q 15 35 19 33 M 15 44 Q 21 49 22 54" stroke="#1e293b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    <path d="M 78 74 Q 80 57 85 47 C 79 45 74 44 72 43 M 85 47 Q 91 42 95 44 M 85 47 Q 85 38 81 36 M 85 47 Q 79 52 78 57" stroke="#1e293b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
  </svg>
);

const MountainGraphic: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id="mountain-sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="60%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#311042" />
      </linearGradient>
      <linearGradient id="mountain-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#mountain-sky)" />
    {/* Glowing Moon */}
    <circle cx="70" cy="32" r="7" fill="#fef08a" filter="drop-shadow(0 0 4px rgba(254, 240, 138, 0.6))" />
    <circle cx="66" cy="32" r="7" fill="#0f172a" />
    {/* Stars */}
    <circle cx="30" cy="26" r="0.6" fill="#fff" opacity="0.8" />
    <circle cx="24" cy="38" r="0.5" fill="#fff" opacity="0.6" />
    <circle cx="48" cy="22" r="0.7" fill="#fff" opacity="0.9" />
    <circle cx="54" cy="34" r="0.5" fill="#fff" opacity="0.7" />
    {/* Back Mountain */}
    <path d="M 22 72 L 46 44 L 66 67 L 76 54 L 88 72 Z" fill="url(#mountain-body)" opacity="0.7" />
    {/* Front Mountain */}
    <path d="M 12 76 L 36 50 L 58 74 L 72 60 L 88 76 Z" fill="#0f172a" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
    {/* Pine trees silhouettes */}
    <path d="M 20 76 L 20 69 L 17 72 L 20 67 L 23 72 L 20 69 Z" fill="#064e3b" />
    <path d="M 26 76 L 26 66 L 22 70 L 26 63 L 30 70 L 26 66 Z" fill="#022c22" />
    <path d="M 80 76 L 80 68 L 77 71 L 80 65 L 83 71 L 80 68 Z" fill="#064e3b" />
  </svg>
);

const GeometricGraphic: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id="geom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="50%" stopColor="#9b51e0" />
        <stop offset="100%" stopColor="#ff007f" />
      </linearGradient>
    </defs>
    {/* Hexagons */}
    <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="url(#geom-grad)" strokeWidth="3" strokeLinejoin="round" />
    <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="none" stroke="url(#geom-grad)" strokeWidth="1.2" opacity="0.7" strokeLinejoin="round" />
    {/* Triangle structure inside */}
    <polygon points="50,26 68,58 32,58" fill="none" stroke="url(#geom-grad)" strokeWidth="1.5" opacity="0.9" />
    {/* Center Core */}
    <circle cx="50" cy="48" r="6" fill="url(#geom-grad)" filter="drop-shadow(0 0 6px #9b51e0)" />
    {/* Scanning nodes */}
    <circle cx="50" cy="12" r="2.5" fill="#00f2fe" />
    <circle cx="83" cy="69" r="2.5" fill="#ff007f" />
    <circle cx="17" cy="69" r="2.5" fill="#9b51e0" />
  </svg>
);

// Blank Items
const TshirtSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
    <g filter="drop-shadow(0 12px 20px rgba(0,0,0,0.3))">
      {/* T-Shirt Body Outline & Base */}
      <path
        d="M 100 22 C 92 22 80 25 72 29 L 36 45 C 32 47 30 51 32 55 L 49 90 C 51 94 56 95 59 93 L 73 85 L 73 168 C 73 173 77 177 82 177 L 118 177 C 123 177 127 173 127 168 L 127 85 L 141 93 C 144 95 149 94 151 90 L 168 55 C 170 51 168 47 164 45 L 128 29 C 120 25 108 22 100 22 Z"
        fill={color}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Sleeve folds / shading */}
      <path d="M 73 85 L 59 93" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 127 85 L 141 93" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
      {/* Collar Shadow and Trim */}
      <path d="M 84 25 C 88 32 112 32 116 25" fill="rgba(0,0,0,0.15)" />
      <path d="M 83 24 C 90 33 110 33 117 24 C 120 25 128 29 128 29 C 120 25 108 22 100 22 C 92 22 80 25 72 29 C 72 29 80 25 83 24 Z" fill="rgba(0,0,0,0.05)" />
      {/* Soft folds in cloth */}
      <path d="M 49 80 C 58 82 66 80 70 76" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" fill="none" />
      <path d="M 151 80 C 142 82 134 80 130 76" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" fill="none" />
      <path d="M 78 125 C 88 130 112 130 122 125" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

const MugSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
    <g filter="drop-shadow(0 12px 20px rgba(0,0,0,0.3))">
      {/* Mug Handle */}
      <path
        d="M 125 55 C 168 55 178 75 178 100 C 178 125 168 145 125 145 M 125 71 C 153 71 158 86 158 100 C 158 114 153 129 125 129"
        fill={color}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.5"
      />
      {/* Mug Handle Shadow overlay */}
      <path
        d="M 125 60 C 158 60 168 75 168 100 C 168 125 158 140 125 140 C 128 140 148 130 148 100 C 148 70 128 60 125 60 Z"
        fill="black"
        opacity="0.08"
      />
      {/* Mug Body */}
      <rect x="50" y="38" width="78" height="120" rx="6" fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Top Rim Oval */}
      <ellipse cx="89" cy="38" rx="39" ry="8" fill="rgba(0,0,0,0.15)" />
      <ellipse cx="89" cy="38" rx="39" ry="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* Cylindrical Highlight specular */}
      <rect x="53" y="40" width="22" height="116" fill="url(#mug-reflection)" style={{ mixBlendMode: 'overlay' }} />
    </g>
    <defs>
      <linearGradient id="mug-reflection" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

interface SparkParticle {
  id: number;
  color: string;
  tx: number;
  ty: number;
  rot: number;
  size: number;
  delay: number;
  shape: 'circle' | 'square' | 'triangle';
}

export const PrintingAssemblyLoader: React.FC<PrintingAssemblyLoaderProps> = ({
  itemType: initialItemType = 'tshirt',
  customText: initialCustomText = 'FRESH PRINT',
  customTextColor: initialCustomTextColor = '#ff3366',
  customGraphic: initialCustomGraphic = 'retro',
  customGraphicUrl = '',
  speed: initialSpeed = 'normal',
  loadingMode = false,
  autoPlay = true,
  loop = true,
  onPrintComplete,
  accentColor = '#00f2fe',
  shirtColor = '#ffffff',
  mugColor = '#f8fafc',
  className = ''
}) => {
  // Local states for customizer testing values
  const [itemType, setItemType] = useState(initialItemType);
  const [customText, setCustomText] = useState(initialCustomText);
  const [customTextColor, setCustomTextColor] = useState(initialCustomTextColor);
  const [customGraphic, setCustomGraphic] = useState(initialCustomGraphic);
  const [speed, setSpeed] = useState(initialSpeed);
  const [isLooping, setIsLooping] = useState(loop);
  
  // Animation core states
  const [step, setStep] = useState<PrintingStep>('idle');
  const [isPrinting, setIsPrinting] = useState(autoPlay);
  const [cycleCount, setCycleCount] = useState(0);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const [isLoadedOverlayVisible, setIsLoadedOverlayVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Speed timings
  const durations = useMemo(() => SPEED_CONFIGS[speed], [speed]);

  // Generate burst spark particles
  const triggerSparks = () => {
    const newSparks: SparkParticle[] = [];
    const colors = ['#00f2fe', '#ff007f', '#ffea00', '#a855f7', '#10b981', '#f97316'];
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    
    // Shoot out 25 particles in random direction & distance
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 85;
      newSparks.push({
        id: Date.now() + i,
        color: colors[Math.floor(Math.random() * colors.length)],
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 10,
        rot: 90 + Math.random() * 360,
        size: 5 + Math.random() * 8,
        delay: Math.random() * 120,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    setSparks(newSparks);
  };

  // State machine logic
  useEffect(() => {
    if (!isPrinting) {
      setStep('idle');
      return;
    }

    setStep('feeding');

    const t1 = setTimeout(() => {
      setStep('aligning');

      const t2 = setTimeout(() => {
        setStep('pressing');

        const t3 = setTimeout(() => {
          setStep('revealing');
          triggerSparks();

          const t4 = setTimeout(() => {
            setStep('complete');
            if (onPrintComplete) onPrintComplete();

            const t5 = setTimeout(() => {
              if (isLooping) {
                // Trigger reload loop by incrementing cycle
                setCycleCount(c => c + 1);
              } else {
                setIsPrinting(false);
                setStep('idle');
              }
            }, durations.complete);

            return () => clearTimeout(t5);
          }, durations.reveal);

          return () => clearTimeout(t4);
        }, durations.press);

        return () => clearTimeout(t3);
      }, durations.align);

      return () => clearTimeout(t2);
    }, durations.feed);

    return () => {
      clearTimeout(t1);
    };
  }, [isPrinting, cycleCount, isLooping, durations, onPrintComplete]);

  // Sync prop changes to local customizer states
  useEffect(() => {
    setItemType(initialItemType);
  }, [initialItemType]);

  useEffect(() => {
    setCustomText(initialCustomText);
  }, [initialCustomText]);

  useEffect(() => {
    setCustomTextColor(initialCustomTextColor);
  }, [initialCustomTextColor]);

  useEffect(() => {
    setCustomGraphic(initialCustomGraphic);
  }, [initialCustomGraphic]);

  useEffect(() => {
    setSpeed(initialSpeed);
  }, [initialSpeed]);

  useEffect(() => {
    setIsLooping(loop);
  }, [loop]);

  // Determine current step status message
  const statusMessage = useMemo(() => {
    switch (step) {
      case 'feeding': return 'FEEDING SUBSTRATE...';
      case 'aligning': return 'CMYK LASER CALIBRATION...';
      case 'pressing': return itemType === 'tshirt' ? 'SQUEEGEE INK SCRAPING...' : 'HEAT PLATES CLOSING...';
      case 'revealing': return 'GRAPHIC FUSION ACTIVATED!';
      case 'complete': return 'PRINT COMPLETED!';
      default: return 'PRINTER STANDBY';
    }
  }, [step, itemType]);

  // Renders correct custom graphic inside print boundary
  const renderGraphic = () => {
    if (customGraphic === 'custom' && customGraphicUrl) {
      return (
        <div className="pal-custom-image-wrapper">
          <img src={customGraphicUrl} alt="custom design" />
        </div>
      );
    }
    if (customGraphic === 'mountain') return <MountainGraphic />;
    if (customGraphic === 'geometric') return <GeometricGraphic />;
    return <RetroGraphic />;
  };

  const activeShirtColor = shirtColor;
  const activeMugColor = mugColor;

  return (
    <div 
      className={`pal-root ${loadingMode ? 'pal-loader-mode' : ''} ${className}`}
      ref={containerRef}
      style={{
        '--pal-accent': accentColor,
        '--pal-item-bg': itemType === 'tshirt' ? activeShirtColor : activeMugColor,
        '--pal-text-color': customTextColor,
        '--pal-feed-dur': `${durations.feed}ms`,
        '--pal-align-dur': `${durations.align}ms`,
        '--pal-press-dur': `${durations.press}ms`,
        '--pal-reveal-dur': `${durations.reveal}ms`,
        '--pal-complete-dur': `${durations.complete}ms`
      } as React.CSSProperties}
    >
      {/* Embed local vanilla CSS block */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Main Styling CSS */
        .pal-root {
          box-sizing: border-box;
          background: #0f172a;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 28px;
          color: #f8fafc;
          max-width: 960px;
          margin: 0 auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: grid;
          grid-template-columns: 1.25fr 0.85fr;
          gap: 28px;
        }

        .pal-root *, .pal-root *::before, .pal-root *::after {
          box-sizing: border-box;
        }

        @media (max-width: 820px) {
          .pal-root {
            grid-template-columns: 1fr;
            padding: 16px;
          }
        }

        /* Loading Spinner Mode */
        .pal-root.pal-loader-mode {
          grid-template-columns: 1fr;
          max-width: 440px;
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }

        .pal-root.pal-loader-mode .pal-panel-controls {
          display: none;
        }

        .pal-root.pal-loader-mode .pal-status-bar {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
        }

        /* Printer Workspace */
        .pal-workspace-container {
          position: relative;
          background: radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          height: 420px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.7);
        }

        /* Frame vibrations during pressing */
        .pal-workspace-container.pal-shaking {
          animation: pal-vibrate 0.1s infinite alternate;
        }

        /* Conveyor Assembly */
        .pal-conveyor {
          position: absolute;
          bottom: 25px;
          left: 5%;
          right: 5%;
          height: 18px;
          background: repeating-linear-gradient(90deg, #1e293b, #1e293b 10px, #334155 10px, #334155 20px);
          border-radius: 4px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 2px rgba(255,255,255,0.06);
          border: 1px solid #475569;
          z-index: 1;
        }

        .pal-conveyor.rolling {
          animation: pal-belt-roll var(--pal-feed-dur) linear infinite;
        }

        /* Item Container */
        .pal-item-wrapper {
          position: relative;
          width: 210px;
          height: 210px;
          transform: translateY(0) scale(1);
          opacity: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          will-change: transform, opacity;
        }

        /* Substrate Animation States */
        .pal-item-wrapper.pal-feeding {
          animation: pal-slide-in var(--pal-feed-dur) cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .pal-item-wrapper.pal-exiting {
          animation: pal-slide-out var(--pal-complete-dur) cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }

        .pal-item-canvas {
          position: absolute;
          top: 30%;
          left: 28%;
          width: 44%;
          height: 44%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
          z-index: 3;
        }

        /* T-Shirt Canvas position correction */
        .pal-canvas-tshirt {
          top: 31%;
          left: 28%;
          width: 44%;
          height: 45%;
        }

        /* Mug Canvas wrap distortion style for curvature */
        .pal-canvas-mug {
          top: 27%;
          left: 29%;
          width: 32%;
          height: 52%;
          transform: perspective(250px) rotateY(-18deg) translateZ(3px);
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }

        .pal-graphic-container {
          width: 78%;
          height: 78%;
          opacity: 0;
          transform: scale(0.95);
          will-change: opacity, transform, filter;
        }

        /* Printed Graphic display state */
        .pal-graphic-container.pal-visible {
          opacity: 1;
          transform: scale(1);
        }

        /* CMYK Flashing ink split effect during calibration */
        .pal-graphic-container.pal-cmyk-calibrating {
          opacity: 0.85;
          animation: pal-cmyk-converge var(--pal-align-dur) ease-in-out infinite;
        }

        /* Real squeegee/press reveal clip-path */
        .pal-graphic-container.pal-ink-pressing-tshirt {
          animation: pal-scrape-reveal var(--pal-press-dur) cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .pal-graphic-container.pal-ink-pressing-mug {
          animation: pal-heat-reveal var(--pal-press-dur) ease-in-out forwards;
        }

        .pal-custom-image-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pal-custom-image-wrapper img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* Custom text on item */
        .pal-canvas-text {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-weight: 800;
          font-size: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 3px;
          text-align: center;
          color: var(--pal-text-color, #ff3366);
          text-shadow: 0 1px 1px rgba(0,0,0,0.15);
          opacity: 0;
          transition: opacity 0.3s;
          white-space: nowrap;
          width: 96%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pal-canvas-text.pal-visible {
          opacity: 1;
        }

        .pal-canvas-text.pal-ink-pressing-tshirt {
          animation: pal-scrape-reveal var(--pal-press-dur) cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .pal-canvas-text.pal-ink-pressing-mug {
          animation: pal-heat-reveal var(--pal-press-dur) ease-in-out forwards;
        }

        /* Shiny sweeping glare effect on completion */
        .pal-shine-glare {
          position: absolute;
          top: -20%;
          left: -150%;
          width: 80%;
          height: 140%;
          background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(20deg);
          z-index: 5;
          pointer-events: none;
        }

        .pal-shine-glare.pal-animate {
          animation: pal-shine-sweep var(--pal-reveal-dur) ease-in-out forwards;
        }

        /* Calibration registration crosshairs */
        .pal-calibrator {
          position: absolute;
          width: 14px;
          height: 14px;
          opacity: 0;
          z-index: 10;
        }

        .pal-calibrator::before, .pal-calibrator::after {
          content: '';
          position: absolute;
          background: #ff007f;
        }

        .pal-calibrator::before { top: 6px; left: 0; width: 14px; height: 2px; }
        .pal-calibrator::after { top: 0; left: 6px; width: 2px; height: 14px; }
        
        .pal-calibrator.top-l { top: 40px; left: 40px; }
        .pal-calibrator.bottom-r { bottom: 65px; right: 40px; }
        .pal-calibrator.top-l::before, .pal-calibrator.top-l::after { background: #00f2fe; }

        .pal-calibrator.pal-flashing {
          animation: pal-blink-cross 0.2s alternate infinite;
        }

        /* Hardware Accelerated Laser Scanning Line */
        .pal-laser-guide {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--pal-accent) 20%, #ffffff 50%, var(--pal-accent) 80%, transparent 100%);
          box-shadow: 0 0 12px 2px var(--pal-accent), 0 0 4px 1px #fff;
          z-index: 8;
          opacity: 0;
          pointer-events: none;
          transform: translateY(0);
          will-change: transform, opacity;
        }

        .pal-laser-guide.scanning {
          animation: pal-laser-sweep var(--pal-align-dur) ease-in-out infinite;
        }

        /* Heat Press Clamping Mechanism */
        .pal-heat-press {
          position: absolute;
          top: 25%;
          bottom: 25%;
          width: 22px;
          background: #27272a;
          border: 2px solid #52525b;
          border-radius: 4px;
          z-index: 6;
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
        }

        .pal-heat-press::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0f172a;
          border: 1.5px solid #71717a;
        }

        .pal-heat-press-left {
          left: 12%;
          border-right: 4px solid #ea580c;
        }

        .pal-heat-press-right {
          right: 12%;
          border-left: 4px solid #ea580c;
        }

        .pal-heat-press-left.clamping {
          animation: pal-clamp-l var(--pal-press-dur) cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .pal-heat-press-right.clamping {
          animation: pal-clamp-r var(--pal-press-dur) cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Screen Squeegee Bar Assembly */
        .pal-squeegee-carriage {
          position: absolute;
          top: 35%;
          left: 20%;
          right: 20%;
          height: 14px;
          background: linear-gradient(180deg, #3f3f46, #18181b);
          border: 1px solid #52525b;
          border-radius: 3px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          z-index: 6;
          opacity: 0;
          transform: translateY(-20px);
          transition: transform 0.4s, opacity 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pal-squeegee-carriage.active {
          opacity: 1;
          transform: translateY(0);
        }

        .pal-squeegee-blade {
          position: absolute;
          top: 13px;
          left: 0;
          width: 32px;
          height: 20px;
          background: linear-gradient(180deg, #f59e0b, #d97706, #18181b);
          border-bottom: 3px solid #ffea00;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          z-index: 7;
        }

        .pal-squeegee-blade.scraping {
          animation: pal-scraper-run var(--pal-press-dur) cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
        }

        /* Steam Puff Particles during heat transfer */
        .pal-steam {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%);
          filter: blur(2px);
          opacity: 0;
          z-index: 7;
          pointer-events: none;
        }

        .pal-steam-1 { left: 32%; top: 40%; }
        .pal-steam-2 { right: 32%; top: 45%; }
        .pal-steam-3 { left: 45%; top: 32%; }

        .pal-steam.puffing {
          animation: pal-steam-rise var(--pal-press-dur) ease-out infinite;
        }

        /* Confetti / Spark Particles */
        .pal-spark {
          position: absolute;
          pointer-events: none;
          z-index: 12;
          transform: translate(0, 0) scale(1) rotate(0deg);
          opacity: 0;
        }

        .pal-spark.burst {
          animation: pal-spark-shoot var(--pal-reveal-dur) cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .pal-spark.shape-circle { border-radius: 50%; }
        .pal-spark.shape-triangle {
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid var(--spark-color);
        }

        /* Printer Machine Housing Panels */
        .pal-printer-hood {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(180deg, #1e293b, #0f172a);
          border-bottom: 2px solid #334155;
          z-index: 5;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .pal-hood-bolt {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #475569;
          box-shadow: inset 0 1px 1px black;
        }

        .pal-hood-screencase {
          background: #090d16;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 2px 10px;
          font-family: monospace;
          font-size: 11px;
          color: #10b981;
          letter-spacing: 0.5px;
          box-shadow: inset 0 0 6px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pal-led-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .pal-led-dot.calibrating {
          background: #f59e0b;
          box-shadow: 0 0 6px #f59e0b;
          animation: pal-led-blink 0.3s infinite alternate;
        }

        .pal-led-dot.pressing {
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
          animation: pal-led-blink 0.15s infinite alternate;
        }

        /* Status Banner Bottom */
        .pal-status-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #090d16;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 5;
        }

        .pal-status-text {
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 1px;
          color: #94a3b8;
          font-weight: bold;
        }

        .pal-progress-track {
          width: 140px;
          height: 6px;
          background: #1e293b;
          border-radius: 3px;
          overflow: hidden;
        }

        .pal-progress-fill {
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, #00f2fe, #9b51e0);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .pal-progress-fill.filling { width: 20%; transition: width var(--pal-feed-dur) linear; }
        .pal-progress-fill.aligning { width: 45%; transition: width var(--pal-align-dur) linear; }
        .pal-progress-fill.pressing { width: 80%; transition: width var(--pal-press-dur) linear; }
        .pal-progress-fill.revealing { width: 95%; transition: width var(--pal-reveal-dur) linear; }
        .pal-progress-fill.complete { width: 100%; transition: width 0.2s linear; }

        /* Control Panel */
        .pal-panel-controls {
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: rgba(30, 41, 59, 0.4);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px;
        }

        .pal-control-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.5px;
          color: #f8fafc;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pal-control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pal-control-label {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pal-input-text {
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .pal-input-text:focus {
          border-color: var(--pal-accent);
        }

        .pal-toggle-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .pal-toggle-btn {
          background: #090d16;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 10px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .pal-toggle-btn.active {
          background: rgba(0, 242, 254, 0.12);
          border-color: var(--pal-accent);
          color: #00f2fe;
          box-shadow: 0 0 10px rgba(0, 242, 254, 0.1);
        }

        .pal-graphic-presets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .pal-graphic-preset-btn {
          background: #090d16;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 8px 6px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pal-graphic-preset-btn.active {
          background: rgba(155, 81, 224, 0.12);
          border-color: #9b51e0;
          color: #c084fc;
        }

        .pal-color-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pal-color-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.2s, border-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pal-color-dot.active {
          border-color: #ffffff;
          transform: scale(1.15);
          box-shadow: 0 0 8px rgba(255,255,255,0.4);
        }

        .pal-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
          cursor: pointer;
          user-select: none;
        }

        .pal-checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--pal-accent);
          cursor: pointer;
        }

        .pal-primary-btn {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
          color: #090d16;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }

        .pal-primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
        }

        .pal-primary-btn:active {
          transform: translateY(0);
        }

        .pal-primary-btn.pal-btn-stop {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .pal-primary-btn.pal-btn-stop:hover {
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        /* Loading Demo Trigger Banner */
        .pal-loader-demo-banner {
          grid-column: span 2;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 12px;
          padding: 12px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #a7f3d0;
        }

        @media (max-width: 820px) {
          .pal-loader-demo-banner {
            grid-column: span 1;
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }

        .pal-demo-btn {
          background: #10b981;
          color: #064e3b;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .pal-demo-btn:hover {
          opacity: 0.9;
        }

        /* Full Screen Loader Overlay Preview */
        .pal-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(9, 13, 22, 0.92);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 24px;
        }

        .pal-overlay-close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pal-overlay-close-btn:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }

        /* KEYFRAME ANIMATIONS */
        @keyframes pal-slide-in {
          0% { transform: translateY(-160%) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes pal-slide-out {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(160%) scale(0.85); opacity: 0; }
        }

        @keyframes pal-vibrate {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          100% { transform: translate(-1.5px, -1px) rotate(-0.5deg); }
        }

        @keyframes pal-belt-roll {
          0% { background-position-x: 0px; }
          100% { background-position-x: 40px; }
        }

        @keyframes pal-laser-sweep {
          0%, 100% { transform: translateY(0); opacity: 0; }
          5% { opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateY(240px); opacity: 1; }
          85% { opacity: 1; }
          95% { opacity: 0; }
        }

        @keyframes pal-blink-cross {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }

        @keyframes pal-led-blink {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        /* Heat Press clamping mechanics */
        @keyframes pal-clamp-l {
          0% { transform: translateX(-40px); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-40px); opacity: 0; }
        }

        @keyframes pal-clamp-r {
          0% { transform: translateX(40px); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(40px); opacity: 0; }
        }

        /* Scraper squeegee blade movement */
        @keyframes pal-scraper-run {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 82%; opacity: 0; }
        }

        /* Clip reveals */
        @keyframes pal-scrape-reveal {
          0% { clip-path: inset(0 100% 0 0); }
          10% { clip-path: inset(0 100% 0 0); }
          90% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes pal-heat-reveal {
          0% { clip-path: circle(0% at 50% 50%); }
          20% { clip-path: circle(0% at 50% 50%); }
          85% { clip-path: circle(120% at 50% 50%); }
          100% { clip-path: circle(120% at 50% 50%); }
        }

        /* CMYK converging simulation */
        @keyframes pal-cmyk-converge {
          0% {
            filter: drop-shadow(4px 1px 0px #00f2fe) drop-shadow(-4px -1.5px 0px #ff007f);
            transform: scale(0.97);
          }
          33% {
            filter: drop-shadow(-3px 2px 0px #ff007f) drop-shadow(3px -1px 0px #ffea00);
            transform: scale(1.02);
          }
          66% {
            filter: drop-shadow(1.5px -3px 0px #ffea00) drop-shadow(-1.5px 3px 0px #00f2fe);
            transform: scale(0.98);
          }
          100% {
            filter: drop-shadow(0 0 0 transparent);
            transform: scale(1);
          }
        }

        /* Steam Rise */
        @keyframes pal-steam-rise {
          0% { transform: translateY(40px) scale(0.6); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0; }
          100% { transform: translateY(-40px) scale(1.6); opacity: 0; }
        }

        /* Sparks burst animation */
        @keyframes pal-spark-shoot {
          0% {
            transform: translate(0, 0) scale(1.2) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
            opacity: 0;
          }
        }

        /* Clean reflection glare shine */
        @keyframes pal-shine-sweep {
          0% { left: -140%; opacity: 0; }
          10% { opacity: 0.5; }
          70% { opacity: 0.1; }
          100% { left: 210%; opacity: 0; }
        }

        /* ACCESSIBILITY & PREFERS REDUCED MOTION SAFETY */
        @media (prefers-reduced-motion: reduce) {
          .pal-workspace-container.pal-shaking {
            animation: none !important;
          }
          .pal-conveyor.rolling {
            animation: none !important;
          }
          .pal-item-wrapper.pal-feeding,
          .pal-item-wrapper.pal-exiting {
            animation: none !important;
            transform: none !important;
            transition: none !important;
          }
          .pal-laser-guide.scanning {
            animation: none !important;
            opacity: 0 !important;
          }
          .pal-calibrator.pal-flashing {
            animation: none !important;
            opacity: 0.2 !important;
          }
          .pal-heat-press-left.clamping,
          .pal-heat-press-right.clamping {
            animation: none !important;
            opacity: 0.3 !important;
          }
          .pal-squeegee-blade.scraping {
            animation: none !important;
            opacity: 0 !important;
          }
          .pal-steam.puffing {
            animation: none !important;
            opacity: 0 !important;
          }
          .pal-spark.burst {
            animation: none !important;
            opacity: 0 !important;
          }
          .pal-shine-glare.pal-animate {
            animation: none !important;
          }
          .pal-graphic-container.pal-cmyk-calibrating {
            animation: none !important;
            filter: none !important;
            transform: none !important;
            opacity: 0.8 !important;
          }
          .pal-graphic-container.pal-ink-pressing-tshirt,
          .pal-graphic-container.pal-ink-pressing-mug,
          .pal-canvas-text.pal-ink-pressing-tshirt,
          .pal-canvas-text.pal-ink-pressing-mug {
            animation: none !important;
            clip-path: none !important;
            opacity: 1 !important;
          }
        }
      ` }} />

      {/* Main Left Visualizer Sandbox */}
      <div 
        className={`pal-workspace-container ${step === 'pressing' ? 'pal-shaking' : ''}`}
      >
        {/* Status Indicators at the top */}
        <div className="pal-printer-hood">
          <div className="pal-hood-bolt" />
          <div className="pal-hood-screencase">
            <div className={`pal-led-dot ${step === 'aligning' ? 'calibrating' : step === 'pressing' ? 'pressing' : ''}`} />
            <span>{statusMessage}</span>
          </div>
          <div className="pal-hood-bolt" />
        </div>

        {/* Lasers and CMYK registrations */}
        <div className={`pal-laser-guide ${step === 'aligning' ? 'scanning' : ''}`} />
        
        <div className={`pal-calibrator top-l ${step === 'aligning' ? 'pal-flashing' : ''}`} />
        <div className={`pal-calibrator bottom-r ${step === 'aligning' ? 'pal-flashing' : ''}`} />

        {/* Left and Right Heat plates (Mug clamp mode) */}
        {itemType === 'mug' && (
          <>
            <div className={`pal-heat-press pal-heat-press-left ${step === 'pressing' ? 'clamping' : ''}`} />
            <div className={`pal-heat-press pal-heat-press-right ${step === 'pressing' ? 'clamping' : ''}`} />
            
            {/* Steam particles */}
            <div className={`pal-steam pal-steam-1 ${step === 'pressing' ? 'puffing' : ''}`} />
            <div className={`pal-steam pal-steam-2 ${step === 'pressing' ? 'puffing' : ''}`} />
            <div className={`pal-steam pal-steam-3 ${step === 'pressing' ? 'puffing' : ''}`} />
          </>
        )}

        {/* Squeegee slider carriage (Shirt print mode) */}
        {itemType === 'tshirt' && (
          <div className={`pal-squeegee-carriage ${step === 'pressing' ? 'active' : ''}`}>
            <div className={`pal-squeegee-blade ${step === 'pressing' ? 'scraping' : ''}`} />
          </div>
        )}

        {/* Customizer Substrate Target */}
        <div 
          className={`pal-item-wrapper ${step === 'feeding' ? 'pal-feeding' : ''} ${step === 'complete' && isLooping ? 'pal-exiting' : ''}`}
        >
          {itemType === 'tshirt' ? (
            <TshirtSVG color={shirtColor} />
          ) : (
            <MugSVG color={mugColor} />
          )}

          {/* Printable customizable area overlay */}
          <div className={`pal-item-canvas ${itemType === 'tshirt' ? 'pal-canvas-tshirt' : 'pal-canvas-mug'}`}>
            <div 
              className={`
                pal-graphic-container 
                ${step === 'aligning' ? 'pal-cmyk-calibrating' : ''}
                ${step === 'pressing' && itemType === 'tshirt' ? 'pal-ink-pressing-tshirt' : ''}
                ${step === 'pressing' && itemType === 'mug' ? 'pal-ink-pressing-mug' : ''}
                ${step === 'revealing' || step === 'complete' || step === 'idle' ? 'pal-visible' : ''}
              `}
            >
              {renderGraphic()}
            </div>

            <div 
              className={`
                pal-canvas-text 
                ${step === 'pressing' && itemType === 'tshirt' ? 'pal-ink-pressing-tshirt' : ''}
                ${step === 'pressing' && itemType === 'mug' ? 'pal-ink-pressing-mug' : ''}
                ${step === 'revealing' || step === 'complete' || step === 'idle' ? 'pal-visible' : ''}
              `}
            >
              {customText}
            </div>
          </div>

          {/* Reflection shiny glare swept across the finished graphic */}
          <div className={`pal-shine-glare ${step === 'revealing' ? 'pal-animate' : ''}`} />
        </div>

        {/* Sparks Confetti Burst particles */}
        {step === 'revealing' && sparks.map((spk) => (
          <div 
            key={spk.id}
            className={`pal-spark shape-${spk.shape} pal-spark-shoot`}
            style={{
              left: '50%',
              top: '50%',
              width: `${spk.size}px`,
              height: `${spk.size}px`,
              backgroundColor: spk.shape !== 'triangle' ? spk.color : undefined,
              '--tx': `${spk.tx}px`,
              '--ty': `${spk.ty}px`,
              '--rot': `${spk.rot}deg`,
              '--spark-color': spk.color,
              animationDelay: `${spk.delay}ms`,
            } as React.CSSProperties}
          />
        ))}

        {/* Conveyor Belt track */}
        <div className={`pal-conveyor ${step === 'feeding' ? 'rolling' : ''}`} />

        {/* Bottom monitor panel */}
        <div className="pal-status-bar">
          <span className="pal-status-text">CYCLE STAGE: {step.toUpperCase()}</span>
          <div className="pal-progress-track">
            <div className={`pal-progress-fill ${step}`} />
          </div>
        </div>
      </div>

      {/* Control Configuration Panel */}
      <div className="pal-panel-controls">
        <h2 className="pal-control-title">
          <span>Customizer Engine</span>
          <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>v2.0</span>
        </h2>

        {/* Product Selector */}
        <div className="pal-control-group">
          <label className="pal-control-label">Base Substrate</label>
          <div className="pal-toggle-row">
            <button 
              className={`pal-toggle-btn ${itemType === 'tshirt' ? 'active' : ''}`}
              onClick={() => setItemType('tshirt')}
            >
              👕 T-Shirt
            </button>
            <button 
              className={`pal-toggle-btn ${itemType === 'mug' ? 'active' : ''}`}
              onClick={() => setItemType('mug')}
            >
              🍺 Ceramic Mug
            </button>
          </div>
        </div>

        {/* Graphic Template Presets */}
        <div className="pal-control-group">
          <label className="pal-control-label">Graphic Blueprint</label>
          <div className="pal-graphic-presets">
            <button 
              className={`pal-graphic-preset-btn ${customGraphic === 'retro' ? 'active' : ''}`}
              onClick={() => setCustomGraphic('retro')}
            >
              Sunset Retro
            </button>
            <button 
              className={`pal-graphic-preset-btn ${customGraphic === 'mountain' ? 'active' : ''}`}
              onClick={() => setCustomGraphic('mountain')}
            >
              Peak Nature
            </button>
            <button 
              className={`pal-graphic-preset-btn ${customGraphic === 'geometric' ? 'active' : ''}`}
              onClick={() => setCustomGraphic('geometric')}
            >
              Neon Core
            </button>
          </div>
        </div>

        {/* Custom Text Label */}
        <div className="pal-control-group">
          <label className="pal-control-label">Print Custom Text</label>
          <input 
            type="text"
            className="pal-input-text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value.slice(0, 24))}
            placeholder="Type custom lettering..."
          />
        </div>

        {/* Custom Color Palette */}
        <div className="pal-control-group">
          <label className="pal-control-label">Custom Text Color</label>
          <div className="pal-color-grid">
            {['#ff3366', '#00f2fe', '#ffd200', '#9b51e0', '#10b981', '#f97316', '#ffffff'].map((col) => (
              <button 
                key={col}
                className={`pal-color-dot ${customTextColor === col ? 'active' : ''}`}
                style={{ backgroundColor: col }}
                onClick={() => setCustomTextColor(col)}
              />
            ))}
          </div>
        </div>

        {/* Automation speed */}
        <div className="pal-control-group">
          <label className="pal-control-label">Machine Speed</label>
          <div className="pal-toggle-row">
            {(['fast', 'normal', 'slow'] as const).map((spd) => (
              <button 
                key={spd}
                className={`pal-toggle-btn ${speed === spd ? 'active' : ''}`}
                onClick={() => setSpeed(spd)}
                style={{ fontSize: '11px', padding: '6px' }}
              >
                {spd.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loop setting */}
        <div className="pal-control-group">
          <label className="pal-checkbox-label">
            <input 
              type="checkbox"
              checked={isLooping}
              onChange={(e) => setIsLooping(e.target.checked)}
            />
            Auto Repeat Loop
          </label>
        </div>

        {/* Run controls */}
        {isPrinting ? (
          <button 
            className="pal-primary-btn pal-btn-stop"
            onClick={() => setIsPrinting(false)}
          >
            🛑 Stop Printing Engine
          </button>
        ) : (
          <button 
            className="pal-primary-btn"
            onClick={() => setIsPrinting(true)}
          >
            ⚙️ Run Print Run
          </button>
        )}
      </div>

      {/* Loader Trigger Section */}
      {!loadingMode && (
        <div className="pal-loader-demo-banner">
          <span>Want to test this as a fullscreen page loader?</span>
          <button 
            className="pal-demo-btn"
            onClick={() => setIsLoadedOverlayVisible(true)}
          >
            Trigger Fullscreen Preview
          </button>
        </div>
      )}

      {/* Full screen loader mode overlay container */}
      {isLoadedOverlayVisible && (
        <div className="pal-loader-overlay">
          <button 
            className="pal-overlay-close-btn"
            onClick={() => setIsLoadedOverlayVisible(false)}
            title="Exit Loader Preview"
          >
            ✕
          </button>

          {/* Loader title / details */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#fff' }}>
              Finalizing Your Custom Print...
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Applying high-temperature heat press templates to your order. Please wait.
            </p>
          </div>

          {/* Core component rendered in Loader Mode */}
          <PrintingAssemblyLoader
            itemType={itemType}
            customText={customText}
            customTextColor={customTextColor}
            customGraphic={customGraphic}
            customGraphicUrl={customGraphicUrl}
            speed={speed}
            loadingMode={true}
            autoPlay={true}
            loop={true}
            shirtColor={shirtColor}
            mugColor={mugColor}
            accentColor={accentColor}
          />
        </div>
      )}
    </div>
  );
};

export default PrintingAssemblyLoader;
