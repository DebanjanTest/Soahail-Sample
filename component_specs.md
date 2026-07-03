# Component Specification & Design System
## Project: Chhaap.in — Gen Z Custom Print & Merch Hub

This document defines the production-ready front-end component specifications, animation rules, design tokens, and UI micro-interactions for **Chhaap.in**, a Gen Z-focused Indian printing e-commerce aggregator. 

---

## 1. System Design Tokens

These design tokens must be declared in the root CSS file (`index.css` or `variables.css`) to maintain consistent styling across all components.

```css
:root {
  /* Color Palette - Cyber-Holi Gen Z Theme */
  --color-midnight-base: #0B0A0F;
  --color-midnight-card: #14121A;
  --color-midnight-border: #23202E;
  
  --color-saffron-electric: #FF5A00;
  --color-saffron-glow: rgba(255, 90, 0, 0.4);
  
  --color-pink-cyber: #FF007A;
  --color-pink-glow: rgba(255, 0, 122, 0.45);
  
  --color-volt-green: #39FF14;
  --color-volt-glow: rgba(57, 255, 20, 0.5);
  
  --color-blue-hologram: #00F0FF;
  --color-blue-glow: rgba(0, 240, 255, 0.4);
  
  --color-white: #FFFFFF;
  --color-gray-dim: #9D99A9;
  --color-danger-red: #FF3B30;
  --color-success-green: #00E676;

  /* Typography */
  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'Outfit', system-ui, -apple-system, sans-serif;

  /* Border Radius */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;

  /* Shadows & Neon Glows */
  --shadow-tactile: 4px 4px 0px 0px #000000;
  --shadow-tactile-hover: 2px 2px 0px 0px #000000;
  --shadow-neon-pink: 0 0 15px var(--color-pink-glow);
  --shadow-neon-saffron: 0 0 15px var(--color-saffron-glow);
  --shadow-neon-volt: 0 0 15px var(--color-volt-glow);
  --shadow-neon-blue: 0 0 15px var(--color-blue-glow);

  /* Easing & Spring Physics Curves */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1); /* Snappy spring physics */
  --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);        /* Fast entrance */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);         /* Standard transitions */
  --duration-hover: 150ms;
  --duration-active: 80ms;
  --duration-motion: 300ms;
}
```

---

## 2. Button System Specifications

Buttons use a combination of retro-tactile shadows, high-intensity color gradients, and spring transformations.

### 2.1 CSS Variables & General Button Core Setup

All buttons must inherit this foundational setup:

```css
.btn-core {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  padding: 14px 28px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  border: 2px solid transparent;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: 
    transform var(--duration-hover) var(--ease-out-back),
    box-shadow var(--duration-hover) ease-out,
    border-color var(--duration-hover) ease-out,
    background var(--duration-hover) ease-out;
}
```

### 2.2 Button Types & Interactive Specs

#### 2.2.1 Primary Button ("Bawaal Gradient")
Built for high-impact call-to-actions, like final checkout or custom builder launch.

- **HTML Target:** `.btn-primary`
- **Gradient Flow:** Starts with a linear gradient of Cyber Pink to Electric Saffron at `135deg`. On hover, the gradient background scales dynamically.
- **CSS Implementation:**

```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-pink-cyber) 0%, var(--color-saffron-electric) 100%);
  background-size: 200% 200%;
  background-position: 0% 50%;
  color: var(--color-white);
  box-shadow: var(--shadow-tactile);
}

/* Hover State: Scale up slightly, shift gradient, adjust tactile shadow */
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02) translateY(-2px);
  background-position: 100% 50%;
  box-shadow: var(--shadow-tactile-hover), var(--shadow-neon-pink);
}

/* Active State: Squish down, remove neon glow, reduce height */
.btn-primary:active:not(:disabled) {
  transform: scale(0.97) translateY(1px);
  box-shadow: 1px 1px 0px 0px #000000;
  transition: transform var(--duration-active) linear;
}

/* Focus State: Keyboard navigation halo with offset */
.btn-primary:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 3px var(--color-midnight-base), 
    0 0 0 6px var(--color-pink-cyber);
}

/* Disabled State: Faded out, non-reactive */
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### 2.2.2 Secondary Button ("Chandi Glass")
Designed for secondary pathways, like editing custom designs or viewing mockups.

- **HTML Target:** `.btn-secondary`
- **Border:** Dual-tone or semi-transparent border highlighting background graphics.
- **CSS Implementation:**

```css
.btn-secondary {
  background: rgba(20, 18, 26, 0.8);
  border-color: var(--color-midnight-border);
  color: var(--color-white);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-tactile);
}

