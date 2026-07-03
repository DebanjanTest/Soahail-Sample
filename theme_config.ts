/**
 * @file theme_config.ts
 * @description Master Design System & Programmatic Design Tokens for "KulfiPrint" (or the Gen Z-targeted Indian printing e-commerce platform).
 * 
 * ==============================================================================================================
 * STRICT DESIGN SYSTEM DIRECTIVE & DEVELOPMENT CONSTRAINT
 * ==============================================================================================================
 * ⚠️ CRITICAL RULES FOR ALL DEVELOPERS, UI LOOPS, AND GENERATIVE INTERFACES:
 * 1. DO NOT use raw hex, rgb, rgba, hsl, or named colors in any inline styling, style objects, or raw CSS rules.
 *    All color-based values MUST be mapped to the `colors` structure defined below.
 * 2. BANNED: Arbitrary Tailwind values like `bg-[#ff007f]`, `text-[#adff2f]`, `m-[13px]`, `p-[7px]`, `w-[99px]`.
 * 3. ALWAYS access variables programmatically from this `theme_config.ts` or use Tailwind classes matching the keys.
 * 4. All spacing, animations, border radii, shadows, and transition attributes MUST strictly reference these tokens.
 * 5. ANY PR OR CODE LOOP INTRODUCING RAW HARDCODED VISUAL VALUES WILL FAIL LINT AND BUILD TASKS.
 * ==============================================================================================================
 */

/**
 * -----------------------------------------------------------------------------
 * 1. PROGRAMMATIC DESIGN TOKEN INTERFACES
 * -----------------------------------------------------------------------------
 */

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  DEFAULT: string;
}

export interface BrandColorGroup {
  bhangraPink: ColorShades;   // High-energy Punjabi festival pink
  masalaOrange: ColorShades;  // Rich fiery Indian spice orange
  desiLime: ColorShades;      // Toxic electric neon lime green
  vibePurple: ColorShades;    // Deep electric nightscape purple
  jugaadBlack: ColorShades;   // Premium dark mode foundation
  chaiGold: ColorShades;      // Warm turmeric and cardamom-infused gold
  monsoonBlue: ColorShades;   // Dense indigo-blue pre-monsoon storm clouds
  kulfiWhite: ColorShades;    // Rich creamy off-white contrast base
  bazaarRed: ColorShades;     // Loud, warning street-market red
}

export interface TypographyConfig {
  fontFamily: {
    sans: string[];
    heading: string[];
    mono: string[];
  };
  fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;
  fontWeight: Record<string, string>;
}

export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  [key: string]: string;
}

export interface MotionConfig {
  transitionProperty: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
  transitionDuration: Record<string, string>;
  keyframes: Record<string, Record<string, Record<string, string | number>>>;
  animation: Record<string, string>;
}

export interface ElevationConfig {
  boxShadow: Record<string, string>;
  borderRadius: Record<string, string>;
  borderWidth: Record<string, string>;
}

/**
 * -----------------------------------------------------------------------------
 * 2. CONCRETE PALETTE DEFINITIONS (Cultural Indian Gen Z Aesthetic)
 * -----------------------------------------------------------------------------
 */