/* Hover State */
.btn-secondary:hover:not(:disabled) {
  transform: scale(1.02) translateY(-2px);
  border-color: var(--color-blue-hologram);
  box-shadow: var(--shadow-tactile-hover), var(--shadow-neon-blue);
  color: var(--color-blue-hologram);
}

/* Active State */
.btn-secondary:active:not(:disabled) {
  transform: scale(0.97) translateY(1px);
  box-shadow: 1px 1px 0px 0px #000000;
}

/* Focus State */
.btn-secondary:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 3px var(--color-midnight-base), 
    0 0 0 6px var(--color-blue-hologram);
}

/* Disabled State */
.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### 2.2.3 Accent Button ("Dhinchak Glow")
For special highlight tags or triggering custom AI enhancement tools.

- **HTML Target:** `.btn-accent`
- **CSS Implementation:**

```css
.btn-accent {
  background: var(--color-volt-green);
  color: var(--color-midnight-base);
  box-shadow: var(--shadow-tactile);
  border-color: var(--color-midnight-base);
}

/* Hover State */
.btn-accent:hover:not(:disabled) {
  transform: scale(1.02) translateY(-2px);
  box-shadow: var(--shadow-tactile-hover), var(--shadow-neon-volt);
}

/* Active State */
.btn-accent:active:not(:disabled) {
  transform: scale(0.97) translateY(1px);
  box-shadow: 1px 1px 0px 0px #000000;
}

/* Focus State */
.btn-accent:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 3px var(--color-midnight-base), 
    0 0 0 6px var(--color-volt-green);
}

/* Disabled State */
.btn-accent:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### 2.2.4 Icon Button ("Kantaap Click")
Used in the layout editors, zoom triggers, or panel dismiss actions.

- **HTML Target:** `.btn-icon`
- **CSS Implementation:**

```css
.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-midnight-card);
  border: 2px solid var(--color-midnight-border);
  color: var(--color-white);
  transition: 
    transform var(--duration-hover) var(--ease-out-back),
    border-color var(--duration-hover) ease-out,
    color var(--duration-hover) ease-out,
    box-shadow var(--duration-hover) ease-out;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
  transition: transform var(--duration-hover) var(--ease-out-back);
}

/* Hover State */
.btn-icon:hover:not(:disabled) {
  transform: scale(1.1);
  border-color: var(--color-pink-cyber);
  color: var(--color-pink-cyber);
  box-shadow: var(--shadow-neon-pink);
}

.btn-icon:hover:not(:disabled) svg {
  transform: rotate(8deg) scale(1.1);
}

/* Active State */
.btn-icon:active:not(:disabled) {
  transform: scale(0.92);
  box-shadow: none;
}

/* Focus State */
.btn-icon:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px var(--color-midnight-base), 
    0 0 0 4px var(--color-pink-cyber);
}

/* Disabled State */
.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}
```

---

## 3. Input Field Dynamics

Fields transition smoothly between states. Validation failure causes a violent kinetic shake, while validation success presents custom responsive animations.

### 3.1 Field Container & Label Setup

The input system uses floating labels that dynamically translate and scale during interactions.

```html
<div class="input-container">
  <input type="text" id="order-notes" class="input-field" placeholder=" " required />
  <label for="order-notes" class="input-label">Sticker Text (e.g., Cool Bois Only)</label>
  <span class="input-helper">Aaja tera sticker design karte hain!</span>
  
  <!-- Success check icon hidden by default -->
  <div class="success-icon-wrapper">
    <svg class="success-checkmark" viewBox="0 0 52 52">
      <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
  </div>
</div>
```

### 3.2 Detailed Field Styling Rules

```css
.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.input-field {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  color: var(--color-white);
  background-color: var(--color-midnight-card);
  border: 2px solid var(--color-midnight-border);
  border-radius: var(--radius-md);
  padding: 16px 44px 16px 16px; /* Right padding reserved for validation icons */
  outline: none;
  transition: 
    border-color var(--duration-motion) var(--ease-snappy),
    box-shadow var(--duration-motion) var(--ease-snappy);
}

.input-label {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-dim);
  position: absolute;
  left: 16px;
  top: 18px;
  pointer-events: none;
  transition: 
    transform var(--duration-motion) var(--ease-snappy),
    color var(--duration-motion) var(--ease-snappy),
    font-size var(--duration-motion) var(--ease-snappy);
  transform-origin: left top;
}

.input-helper {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-gray-dim);
  margin-top: 6px;
  transition: color var(--duration-motion) var(--ease-smooth);
}