export const colors: BrandColorGroup = {
  bhangraPink: {
    50: '#FFF0F6',
    100: '#FFE1ED',
    200: '#FFC2DC',
    300: '#FF94C3',
    400: '#FF57A0',
    500: '#FF007F', // DEFAULT
    600: '#E6006F',
    700: '#C0005D',
    800: '#99004B',
    900: '#7D003D',
    950: '#4D0022',
    DEFAULT: '#FF007F',
  },
  masalaOrange: {
    50: '#FFF3ED',
    100: '#FFE5D6',
    200: '#FFCBB0',
    300: '#FFA77D',
    400: '#FF7E47',
    500: '#FF5400', // DEFAULT
    600: '#E64500',
    700: '#C03500',
    800: '#992600',
    900: '#7D1D00',
    950: '#4D1000',
    DEFAULT: '#FF5400',
  },
  desiLime: {
    50: '#F8FFE6',
    100: '#F1FFCC',
    200: '#E1FF99',
    300: '#CEFF5C',
    400: '#BDFF24',
    500: '#ADFF2F', // DEFAULT
    600: '#8FE01B',
    700: '#75BD12',
    800: '#5C990A',
    900: '#4C7E05',
    950: '#2A4F00',
    DEFAULT: '#ADFF2F',
  },
  vibePurple: {
    50: '#F6F0FC',
    100: '#ECDCF9',
    200: '#D8B9F2',
    300: '#BD8CE8',
    400: '#9E54DB',
    500: '#7209B7', // DEFAULT
    600: '#60079C',
    700: '#4E0480',
    800: '#3F0266',
    900: '#310152',
    950: '#1F0036',
    DEFAULT: '#7209B7',
  },
  jugaadBlack: {
    50: '#F4F5F6',
    100: '#E8EAEB',
    200: '#D0D3D7',
    300: '#A9AEB7',
    400: '#79808E',
    500: '#4B5361',
    600: '#373D4B',
    700: '#262B37',
    800: '#171B24',
    900: '#0E1017',
    950: '#090A0F', // DEFAULT
    DEFAULT: '#090A0F',
  },
  chaiGold: {
    50: '#FFFBF0',
    100: '#FFF5D6',
    200: '#FFE9AD',
    300: '#FFDC7D',
    400: '#FFCB47',
    500: '#FFB703', // DEFAULT
    600: '#E6A000',
    700: '#C08100',
    800: '#996400',
    900: '#7D4F00',
    950: '#4D2F00',
    DEFAULT: '#FFB703',
  },
  monsoonBlue: {
    50: '#F0F8FF',
    100: '#E0F2FE',
    200: '#B9E2FC',
    300: '#7CC6F8',
    400: '#38A7F4',
    500: '#0077B6', // DEFAULT
    600: '#006CA5',
    700: '#005B8C',
    800: '#004B73',
    900: '#003E5E',
    950: '#00253B',
    DEFAULT: '#0077B6',
  },
  kulfiWhite: {
    50: '#FFFFFF',
    100: '#FAF9F6', // DEFAULT
    200: '#F4F2EB',
    300: '#EBE8DC',
    400: '#DCD6C4',
    500: '#BFB8A3',
    600: '#9C947F',
    700: '#7D7663',
    800: '#5E5848',
    900: '#474236',
    950: '#2B2820',
    DEFAULT: '#FAF9F6',
  },
  bazaarRed: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // DEFAULT
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
    DEFAULT: '#EF4444',
  },
};

/**
 * -----------------------------------------------------------------------------
 * 3. TYPOGRAPHY SYSTEM
 * -----------------------------------------------------------------------------
 */

export const typography: TypographyConfig = {
  fontFamily: {
    sans: ['Satoshi', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
    heading: ['Clash Display', 'Syne', 'Impact', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    '2xs': ['0.625rem', { lineHeight: '0.75rem', letterSpacing: '0.02em' }],
    'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
    'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
    'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.015em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.045em' }],
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.06em' }],
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.07em' }],
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

/**
 * -----------------------------------------------------------------------------
 * 4. SPACING SCALE
 * -----------------------------------------------------------------------------
 */

export const spacing: SpacingConfig = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',     // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
  128: '32rem',     // 512px
  144: '36rem',     // 576px
  160: '40rem',     // 640px
  192: '48rem',     // 768px
  256: '64rem',     // 1024px
  // Semantic spacing maps
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
  '5xl': '8rem',
};

/**
 * -----------------------------------------------------------------------------
 * 5. ANIMATIONS & EASE DYNAMICS
 * -----------------------------------------------------------------------------
 */

export const motion: MotionConfig = {
  transitionProperty: {
    none: 'none',
    all: 'all',
    default: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
    colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    opacity: 'opacity',
    shadow: 'box-shadow',
    transform: 'transform',
  },
  transitionTimingFunction: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Bouncy spring curve for micro-interactions
    'spring-bounce': 'cubic-bezier(0.87, 0, 0.13, 1)',
    'spring-heavy': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
  },
  transitionDuration: {
    DEFAULT: '250ms',
    '75': '75ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '250': '250ms',
    '300': '300ms',
    '500': '500ms',
    '700': '700ms',
    '1000': '1000ms',
  },
  keyframes: {
    // Horizontal scrolling banner for stickers or print discount sales tickers
    marquee: {
      '0%': { transform: 'translateX(0%)' },
      '100%': { transform: 'translateX(-50%)' },
    },
    // Subtly floating merchandise mockups (e.g., custom printed stickers, hoodies, mugs)
    float: {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '50%': { transform: 'translateY(-12px) rotate(1deg)' },
    },
    // High energy vibrant pulse glow
    'pulse-glow': {
      '0%, 100%': {
        opacity: '1',
        filter: 'drop-shadow(0 0 4px var(--color-bhangra-pink, #FF007F)) drop-shadow(0 0 12px var(--color-bhangra-pink, #FF007F))',
      },
      '50%': {
        opacity: '0.75',
        filter: 'drop-shadow(0 0 2px var(--color-bhangra-pink, #FF007F)) drop-shadow(0 0 6px var(--color-bhangra-pink, #FF007F))',
      },
    },
    // Border dash offset flow simulation for neon card borders
    'spin-gradient': {
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
    // Wiggle effect for flash sales/limited run print drops
    wiggle: {
      '0%, 100%': { transform: 'rotate(-3deg)' },
      '50%': { transform: 'rotate(3deg)' },
    },
    // Printing Action: Paper sliding out of a printer tray simulation
    'print-slide': {
      '0%': {
        transform: 'translateY(120%) scaleY(0.05)',
        opacity: '0',
      },
      '75%': {
        transform: 'translateY(-8%) scaleY(1.08)',
        opacity: '0.9',
      },
      '100%': {
        transform: 'translateY(0) scaleY(1)',
        opacity: '1',
      },
    },
    // CMYK color split offset animation (simulates printing misregistration artifacts, ultra Gen Z aesthetic)
    'cmyk-split': {
      '0%, 100%': { textShadow: '2px -1px 0 #00FFFF, -2px 1px 0 #FF00FF, 1px 2px 0 #FFFF00' },
      '50%': { textShadow: '-1px 2px 0 #00FFFF, 2px -2px 0 #FF00FF, -2px -1px 0 #FFFF00' },
    }
  },
  animation: {
    marquee: 'marquee 18s linear infinite',
    float: 'float 5s ease-in-out infinite',
    'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
    'spin-gradient': 'spin-gradient 6s linear infinite',
    wiggle: 'wiggle 0.25s ease-in-out infinite',
    'print-slide': 'print-slide 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    'cmyk-split': 'cmyk-split 1.5s step-end infinite',
  },
};

/**
 * -----------------------------------------------------------------------------
 * 6. ELEVATION, BORDERS, & INTERFACING
 * -----------------------------------------------------------------------------
 */

export const elevation: ElevationConfig = {
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    // Neo-brutalist heavy offsets (highly critical for high-contrast print items cards)
    'neo-flat': '4px 4px 0px 0px #090A0F',
    'neo-flat-pink': '4px 4px 0px 0px #FF007F',
    'neo-flat-orange': '4px 4px 0px 0px #FF5400',
    'neo-flat-lime': '4px 4px 0px 0px #ADFF2F',
    'neo-double-pink': '4px 4px 0px 0px #090A0F, 8px 8px 0px 0px #FF007F',
    'neo-double-lime': '4px 4px 0px 0px #090A0F, 8px 8px 0px 0px #ADFF2F',
    'neo-double-orange': '4px 4px 0px 0px #090A0F, 8px 8px 0px 0px #FF5400',
    // High-power neon glows
    'glow-pink': '0 0 16px 2px rgba(255, 0, 127, 0.55)',
    'glow-lime': '0 0 16px 2px rgba(173, 255, 47, 0.55)',
    'glow-orange': '0 0 16px 2px rgba(255, 84, 0, 0.55)',
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px',
    // Neo-brutalist rounded corners (very slight curve for hard boxes)
    'neo-pill': '12px',
    'neo-card': '8px',
  },
  borderWidth: {
    DEFAULT: '1px',
    0: '0px',
    2: '2px',
    3: '3px',
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px', // Bold borders for brutalism
  },
};