/* Floating Label Transitions */
/* When focused or when content exists (not placeholder-shown) */
.input-field:focus ~ .input-label,
.input-field:not(:placeholder-shown) ~ .input-label {
  transform: translateY(-28px) scale(0.85);
  color: var(--color-blue-hologram);
}
```

### 3.3 Dynamic State Styling

#### 3.3.1 Focused State
- **Glow & Border:** Electric Blue neon ring that sweeps inward.
- **CSS:**

```css
.input-field:focus {
  border-color: var(--color-blue-hologram);
  box-shadow: var(--shadow-neon-blue);
}
```

#### 3.3.2 Valid State
- **Feedback:** Border turns Volt Green, helper text changes style, and the checkmark animates.
- **CSS:**

```css
.input-field:valid:not(:placeholder-shown) {
  border-color: var(--color-success-green);
  box-shadow: 0 0 10px rgba(0, 230, 118, 0.2);
}

.input-field:valid:not(:placeholder-shown) ~ .input-label {
  color: var(--color-success-green);
}

.input-field:valid:not(:placeholder-shown) ~ .input-helper {
  color: var(--color-success-green);
}

/* Success Checkmark SVG Animation */
.input-field:valid:not(:placeholder-shown) ~ .success-icon-wrapper {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.input-field:valid:not(:placeholder-shown) ~ .success-icon-wrapper .success-checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: var(--color-success-green);
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.input-field:valid:not(:placeholder-shown) ~ .success-icon-wrapper .success-checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: var(--color-success-green);
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}
```

#### 3.3.3 Invalid / Error State
- **Feedback:** Violent horizontal shake to alert user. Border flashes hot pink.
- **CSS:**

```css
/* Shake Trigger Class applied via JS when validation checks fail */
.input-shake-trigger {
  animation: input-shake 300ms cubic-bezier(.36,.07,.19,.97) both;
  border-color: var(--color-danger-red) !important;
  box-shadow: 0 0 15px rgba(255, 0, 122, 0.4) !important;
}

.input-shake-trigger ~ .input-label {
  color: var(--color-danger-red) !important;
}

.input-shake-trigger ~ .input-helper {
  color: var(--color-danger-red) !important;
}

/* Keyframes for Shaking validation errors */
@keyframes input-shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
```

#### 3.3.4 SVG & Success Check Details

```css
.success-icon-wrapper {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  width: 20px;
  height: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease-out, transform 200ms var(--ease-out-back);
}

.success-checkmark {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}
```

---

## 4. Modern Micro-Interactions & Canvas Presets

This section specifies dynamic motion interactions on Chhaap.in—from drag-and-drop merchandising overlays to loading loops.

### 4.1 Smooth Canvas Dragging (Custom Merch Placement Editor)
For placing designs, text, and labels on mockups (t-shirts, mugs, phone cases).

- **Interactivity Spec:**
  - On mouse hover over editable asset: Show cursor `grab`. Scale asset outline by `1.005`.
  - On mouse down / hold: Change cursor to `grabbing`. Apply a subtle elastic scale down of `0.985` for high sensory feedback.
  - Active drag inertia calculation: Linear position interpolate (lerp) on frame tick with factor `0.1` (`target_pos = target_pos + (actual_pos - target_pos) * 0.1`).

- **CSS Specs:**

```css
.draggable-canvas-element {
  cursor: grab;
  outline: 2px dashed transparent;
  outline-offset: 4px;
  transform: scale(1);
  transition: 
    outline-color var(--duration-hover) ease-in-out,
    transform var(--duration-hover) var(--ease-out-back);
}

.draggable-canvas-element:hover {
  outline-color: var(--color-blue-hologram);
  transform: scale(1.005);
}

.draggable-canvas-element:active {
  cursor: grabbing;
  transform: scale(0.985);
  outline-color: var(--color-pink-cyber);
}
```

### 4.2 Background-Removal Loader ("Kala Jaadu loader")
For visual transparency isolation of user uploaded graphics. Uses a holographic vertical scanning overlay.

```html
<div class="loader-bg-removal">
  <div class="loader-image-container">
    <img src="user-uploaded-sticker.png" alt="Uploaded graphic" class="raw-image" />
    <div class="scanner-bar"></div>
  </div>
  <div class="loader-status">
    <p class="status-heading">Kala Jaadu happening...</p>
    <p class="status-subtext">Removing messy background in 3, 2, 1...</p>
  </div>
</div>
```

- **CSS & Keyframe Mechanics:**

```css
.loader-bg-removal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: var(--color-midnight-card);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-midnight-border);
}

.loader-image-container {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: repeating-conic-gradient(#1E1A29 0% 25%, #14121A 0% 50%) 50% / 20px 20px; /* Transparent Grid pattern */
}

.raw-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.7;
  filter: grayscale(80%);
}

.scanner-bar {
  position: absolute;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, transparent, var(--color-blue-hologram), transparent);
  box-shadow: 0 0 12px 3px var(--color-blue-hologram);
  animation: scan-loop 2s infinite ease-in-out;
}

.loader-status {
  text-align: center;
}