/**
 * -----------------------------------------------------------------------------
 * 7. COMPLETE TAILWIND V3 & V4 SCHEMA-READY INTEGRATION CONFIG
 * -----------------------------------------------------------------------------
 * This export block formats the design tokens directly into a structure consumable
 * by Tailwind CSS config schemas. Integrate by merging this into tailwind.config.ts.
 */

export const tailwindThemeConfig = {
  theme: {
    extend: {
      colors: {
        // Gen Z Desi Identity Accents
        'bhangra-pink': {
          50: colors.bhangraPink[50],
          100: colors.bhangraPink[100],
          200: colors.bhangraPink[200],
          300: colors.bhangraPink[300],
          400: colors.bhangraPink[400],
          500: colors.bhangraPink[500],
          600: colors.bhangraPink[600],
          700: colors.bhangraPink[700],
          800: colors.bhangraPink[800],
          900: colors.bhangraPink[900],
          950: colors.bhangraPink[950],
          DEFAULT: colors.bhangraPink.DEFAULT,
        },
        'masala-orange': {
          50: colors.masalaOrange[50],
          100: colors.masalaOrange[100],
          200: colors.masalaOrange[200],
          300: colors.masalaOrange[300],
          400: colors.masalaOrange[400],
          500: colors.masalaOrange[500],
          600: colors.masalaOrange[600],
          700: colors.masalaOrange[700],
          800: colors.masalaOrange[800],
          900: colors.masalaOrange[900],
          950: colors.masalaOrange[950],
          DEFAULT: colors.masalaOrange.DEFAULT,
        },
        'desi-lime': {
          50: colors.desiLime[50],
          100: colors.desiLime[100],
          200: colors.desiLime[200],
          300: colors.desiLime[300],
          400: colors.desiLime[400],
          500: colors.desiLime[500],
          600: colors.desiLime[600],
          700: colors.desiLime[700],
          800: colors.desiLime[800],
          900: colors.desiLime[900],
          950: colors.desiLime[950],
          DEFAULT: colors.desiLime.DEFAULT,
        },
        'vibe-purple': {
          50: colors.vibePurple[50],
          100: colors.vibePurple[100],
          200: colors.vibePurple[200],
          300: colors.vibePurple[300],
          400: colors.vibePurple[400],
          500: colors.vibePurple[500],
          600: colors.vibePurple[600],
          700: colors.vibePurple[700],
          800: colors.vibePurple[800],
          900: colors.vibePurple[900],
          950: colors.vibePurple[950],
          DEFAULT: colors.vibePurple.DEFAULT,
        },
        'jugaad-black': {
          50: colors.jugaadBlack[50],
          100: colors.jugaadBlack[100],
          200: colors.jugaadBlack[200],
          300: colors.jugaadBlack[300],
          400: colors.jugaadBlack[400],
          500: colors.jugaadBlack[500],
          600: colors.jugaadBlack[600],
          700: colors.jugaadBlack[700],
          800: colors.jugaadBlack[800],
          900: colors.jugaadBlack[900],
          950: colors.jugaadBlack[950],
          DEFAULT: colors.jugaadBlack.DEFAULT,
        },
        'chai-gold': {
          50: colors.chaiGold[50],
          100: colors.chaiGold[100],
          200: colors.chaiGold[200],
          300: colors.chaiGold[300],
          400: colors.chaiGold[400],
          500: colors.chaiGold[500],
          600: colors.chaiGold[600],
          700: colors.chaiGold[700],
          800: colors.chaiGold[800],
          900: colors.chaiGold[900],
          950: colors.chaiGold[950],
          DEFAULT: colors.chaiGold.DEFAULT,
        },
        'monsoon-blue': {
          50: colors.monsoonBlue[50],
          100: colors.monsoonBlue[100],
          200: colors.monsoonBlue[200],
          300: colors.monsoonBlue[300],
          400: colors.monsoonBlue[400],
          500: colors.monsoonBlue[500],
          600: colors.monsoonBlue[600],
          700: colors.monsoonBlue[700],
          800: colors.monsoonBlue[800],
          900: colors.monsoonBlue[900],
          950: colors.monsoonBlue[950],
          DEFAULT: colors.monsoonBlue.DEFAULT,
        },
        'kulfi-white': {
          50: colors.kulfiWhite[50],
          100: colors.kulfiWhite[100],
          200: colors.kulfiWhite[200],
          300: colors.kulfiWhite[300],
          400: colors.kulfiWhite[400],
          500: colors.kulfiWhite[500],
          600: colors.kulfiWhite[600],
          700: colors.kulfiWhite[700],
          800: colors.kulfiWhite[800],
          900: colors.kulfiWhite[900],
          950: colors.kulfiWhite[950],
          DEFAULT: colors.kulfiWhite.DEFAULT,
        },
        'bazaar-red': {
          50: colors.bazaarRed[50],
          100: colors.bazaarRed[100],
          200: colors.bazaarRed[200],
          300: colors.bazaarRed[300],
          400: colors.bazaarRed[400],
          500: colors.bazaarRed[500],
          600: colors.bazaarRed[600],
          700: colors.bazaarRed[700],
          800: colors.bazaarRed[800],
          900: colors.bazaarRed[900],
          950: colors.bazaarRed[950],
          DEFAULT: colors.bazaarRed.DEFAULT,
        },
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
        heading: typography.fontFamily.heading,
        mono: typography.fontFamily.mono,
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing: {
        ...spacing,
      },
      boxShadow: {
        ...elevation.boxShadow,
      },
      borderRadius: {
        ...elevation.borderRadius,
      },
      borderWidth: {
        ...elevation.borderWidth,
      },
      transitionProperty: {
        ...motion.transitionProperty,
      },
      transitionTimingFunction: {
        ...motion.transitionTimingFunction,
      },
      transitionDuration: {
        ...motion.transitionDuration,
      },
      keyframes: {
        ...motion.keyframes,
      },
      animation: {
        ...motion.animation,
      },
    },
  },
};

/**
 * -----------------------------------------------------------------------------
 * 8. SEMANTIC HELPER SCHEMES (Programmatic Hook Interfaces)
 * -----------------------------------------------------------------------------
 * These configurations allow runtime JS styling or stateful color picking
 * to dynamically select the correct brand token.
 */

export type SemanticColorRole = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'background' 
  | 'surface' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

export const semanticThemeMap = {
  dark: {
    primary: colors.bhangraPink[500],
    secondary: colors.masalaOrange[500],
    accent: colors.desiLime[500],
    background: colors.jugaadBlack[950],
    surface: colors.jugaadBlack[900],
    success: colors.desiLime[500],
    warning: colors.chaiGold[500],
    error: colors.bazaarRed[500],
    info: colors.monsoonBlue[500],
  },
  light: {
    primary: colors.bhangraPink[600],
    secondary: colors.masalaOrange[600],
    accent: colors.vibePurple[600],
    background: colors.kulfiWhite[100],
    surface: colors.kulfiWhite[50],
    success: colors.desiLime[600],
    warning: colors.chaiGold[600],
    error: colors.bazaarRed[600],
    info: colors.monsoonBlue[600],
  }
};

/**
 * Programmatic helper to get theme colors in JS contexts (e.g. Canvas painting, Charts, or Dynamic styling loops).
 * @param role Semantic color role
 * @param mode Theme mode ('light' | 'dark')
 * @returns HEX color string matching the token
 */
export function getSemanticColor(role: SemanticColorRole, mode: 'light' | 'dark' = 'dark'): string {
  const selectedMode = semanticThemeMap[mode] || semanticThemeMap.dark;
  return selectedMode[role];
}