.status-heading {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-white);
  animation: text-pulse 1.5s infinite ease-in-out;
}

.status-subtext {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-gray-dim);
  margin-top: 4px;
}

/* Animations */
@keyframes scan-loop {
  0% {
    top: 0%;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0%;
  }
}

@keyframes text-pulse {
  0%, 100% {
    opacity: 0.8;
    color: var(--color-white);
  }
  50% {
    opacity: 1;
    color: var(--color-pink-cyber);
  }
}
```

### 4.3 Dynamic Slide-Over Sheet (Interactive Customizer Sidebar)
For custom sizing guides, quantity selectors, or detail inputs on mobile and desktop layout overlays.

- **Trigger Mechanisms & Spring Physics:**
  - Entrance: Slide from target edge using spring animation (`cubic-bezier(0.16, 1, 0.3, 1)`) over `350ms`.
  - Exit: Snap-away slide utilizing `cubic-bezier(0.3, 0, 0.8, 0.15)` over `200ms`.
  - Backdrop Blur: Dynamic transition from `backdrop-filter: blur(0px)` to `backdrop-filter: blur(12px) saturate(180%)`.

```html
<!-- Slide-Over Drawer Container -->
<div class="sheet-overlay hidden" id="sheet-customizer">
  <div class="sheet-backdrop"></div>
  <div class="sheet-content-panel">
    <!-- Drag indicator handle for touch screens -->
    <div class="sheet-drag-handle"></div>
    
    <div class="sheet-header">
      <h3>Apna Size Choose Karo</h3>
      <button class="btn-icon" aria-label="Close panel" id="sheet-close-btn">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    
    <div class="sheet-body">
      <!-- Scrollable customizer controls go here -->
    </div>
  </div>
</div>
```

- **CSS & Keyframe Specs:**

```css
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end; /* Right sidebar drawer default */
}

.sheet-overlay.hidden {
  pointer-events: none;
  visibility: hidden;
}

.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(11, 10, 15, 0.6);
  backdrop-filter: blur(0px);
  transition: backdrop-filter 300ms ease, background-color 300ms ease;
}

.sheet-overlay:not(.hidden) .sheet-backdrop {
  backdrop-filter: blur(10px) saturate(180%);
}

.sheet-content-panel {
  position: relative;
  width: 100%;
  max-width: 440px;
  height: 100%;
  background: var(--color-midnight-card);
  border-left: 2px solid var(--color-midnight-border);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  
  /* Initial State (Offscreen) */
  transform: translateX(100%);
  transition: transform var(--duration-motion) var(--ease-out-back);
}

.sheet-overlay:not(.hidden) .sheet-content-panel {
  transform: translateX(0%);
}

.sheet-drag-handle {
  width: 40px;
  height: 4px;
  background: var(--color-midnight-border);
  border-radius: var(--radius-full);
  margin: 12px auto 4px auto;
  cursor: grab;
}

.sheet-drag-handle:active {
  cursor: grabbing;
  background: var(--color-blue-hologram);
}

.sheet-header {
  padding: 16px 24px;
  border-bottom: 2px solid var(--color-midnight-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet-header h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-white);
  margin: 0;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
```

---

## 5. Accessibility & Motion Fallbacks

All dynamic hover transformations, background loaders, and page sheet slides must support a linear, immediate fallback when hardware capabilities or user configuration dictates reduced animation intensity.

```css
@media (prefers-reduced-motion: reduce) {
  /* Global transition and animation resets */
  * {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
  }

  /* Button fallbacks - remove elastic scale and custom shifts */
  .btn-core:hover:not(:disabled) {
    transform: none !important;
    box-shadow: none !important;
  }
  .btn-core:active:not(:disabled) {
    transform: none !important;
  }
  .btn-icon:hover:not(:disabled) svg {
    transform: none !important;
  }

  /* Input fields - remove shaking animation and float springs */
  .input-shake-trigger {
    animation: none !important;
    border-color: var(--color-danger-red) !important;
  }
  
  .input-label {
    transition: none !important;
  }
  
  .input-field:valid:not(:placeholder-shown) ~ .success-icon-wrapper .success-checkmark-circle,
  .input-field:valid:not(:placeholder-shown) ~ .success-icon-wrapper .success-checkmark-check {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }

  /* Canvas dragging & slide overs - direct state swap without transition */
  .draggable-canvas-element:hover {
    transform: none !important;
  }
  .draggable-canvas-element:active {
    transform: none !important;
  }
  
  .sheet-backdrop {
    transition: none !important;
  }
  
  .sheet-content-panel {
    transition: none !important;
  }
  
  .scanner-bar {
    animation: none !important;
    top: 50% !important;
    height: 2px !important;
  }
  
  .status-heading {
    animation: none !important;
  }
}
```
