import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Upload, 
  Trash2, 
  Plus, 
  Minus, 
  RotateCw, 
  Check, 
  AlertCircle, 
  MapPin, 
  TrendingUp, 
  User, 
  Scissors, 
  Layers, 
  Languages, 
  ShieldAlert, 
  Printer,
  ChevronRight,
  Clock
} from 'lucide-react';
import BrandIntro from './components/BrandIntro';
import MerchCatalog from './components/MerchCatalog';
import PrintingAssemblyLoader from './components/PrintingAssemblyLoader';

// Interfaces for application state
interface CartItem {
  id: string;
  productType: string;
  productName: string;
  canvasColor: string;
  canvasColorName: string;
  imageUrl: string;
  imageName: string;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  isBgRemoved: boolean;
  isSubjectIsolated: boolean;
  printText: string;
  textColor: string;
  textSize: number;
  textFont: string;
  basePrice: number;
  commission: number;
  totalPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: 'Design Approved' | 'Partner Printing' | 'Out for Delivery' | 'Delivered';
  otpVerified: boolean;
}

// Demo design templates for users who don't upload images
const STICKER_TEMPLATES = [
  { id: '1', name: 'Bawaal Desi Lion', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop' },
  { id: '2', name: 'Bollywood Retro', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' },
  { id: '3', name: 'Cyberpunk Mumbai', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop' },
  { id: '4', name: 'Tapri Chai Art', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop' },
];

const PRODUCT_TEMPLATES = [
  { id: 'tshirt', name: 'Classic Cotton Tee', basePrice: 440, commission: 59, totalPrice: 499, aspect: '4:5', description: 'Heavyweight 240 GSM organic cotton drop shoulder tee.', imageUrl: '/blank_tshirt.png' },
  { id: 'mug', name: 'Ceramic Coffee Mug', basePrice: 220, commission: 29, totalPrice: 249, aspect: '1:1', description: 'Ceramic matte-finish dual-tone coffee mug.', imageUrl: '/blank_mug.png' },
  { id: 'pen', name: 'Matte Executive Pen', basePrice: 85, commission: 14, totalPrice: 99, aspect: '3:1', description: 'Matte metal body ballpoint pen with fine grip.', imageUrl: '/blank_pen.png' },
  { id: 'hoodie', name: 'Premium Heavyweight Hoodie', basePrice: 880, commission: 119, totalPrice: 999, aspect: '4:5', description: 'Premium 400 GSM fleece-lined oversized hoodie.', imageUrl: '/blank_hoodie.png' },
  { id: 'notebook', name: 'Executive Wirebound Notebook', basePrice: 170, commission: 29, totalPrice: 199, aspect: '4:5', description: 'A5 wire-bound notebook, 160 pages unruled.', imageUrl: '/blank_notebook.png' },
  { id: 'phone_case', name: 'Premium Matte Mobile Cover', basePrice: 280, commission: 39, totalPrice: 319, aspect: '2:3', description: 'Polycarbonate hard shell case with wrap-around premium printing.', imageUrl: '/blank_phone_case.png' },
];

const CANVAS_COLORS = [
  { name: 'Signature Black', hex: '#090A0F', textClass: 'text-kulfi-white-100' },
  { name: 'Kulfi White', hex: '#FAF9F6', textClass: 'text-jugaad-black-950' },
  { name: 'Royal Purple', hex: '#7209B7', textClass: 'text-kulfi-white-100' },
  { name: 'Bhangra Pink', hex: '#FF007F', textClass: 'text-kulfi-white-100' },
  { name: 'Desi Lime', hex: '#ADFF2F', textClass: 'text-jugaad-black-950' },
  { name: 'Masala Orange', hex: '#FF5400', textClass: 'text-kulfi-white-100' },
];

const TEXT_COLORS = [
  { name: 'Pearl White', hex: '#FAF9F6' },
  { name: 'Signature Black', hex: '#090A0F' },
  { name: 'Bhangra Pink', hex: '#FF007F' },
  { name: 'Desi Lime', hex: '#ADFF2F' },
  { name: 'Chai Gold', hex: '#FFB703' },
];

const getSwatchLabel = (productId: string) => {
  switch (productId) {
    case 'tshirt': return 'Choose T-Shirt Color';
    case 'mug': return 'Choose Mug Color';
    case 'pen': return 'Choose Pen Color';
    case 'hoodie': return 'Choose Hoodie Color';
    case 'notebook': return 'Choose Notebook Color';
    case 'phone_case': return 'Choose Cover Color';
    default: return 'Choose Color';
  }
};

const getPrintZoneStyle = (productId: string) => {
  let style: React.CSSProperties = {
    position: 'absolute',
    overflow: 'hidden',
  };

  if (productId === 'tshirt') {
    style = { ...style, top: '22%', left: '28%', width: '44%', height: '38%' };
  } else if (productId === 'hoodie') {
    style = { ...style, top: '25%', left: '28%', width: '44%', height: '34%' };
  } else if (productId === 'phone_case') {
    style = { ...style, top: '15%', left: '15%', width: '70%', height: '70%' };
  } else if (productId === 'mug') {
    style = { 
      ...style, 
      top: '22%', 
      left: '29%', 
      width: '30%', 
      height: '52%',
      maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
    };
  } else if (productId === 'pen') {
    style = { 
      ...style, 
      top: '43%', 
      left: '20%', 
      width: '60%', 
      height: '14%',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
    };
  } else {
    style = { ...style, top: '15%', left: '25%', width: '50%', height: '62%' };
  }

  return style;
};

export default function App() {
  // Navigation: 'home' | 'customize' | 'cart' | 'orders' | 'partner' | 'admin'
  const [activeTab, setActiveTab] = useState<'home' | 'customize' | 'cart' | 'orders' | 'partner' | 'admin'>('home');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [mobileDeckOpen, setMobileDeckOpen] = useState<boolean>(false);

  // Customize Lab State
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_TEMPLATES[0]);
  const [canvasColor, setCanvasColor] = useState(CANVAS_COLORS[0]);
  const [uploadedImage, setUploadedImage] = useState<string>(STICKER_TEMPLATES[0].url);
  const [uploadedImageName, setUploadedImageName] = useState<string>(STICKER_TEMPLATES[0].name);
  
  // Customizer Transforms
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // Customizer AI Features
  const [isBgRemoved, setIsBgRemoved] = useState<boolean>(false);
  const [bgRemoving, setBgRemoving] = useState<boolean>(false);
  const [isSubjectIsolated, setIsSubjectIsolated] = useState<boolean>(false);
  
  // Customizer Typography
  const [printText, setPrintText] = useState<string>('SIGNATURE');
  const [textColor, setTextColor] = useState(TEXT_COLORS[3].hex); // Desi Lime
  const [textSize, setTextSize] = useState<number>(24);
  const [textFont, setTextFont] = useState<string>('font-heading');

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  
  // Checkout Address Form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [pincodeError, setPincodeError] = useState<string>('');

  // OTP Login Simulation state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');

  // UPI Payment State
  const [upiTimer, setUpiTimer] = useState<number>(180);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'PRESSBOOK-849302',
      date: '02 July 2026',
      items: [
        {
          id: 'prev-1',
          productType: 'tshirt',
          productName: 'Classic Cotton Tee',
          canvasColor: '#090A0F',
          canvasColorName: 'Signature Black',
          imageUrl: STICKER_TEMPLATES[0].url,
          imageName: 'Bawaal Desi Lion',
          scale: 1.1,
          rotation: 5,
          offsetX: 0,
          offsetY: -5,
          isBgRemoved: true,
          isSubjectIsolated: false,
          printText: 'APNA TIME AAYEGA',
          textColor: '#FF007F',
          textSize: 20,
          textFont: 'font-heading',
          basePrice: 440,
          commission: 59,
          totalPrice: 499,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: '404, Cyber Heights, Hitec City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081'
      },
      paymentMethod: 'UPI (Razorpay Mocked)',
      totalAmount: 499,
      status: 'Partner Printing',
      otpVerified: true
    }
  ]);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Close Toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // UPI Timer Countdown
  useEffect(() => {
    let timer: any;
    if (paymentModalOpen && upiTimer > 0) {
      timer = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentModalOpen, upiTimer]);

  // Scroll Lock & Section Transition Effect
  useEffect(() => {
    if (activeTab !== 'home') return;

    let isScrolling = false;
    const sectionsList = ['hero-intro', 'print-simulator', 'mockup-workstation', 'swag-catalog', 'studio-footer'];

    const scrollToSection = (index: number) => {
      const targetId = sectionsList[index];
      const el = document.getElementById(targetId);
      if (el) {
        setActiveSectionIdx(index);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIdx = activeSectionIdx + direction;
      if (nextIdx >= 0 && nextIdx < sectionsList.length) {
        isScrolling = true;
        scrollToSection(nextIdx);
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        if (isScrolling) return;
        const nextIdx = activeSectionIdx + 1;
        if (nextIdx < sectionsList.length) {
          isScrolling = true;
          scrollToSection(nextIdx);
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        if (isScrolling) return;
        const nextIdx = activeSectionIdx - 1;
        if (nextIdx >= 0) {
          isScrolling = true;
          scrollToSection(nextIdx);
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 1 : -1;
        const nextIdx = activeSectionIdx + direction;
        if (nextIdx >= 0 && nextIdx < sectionsList.length) {
          isScrolling = true;
          scrollToSection(nextIdx);
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, activeSectionIdx]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Indian Pincode Simple Validator
  const handlePincodeChange = (pin: string) => {
    setShippingAddress({ ...shippingAddress, pincode: pin });
    if (pin.length === 6) {
      if (/^[1-9][0-9]{5}$/.test(pin)) {
        setPincodeError('');
        // Autofill state/city mockup
        const regions: Record<string, { city: string, state: string }> = {
          '110': { city: 'New Delhi', state: 'Delhi' },
          '400': { city: 'Mumbai', state: 'Maharashtra' },
          '700': { city: 'Kolkata', state: 'West Bengal' },
          '600': { city: 'Chennai', state: 'Tamil Nadu' },
          '560': { city: 'Bengaluru', state: 'Karnataka' },
          '500': { city: 'Hyderabad', state: 'Telangana' },
          '380': { city: 'Ahmedabad', state: 'Gujarat' },
          '141': { city: 'Ludhiana', state: 'Punjab' }
        };
        const prefix = pin.substring(0, 3);
        if (regions[prefix]) {
          setShippingAddress(prev => ({
            ...prev,
            city: regions[prefix].city,
            state: regions[prefix].state
          }));
        }
      } else {
        setPincodeError('Invalid Indian PIN code (Must not start with 0)');
      }
    } else if (pin.length > 6) {
      setPincodeError('PIN code must be exactly 6 digits');
    }
  };

  // Handle Design File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        triggerToast('Size Limit Exceeded! File must be smaller than 10MB.');
        return;
      }
      
      const fileType = file.type;
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(fileType)) {
        triggerToast('Invalid Format! Upload PNG, JPG, WebP or SVG only.');
        return;
      }

      setBgRemoving(true);
      triggerToast('Scanning Upload for Malware & Vulnerabilities...');
      
      // Simulate scanning and rendering file local URL
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImage(event.target.result as string);
            setUploadedImageName(file.name);
            setIsBgRemoved(false);
            setIsSubjectIsolated(false);
            setBgRemoving(false);
            triggerToast('Security Scan Passed! Asset loaded.');
          }
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  // Simulate "Kala Jaadu" Background Removal
  const runBackgroundRemoval = () => {
    if (bgRemoving) return;
    setBgRemoving(true);
    triggerToast('Initiating AI Background Removal ("Kala Jaadu")...');
    
    setTimeout(() => {
      setIsBgRemoved(true);
      setBgRemoving(false);
      triggerToast('Background isolated successfully!');
    }, 2000);
  };

  // Add customized item to cart
  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: 'ITEM-' + Date.now().toString(),
      productType: selectedProduct.id,
      productName: selectedProduct.name,
      canvasColor: canvasColor.hex,
      canvasColorName: canvasColor.name,
      imageUrl: uploadedImage,
      imageName: uploadedImageName,
      scale,
      rotation,
      offsetX,
      offsetY,
      isBgRemoved,
      isSubjectIsolated,
      printText,
      textColor,
      textSize,
      textFont,
      basePrice: selectedProduct.basePrice,
      commission: selectedProduct.commission,
      totalPrice: selectedProduct.totalPrice,
      quantity: 1
    };

    setCart([...cart, newItem]);
    triggerToast('Added customized swag to cart!');
    setActiveTab('cart');
  };

  // Quick Add Item from Catalog directly
  const handleQuickAddToCart = (item: { id: string; name: string; price: number; variant: string; imageUrl: string }) => {
    const basePrice = Math.round(item.price * 0.88);
    const commission = item.price - basePrice;
    const newItem: CartItem = {
      id: item.id + '-' + Date.now(),
      productType: item.id.split('-')[0],
      productName: item.name,
      canvasColor: '#090A0F', // Default Signature Black
      canvasColorName: 'Signature Black',
      imageUrl: item.imageUrl,
      imageName: 'Stock Asset (' + item.variant + ')',
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      isBgRemoved: false,
      isSubjectIsolated: false,
      printText: '',
      textColor: '',
      textSize: 20,
      textFont: 'font-heading',
      basePrice: basePrice,
      commission: commission,
      totalPrice: item.price,
      quantity: 1
    };
    setCart([...cart, newItem]);
    triggerToast(`Added ${item.name} to cart!`);
  };

  // Delete Cart Item
  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    triggerToast('Item removed from cart');
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
      }
      return item;
    }));
  };

  // Calculate cart aggregates
  const getCartTotals = () => {
    const baseSum = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    const commissionSum = cart.reduce((acc, item) => acc + (item.commission * item.quantity), 0);
    const totalSum = cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
    return { baseSum, commissionSum, totalSum };
  };

  // Send Mock OTP for checkout verification
  const sendMockOtp = () => {
    if (!shippingAddress.phone || shippingAddress.phone.length !== 10) {
      setOtpError('Please enter a valid 10-digit Indian Mobile Number');
      return;
    }
    setOtpError('');
    setBgRemoving(true); // show loader status
    
    setTimeout(() => {
      // Generate a mock code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(code);
      setOtpSent(true);
      setBgRemoving(false);
      alert(`[SMS Gateway Sim] OTP sent to +91 ${shippingAddress.phone}: ${code}`);
      triggerToast('OTP Sent successfully via WhatsApp/SMS!');
    }, 1200);
  };

  // Verify Mock OTP
  const verifyMockOtp = () => {
    if (inputOtp === otpCode) {
      setOtpVerified(true);
      setOtpError('');
      triggerToast('All set! OTP verified! 🔓');
    } else {
      setOtpError('Incorrect OTP. Please check the code or try again.');
    }
  };

  // Complete Order Checkout & trigger Payment
  const initiatePayment = () => {
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      triggerToast('Please complete all shipping address fields!');
      return;
    }
    if (pincodeError) {
      triggerToast('Please resolve PIN code issues!');
      return;
    }
    if (!otpVerified) {
      triggerToast('OTP authentication is required to place order!');
      return;
    }

    setCheckoutModalOpen(false);
    setPaymentModalOpen(true);
    setUpiTimer(180);
  };

  // Process Mock UPI payment success
  const handlePaymentSuccess = () => {
    setPaymentProcessing(true);
    triggerToast('Validating details, hang tight! ⚡');
    
    setTimeout(() => {
      const newOrder: Order = {
        id: 'PRESSBOOK-' + Math.floor(100000 + Math.random() * 900000).toString(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: [...cart],
        shippingAddress: { ...shippingAddress },
        paymentMethod: 'UPI / RuPay (Press Book Portal)',
        totalAmount: getCartTotals().totalSum,
        status: 'Design Approved',
        otpVerified: true
      };

      setOrders([newOrder, ...orders]);
      setCart([]);
      setPaymentProcessing(false);
      setPaymentModalOpen(false);
      setActiveTab('orders');
      triggerToast('Yay! Order placed! 🎉 Check your dashboard.');
    }, 2500);
  };

  // Partner status updates
  const handlePartnerUpdateStatus = (orderId: string, nextStatus: 'Partner Printing' | 'Out for Delivery' | 'Delivered') => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: nextStatus };
      }
      return order;
    }));
    triggerToast(`Order ${orderId} status updated to: ${nextStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Design Approved': return 'bg-monsoon-blue-500 text-white';
      case 'Partner Printing': return 'bg-chai-gold-500 text-jugaad-black-950';
      case 'Out for Delivery': return 'bg-vibe-purple-500 text-white';
      case 'Delivered': return 'bg-desi-lime-500 text-jugaad-black-950';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-kulfi-white-100 flex flex-col font-sans relative selection:bg-bhangra-pink-500 selection:text-white root-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 md:right-8 z-50 bg-jugaad-black-900 border-2 border-bhangra-pink-500 rounded-neo-card p-4 shadow-glow-pink max-w-sm animate-bounce flex items-center gap-3">
          <Sparkles className="text-bhangra-pink-500 animate-spin flex-shrink-0" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Sticky Header Glassmorphic */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 sm:px-6 lg:px-8 z-40 pointer-events-none">
        <div className="glass-morphic border border-white/10 backdrop-blur-md rounded-2xl px-6 h-16 flex justify-between items-center pointer-events-auto shadow-2xl">
          {/* Logo with CMYK Split Animation */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-bhangra-pink-500 p-2 rounded-lg font-heading text-lg font-black text-white transform -rotate-3 hover:rotate-3 transition duration-150 shadow-neo-flat shadow-desi-lime-500">
              PB
            </div>
            <div>
              <span className="font-heading text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bhangra-pink-500 via-masala-orange-500 to-desi-lime-500 tracking-tighter cmyk-glow">
                PRESS BOOK
              </span>
              <span className="text-[10px] block tracking-widest text-desi-lime-500 font-mono -mt-1 uppercase">
                {lang === 'EN' ? 'Custom Printing Lab' : 'कस्टम प्रिंटिंग लैब'}
              </span>
            </div>
          </div>

          {/* Center Navigation links */}
          <nav className="hidden md:flex items-center gap-8 font-heading text-sm uppercase tracking-wide">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`hover:text-bhangra-pink-500 transition duration-150 ${activeTab === 'home' ? 'text-bhangra-pink-500 font-bold border-b-2 border-bhangra-pink-500' : 'text-kulfi-white-300'}`}
            >
              {lang === 'EN' ? 'Swag Library' : 'स्वैग गैलरी'}
            </button>
            <button 
              onClick={() => setActiveTab('customize')} 
              className={`hover:text-desi-lime-500 transition duration-150 flex items-center gap-1 ${activeTab === 'customize' ? 'text-desi-lime-500 font-bold border-b-2 border-desi-lime-500' : 'text-kulfi-white-300'}`}
            >
              <Sparkles size={14} className="animate-pulse" />
              {lang === 'EN' ? 'Custom Lab' : 'कस्टमाइज़ लैब'}
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`hover:text-masala-orange-500 transition duration-150 ${activeTab === 'orders' ? 'text-masala-orange-500 font-bold border-b-2 border-masala-orange-500' : 'text-kulfi-white-300'}`}
            >
              {lang === 'EN' ? 'My Swag Orders' : 'मेरे ऑर्डर्स'}
            </button>
          </nav>

          {/* Right-aligned actions */}
          <div className="flex items-center gap-4">
            {/* Lang Toggle */}
            <button 
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} 
              className="text-xs font-mono border border-white/20 px-2.5 py-1 rounded hover:bg-white/10 transition duration-150 flex items-center gap-1 bg-jugaad-black-900"
            >
              <Languages size={12} className="text-desi-lime-500" />
              {lang}
            </button>

            {/* Print Shop Partner Mode Toggle */}
            <button 
              onClick={() => setActiveTab('partner')}
              title="Print Partner Dashboard" 
              className={`p-2 rounded-full border border-white/15 bg-jugaad-black-900 transition duration-150 ${activeTab === 'partner' ? 'border-chai-gold-500 text-chai-gold-500' : 'hover:border-white/40'}`}
            >
              <Printer size={18} />
            </button>

            {/* Admin Panel Toggle */}
            <button 
              onClick={() => setActiveTab('admin')} 
              title="Admin Portal" 
              className={`p-2 rounded-full border border-white/15 bg-jugaad-black-900 transition duration-150 ${activeTab === 'admin' ? 'border-vibe-purple-500 text-vibe-purple-500' : 'hover:border-white/40'}`}
            >
              <ShieldAlert size={18} />
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setActiveTab('cart')} 
              className="relative p-2.5 bg-bhangra-pink-500 text-white rounded-full hover:scale-105 active:scale-95 transition duration-150 shadow-neo-flat shadow-jugaad-black-950"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-desi-lime-500 text-jugaad-black-950 text-2xs font-extrabold px-1.5 py-0.5 rounded-full scale-100 transition duration-150 animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={`flex-grow w-full mx-auto ${activeTab === 'home' ? 'py-0 px-0' : 'max-w-6xl px-4 md:px-8 py-4 md:py-8'}`}>
        
        {/* TAB 1: LANDING PAGE */}
        {activeTab === 'home' && (
          <>
            {/* Desktop Vinyl CD Deck (Hidden on Mobile) */}
            <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 items-center gap-4 group pointer-events-none">
              {/* Spinning Vinyl Record Disc */}
              <div className="w-16 h-16 bg-black rounded-full border-2 border-desi-lime-500/30 flex items-center justify-center relative shadow-2xl pointer-events-auto animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite] cursor-pointer">
                {/* Grooves */}
                <div className="absolute inset-2 border border-white/5 rounded-full"></div>
                <div className="absolute inset-4 border border-white/10 rounded-full"></div>
                <div className="absolute inset-6 border border-white/15 rounded-full"></div>
                {/* Center Label (Mini CD) */}
                <div className="w-6 h-6 bg-desi-lime-500 rounded-full flex items-center justify-center relative shadow">
                  <div className="w-1.5 h-1.5 bg-jugaad-black-950 rounded-full"></div>
                </div>
              </div>

              {/* Cassette/CD Player Control Box (Slides open on hover or sits next to it) */}
              <div className="bg-[#052016]/95 border-2 border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-2 w-44 transition-all duration-300">
                <span className="text-[9px] font-mono text-desi-lime-500 uppercase tracking-widest font-black border-b border-white/10 pb-1.5 block">
                  💿 PRESS DECK • SELECT TRACK
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'hero-intro', track: '01', name: 'Intro Swag' },
                    { id: 'print-simulator', track: '02', name: 'Squeegee Lab' },
                    { id: 'mockup-workstation', track: '03', name: 'Ink Simulator' },
                    { id: 'swag-catalog', track: '04', name: 'Swag Catalog' },
                    { id: 'studio-footer', track: '05', name: 'Studio Footer' }
                  ].map((track, idx) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        const el = document.getElementById(track.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        setActiveSectionIdx(idx);
                      }}
                      className={`w-full text-left py-1 px-2 rounded flex items-center gap-2 group/btn cursor-pointer transition text-2xs font-mono ${
                        activeSectionIdx === idx 
                          ? 'bg-desi-lime-500/10 text-white border-l-2 border-desi-lime-500 pl-1.5' 
                          : 'hover:bg-white/5 text-kulfi-white-300 hover:text-white'
                      }`}
                    >
                      <span className={`${activeSectionIdx === idx ? 'text-desi-lime-500' : 'text-desi-lime-500/60'} font-extrabold`}>{track.track}</span>
                      <span className="truncate">{track.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Spinning CD Button */}
            <div 
              onClick={() => setMobileDeckOpen(!mobileDeckOpen)}
              className="fixed left-4 bottom-20 z-50 md:hidden w-12 h-12 rounded-full border border-desi-lime-500/40 bg-jugaad-black-950 flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer animate-[spin_8s_linear_infinite]"
            >
              {/* Grooves */}
              <div className="absolute inset-1 border border-white/5 rounded-full"></div>
              <div className="absolute inset-2 border border-white/10 rounded-full"></div>
              <div className="absolute inset-3 border border-white/15 rounded-full"></div>
              {/* Center Label (Mini CD) */}
              <div className="w-4 h-4 bg-desi-lime-500 rounded-full flex items-center justify-center relative shadow">
                <div className="w-1 h-1 bg-jugaad-black-950 rounded-full"></div>
              </div>
            </div>

            {/* Mobile Sliding Track Panel */}
            {mobileDeckOpen && (
              <div className="fixed bottom-[5.5rem] left-4 right-4 z-50 bg-[#052016]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-2">
                <span className="text-[9px] font-mono text-desi-lime-500 uppercase tracking-widest font-black border-b border-white/10 pb-1.5 block">
                  💿 PRESS DECK • SELECT TRACK
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'hero-intro', track: '01', name: 'Intro Swag' },
                    { id: 'print-simulator', track: '02', name: 'Squeegee Lab' },
                    { id: 'mockup-workstation', track: '03', name: 'Ink Simulator' },
                    { id: 'swag-catalog', track: '04', name: 'Swag Catalog' },
                    { id: 'studio-footer', track: '05', name: 'Studio Footer' }
                  ].map((track, idx) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        const el = document.getElementById(track.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        setActiveSectionIdx(idx);
                        setMobileDeckOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded flex items-center gap-2 cursor-pointer transition text-xs font-mono ${
                        activeSectionIdx === idx 
                          ? 'bg-desi-lime-500/10 text-white border-l-2 border-desi-lime-500 pl-2.5' 
                          : 'hover:bg-white/5 text-kulfi-white-300 hover:text-white'
                      }`}
                    >
                      <span className="text-desi-lime-500 font-extrabold">{track.track}</span>
                      <span className="truncate">{track.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-0">
              
              {/* BrandIntro Section */}
              <BrandIntro 
                lang={lang}
                onCustomizeClick={(productType, initialText) => {
                  const template = PRODUCT_TEMPLATES.find(p => p.id === productType);
                  if (template) {
                    setSelectedProduct(template);
                  }
                  if (initialText) {
                    setPrintText(initialText);
                  }
                  setActiveTab('customize');
                }}
              />

              {/* Blank Merchandise Catalog Grid */}
              <section id="swag-catalog" className="snap-section pt-20 pb-8 flex flex-col justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 h-screen overflow-hidden">
                <MerchCatalog 
                  onCustomizeProduct={(product) => {
                    setSelectedProduct(product);
                    setActiveTab('customize');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  onAddToCart={handleQuickAddToCart}
                />
              </section>
            </div>
          </>
        )}

        {/* TAB 2: CUSTOMIZE LAB */}
        {activeTab === 'customize' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONTAINER: Merch Interactive Mockup Canvas */}
            <div className="lg:col-span-7 bg-jugaad-black-900 border-3 border-jugaad-black-950 rounded-[32px_8px_32px_8px] p-4 md:p-6 flex flex-col justify-between items-center relative overflow-hidden h-[45vh] lg:h-auto max-h-[440px] bg-radial from-jugaad-black-900 to-jugaad-black-950">
              <div className="w-full flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-mono text-desi-lime-500 uppercase tracking-widest">Merchandise Workspace</h3>
                  <h2 className="text-xl font-bold uppercase text-white">{selectedProduct.name} Mockup</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setScale(1);
                      setRotation(0);
                      setOffsetX(0);
                      setOffsetY(0);
                      triggerToast('Canvas Reset Complete!');
                    }} 
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-kulfi-white-400 hover:text-white transition text-xs flex items-center gap-1 font-mono"
                  >
                    <RotateCw size={12} /> Reset Canvas
                  </button>
                </div>
              </div>

              {/* Dynamic canvas element container based on aspect ratio */}
              <div 
                className="relative rounded-lg shadow-2xl transition-all duration-500 ease-[var(--ease-out-quint)] border-4 border-jugaad-black-950 flex justify-center items-center max-w-sm w-full mx-auto overflow-hidden"
                style={{ 
                  backgroundColor: canvasColor.hex,
                  aspectRatio: selectedProduct.aspect ? selectedProduct.aspect.replace(':', '/') : '1/1',
                  minHeight: '340px'
                }}
              >
                {/* Overlay the transparent PNG mockup image on top */}
                <div className="absolute inset-0 pointer-events-none rounded-lg flex justify-center items-center p-6">
                  <img 
                    src={selectedProduct.imageUrl} 
                    className="max-w-[90%] max-h-[90%] object-contain" 
                    style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
                    alt="Base Mockup" 
                  />
                </div>

                {/* Printable Safe Dynamic Boundary Box */}
                <div 
                  className="absolute border-2 border-dashed border-kulfi-white-400 rounded flex justify-center items-center pointer-events-none"
                  style={getPrintZoneStyle(selectedProduct.id)}
                >
                  <div className="absolute top-1 left-2 text-[6px] font-mono text-white/70 uppercase">PRINT ZONE</div>

                  {/* Dynamic Image Overlay Layer */}
                  {uploadedImage && (
                    <div 
                      className="absolute w-24 h-24 pointer-events-auto transition-transform duration-100 ease-out select-none"
                      style={{
                        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`,
                        border: isSubjectIsolated ? '1px solid #ADFF2F' : 'none',
                        boxShadow: isSubjectIsolated ? '0 0 8px #ADFF2F' : 'none'
                      }}
                    >
                      <img 
                        src={uploadedImage} 
                        className={`w-full h-full object-contain pointer-events-none select-none rounded`}
                        style={{ 
                          filter: isBgRemoved ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' : 'none',
                          mixBlendMode: isBgRemoved ? 'normal' : 'multiply'
                        }} 
                        alt="Custom visual" 
                      />
                    </div>
                  )}

                  {/* Custom Print Text Layer inside Print Zone */}
                  {printText && (
                    <div 
                      className={`absolute uppercase tracking-wider text-center w-full pointer-events-none z-10`}
                      style={{
                        color: textColor,
                        fontSize: `${textSize}px`,
                        bottom: selectedProduct.id === 'pen' ? 'auto' : '6%',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                      }}
                    >
                      <span className={`${textFont} block font-black`}>{printText}</span>
                    </div>
                  )}

                  {/* Cylindrical wrapping lighting overlay for Coffee Mugs */}
                  {selectedProduct.id === 'mug' && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 15%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.05) 85%, rgba(0,0,0,0.55) 100%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  )}

                  {/* Cylindrical wrapping lighting overlay for Pens */}
                  {selectedProduct.id === 'pen' && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 20%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0.55) 100%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  )}

                  {/* Fabric folds shading overlay for T-Shirts & Hoodies */}
                  {(selectedProduct.id === 'tshirt' || selectedProduct.id === 'hoodie') && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                    >
                      <div 
                        className="absolute pointer-events-none"
                        style={{
                          width: '227.27%',
                          left: '-63.64%',
                          ...(selectedProduct.id === 'tshirt' 
                             ? { height: '263.16%', top: '-57.89%' } 
                             : { height: '294.12%', top: '-73.53%' }
                          ),
                          backgroundImage: `url(${selectedProduct.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'grayscale(1) contrast(1.4) brightness(1.05)',
                          mixBlendMode: 'multiply',
                          opacity: 0.35,
                        }}
                      />
                    </div>
                  )}

                  {/* Plastic reflections glare overlay for Premium Mobile Cover */}
                  {selectedProduct.id === 'phone_case' && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.2) 100%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  )}
                </div>

                {/* AI Background removal loader overlay */}
                {bgRemoving && (
                  <div className="absolute inset-0 bg-jugaad-black-950 z-30 flex flex-col justify-center items-center rounded-lg overflow-hidden">
                    <PrintingAssemblyLoader 
                      loadingMode={true} 
                      itemType={selectedProduct.id === 'mug' ? 'mug' : 'tshirt'} 
                      customText={printText || 'PRESS BOOK'} 
                      customTextColor={textColor}
                      shirtColor={canvasColor.hex}
                      mugColor={canvasColor.hex}
                      loop={true}
                    />
                    <div className="absolute bottom-4 text-2xs font-mono text-desi-lime-500 uppercase tracking-widest animate-pulse">Running Background Removal Ink Pass...</div>
                  </div>
                )}
              </div>

              {/* Bottom Canvas Specs list */}
              <div className="w-full border-t border-white/5 mt-6 pt-4 grid grid-cols-3 text-center gap-2">
                <div className="bg-jugaad-black-950/50 p-2 rounded">
                  <span className="text-3xs font-mono text-kulfi-white-400 block">BASE SWAG</span>
                  <span className="text-xs font-bold font-heading">{selectedProduct.id.toUpperCase()}</span>
                </div>
                <div className="bg-jugaad-black-950/50 p-2 rounded">
                  <span className="text-3xs font-mono text-kulfi-white-400 block">SHADE</span>
                  <span className="text-xs font-bold font-heading">{canvasColor.name}</span>
                </div>
                <div className="bg-jugaad-black-950/50 p-2 rounded">
                  <span className="text-3xs font-mono text-kulfi-white-400 block">RESOLUTION</span>
                  <span className="text-xs font-bold font-heading text-desi-lime-500">300 DPI</span>
                </div>
              </div>
            </div>

            {/* RIGHT CONTAINER: Control workspace */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-jugaad-black-900 border-3 border-jugaad-black-950 rounded-[16px_48px_16px_48px] p-4 md:p-6 space-y-4 lg:space-y-6 lg:max-h-[440px] overflow-y-auto pr-2">
              
              {/* Product selector Card */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-[16px_48px_16px_48px] p-5">
                <h3 className="text-xs font-mono text-desi-lime-500 uppercase mb-3">1. Select Base Canvas</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCT_TEMPLATES.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-2.5 rounded text-xs font-heading font-bold uppercase transition border ${selectedProduct.id === prod.id ? 'border-bhangra-pink-500 bg-bhangra-pink-500/10 text-white' : 'border-white/10 text-kulfi-white-400 hover:border-white/20'}`}
                    >
                      {prod.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Color pickers */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-5">
                <h3 className="text-xs font-mono text-bhangra-pink-500 uppercase mb-3">
                  2. {getSwatchLabel(selectedProduct.id)}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {CANVAS_COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setCanvasColor(col)}
                      className={`w-9 h-9 rounded-full border-2 transition ${canvasColor.name === col.name ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* Upload center / Stickers */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-[16px_48px_16px_48px] p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono text-desi-lime-500 uppercase">Drop your artwork here! 🎨</h3>
                  <span className="text-3xs font-mono text-kulfi-white-400">Max 10MB</span>
                </div>
                
                {/* Upload Trigger */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-white/15 hover:border-desi-lime-500 rounded-lg flex flex-col items-center justify-center gap-2 group transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] cursor-pointer bg-jugaad-black-950/40 text-center"
                  >
                    <Upload className="text-kulfi-white-400 group-hover:text-desi-lime-500 group-hover:scale-105 transition" size={20} />
                    <span className="text-[11px] font-heading font-semibold">Drop your artwork here! 🎨</span>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </button>

                  <div className="p-3 bg-jugaad-black-950/50 rounded-lg flex flex-col justify-between">
                    <div className="text-3xs font-mono text-kulfi-white-400 uppercase">Current Graphic:</div>
                    <div className="text-xs font-bold text-white truncate max-w-[150px]">{uploadedImageName}</div>
                    <button 
                      onClick={() => {
                        setUploadedImage('');
                        setUploadedImageName('No image');
                        setIsBgRemoved(false);
                        setIsSubjectIsolated(false);
                      }} 
                      className="text-left text-2xs font-bold text-bazaar-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={10} /> Delete Layer
                    </button>
                  </div>
                </div>

                {/* Demo Stickers Slider */}
                <div>
                  <span className="text-3xs font-mono text-kulfi-white-400 block mb-2 uppercase">Or Choose Hot Demo Stickers:</span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                    {STICKER_TEMPLATES.map((stick) => (
                      <button
                        key={stick.id}
                        onClick={() => {
                          setUploadedImage(stick.url);
                          setUploadedImageName(stick.name);
                        }}
                        className={`w-14 h-14 rounded overflow-hidden border-2 flex-shrink-0 transition hover:scale-105 ${uploadedImage === stick.url ? 'border-desi-lime-500 scale-105' : 'border-white/10'}`}
                      >
                        <img src={stick.url} className="w-full h-full object-cover" alt="sticker preview" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Tools Controls */}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="text-3xs font-mono text-kulfi-white-400 uppercase mb-2">AI LAB TOOLS:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={runBackgroundRemoval}
                      className={`py-2 px-3 rounded text-xs font-heading font-bold flex items-center justify-center gap-1.5 border transition ${isBgRemoved ? 'border-desi-lime-500 bg-desi-lime-500/10 text-desi-lime-500' : 'border-white/10 text-white hover:border-white/30 bg-jugaad-black-950/40'}`}
                    >
                      <Scissors size={12} />
                      {isBgRemoved ? 'BG Removed' : 'Kala Jaadu (BG)'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsSubjectIsolated(!isSubjectIsolated);
                        triggerToast(isSubjectIsolated ? 'Subject contour hidden' : 'Contour contour highlighted (Gen Z lime outline)');
                      }}
                      className={`py-2 px-3 rounded text-xs font-heading font-bold flex items-center justify-center gap-1.5 border transition ${isSubjectIsolated ? 'border-desi-lime-500 bg-desi-lime-500/20 text-desi-lime-500' : 'border-white/10 text-white hover:border-white/30 bg-jugaad-black-950/40'}`}
                    >
                      <Layers size={12} />
                      Contour Outline
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Text input */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-[16px_48px_16px_48px] p-5 space-y-4">
                <h3 className="text-xs font-mono text-masala-orange-500 uppercase">What should it say? ✍️</h3>
                
                <input
                  type="text"
                  value={printText}
                  onChange={(e) => setPrintText(e.target.value)}
                  placeholder="Enter custom slogan..."
                  className="w-full bg-jugaad-black-950 border border-white/10 focus:border-masala-orange-500 text-white rounded p-3 text-sm focus:outline-none transition"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-3xs font-mono text-kulfi-white-400 block mb-1.5 uppercase">Text Color</span>
                    <div className="flex gap-1.5">
                      {TEXT_COLORS.map((col) => (
                        <button
                          key={col.hex}
                          onClick={() => setTextColor(col.hex)}
                          className={`w-6 h-6 rounded-full border transition ${textColor === col.hex ? 'border-white scale-110 shadow' : 'border-transparent'}`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">Font Styling</span>
                    <select
                      value={textFont}
                      onChange={(e) => setTextFont(e.target.value)}
                      className="w-full bg-jugaad-black-950 border border-white/10 text-white text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-masala-orange-500"
                    >
                      <option value="font-heading">CLASH DISPLAY</option>
                      <option value="font-sans">SATOSHI</option>
                      <option value="font-mono">JETBRAINS MONO</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xs font-mono text-kulfi-white-400 uppercase">Text Scale</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setTextSize(prev => Math.max(12, prev - 2))} 
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition text-xs"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-mono w-8 text-center">{textSize}px</span>
                    <button 
                      onClick={() => setTextSize(prev => Math.min(48, prev + 2))} 
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition text-xs"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transform Canvas Controls */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-5 space-y-4">
                <h3 className="text-xs font-mono text-vibe-purple-500 uppercase">5. Graphic Position & Size</h3>
                
                {/* Scale Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-3xs font-mono text-kulfi-white-400 uppercase">
                    <span>Graphic Scale</span>
                    <span>{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-vibe-purple-500 bg-jugaad-black-950 h-1 rounded"
                  />
                </div>

                {/* Rotation Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-3xs font-mono text-kulfi-white-400 uppercase">
                    <span>Graphic Rotation</span>
                    <span>{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-vibe-purple-500 bg-jugaad-black-950 h-1 rounded"
                  />
                </div>

                {/* Offset Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-3xs font-mono text-kulfi-white-400 uppercase block">Horiz Shift (X)</span>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={offsetX}
                      onChange={(e) => setOffsetX(parseInt(e.target.value))}
                      className="w-full accent-vibe-purple-500 bg-jugaad-black-950 h-1 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xs font-mono text-kulfi-white-400 uppercase block">Vert Shift (Y)</span>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="w-full accent-vibe-purple-500 bg-jugaad-black-950 h-1 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing breakdown & Add to Cart button */}
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-[16px_48px_16px_48px] p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-mono text-kulfi-white-400 uppercase block">Calculated Price</span>
                    <div className="text-3xl font-heading font-extrabold text-white">
                      ₹{selectedProduct.totalPrice}
                    </div>
                  </div>
                  
                  <div className="text-right text-3xs font-mono text-kulfi-white-400 max-w-[200px]">
                    <div className="flex justify-between gap-2 border-b border-white/5 pb-1">
                      <span>Item Maker Cost 🧵:</span>
                      <span className="font-bold text-white">₹{selectedProduct.basePrice}</span>
                    </div>
                    <div className="flex justify-between gap-2 pt-1 text-desi-lime-500">
                      <span>Press Book Studio Fee ☕:</span>
                      <span className="font-bold">₹{selectedProduct.commission}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-neo-pill font-heading font-extrabold uppercase bg-bhangra-pink-500 text-white border-2 border-jugaad-black-950 shadow-neo-flat shadow-desi-lime-500 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} /> Drop in Cart 🛍️
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: SHOPPING CART */}
        {activeTab === 'cart' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase text-white tracking-tight border-b-2 border-white/10 pb-4">
              Your Swag Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </h2>

            {cart.length === 0 ? (
              <div className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-12 text-center max-w-xl mx-auto space-y-6">
                <ShoppingBag size={48} className="text-kulfi-white-400 mx-auto opacity-50 animate-bounce" />
                <h3 className="font-heading text-xl font-bold uppercase text-white">Cart is Empty, Boss!</h3>
                <p className="text-kulfi-white-400 text-sm">
                  Go ahead and create some awesome custom printed merchandise in the Lab.
                </p>
                <button
                  onClick={() => setActiveTab('customize')}
                  className="px-6 py-3 rounded bg-bhangra-pink-500 text-white font-heading font-extrabold uppercase hover:scale-105 active:scale-95 transition"
                >
                  Enter Lab Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Cart Items list */}
                <div className="lg:col-span-8 space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-5 flex flex-col md:flex-row gap-5 items-center justify-between hover:border-white/20 transition"
                    >
                      {/* item thumbnail */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div 
                          className="w-20 h-20 rounded border border-white/10 flex-shrink-0 flex justify-center items-center relative overflow-hidden"
                          style={{ backgroundColor: item.canvasColor }}
                        >
                          {item.imageUrl && (
                            <img src={item.imageUrl} className="w-12 h-12 object-contain absolute opacity-80" alt="thumb" />
                          )}
                          {item.printText && (
                            <div className="absolute bottom-1 w-full text-center text-[6px] font-bold text-white truncate px-1">
                              {item.printText}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-heading text-base font-bold text-white">{item.productName}</h4>
                          <div className="text-2xs font-mono text-kulfi-white-400 mt-1 uppercase space-y-0.5">
                            <div>Shade: <span className="text-white font-bold">{item.canvasColorName}</span></div>
                            <div>File: <span className="text-white font-bold truncate max-w-[120px] inline-block align-bottom">{item.imageName}</span></div>
                            {item.isBgRemoved && <div className="text-desi-lime-500">AI Background Removed</div>}
                          </div>
                        </div>
                      </div>

                      {/* quantity & edits */}
                      <div className="flex items-center gap-8 justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="p-1.5 rounded bg-jugaad-black-950 border border-white/10 text-white hover:bg-white/5 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="p-1.5 rounded bg-jugaad-black-950 border border-white/10 text-white hover:bg-white/5 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price Details */}
                        <div className="text-right">
                          <div className="text-lg font-heading font-extrabold text-white">
                            ₹{item.totalPrice * item.quantity}
                          </div>
                          <span className="text-3xs font-mono text-kulfi-white-400 block">
                            ₹{item.totalPrice} each
                          </span>
                        </div>

                        {/* Remove button */}
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-2 text-kulfi-white-400 hover:text-bazaar-red-500 rounded bg-white/5 hover:bg-white/10 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Checkout Summary panel */}
                <div className="lg:col-span-4 bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-6 space-y-6">
                  <h3 className="font-heading text-lg font-bold uppercase text-white border-b border-white/5 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs font-mono text-kulfi-white-400">
                    <div className="flex justify-between">
                      <span>Item Maker Cost 🧵:</span>
                      <span className="text-white font-bold">₹{getCartTotals().baseSum}</span>
                    </div>
                    <div className="flex justify-between text-desi-lime-500">
                      <span>Press Book Studio Fee ☕:</span>
                      <span className="font-bold">₹{getCartTotals().commissionSum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery (on us!) 🚚:</span>
                      <span className="text-desi-lime-500 font-bold uppercase">FREE</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between text-base font-heading font-extrabold text-white">
                      <span>Grand Total:</span>
                      <span className="text-bhangra-pink-500 text-xl">₹{getCartTotals().totalSum}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-3.5 rounded-neo-pill font-heading font-extrabold uppercase bg-bhangra-pink-500 text-white border-2 border-jugaad-black-950 shadow-neo-flat shadow-desi-lime-500 transition-all duration-500 ease-[var(--ease-out-quint)] hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-1.5"
                  >
                    Proceed to Checkout <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 4: MY SWAG ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase text-white tracking-tight border-b-2 border-white/10 pb-4">
              Your Print Orders Tracking
            </h2>

            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-6 space-y-6">
                  {/* order header details */}
                  <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-4 gap-4">
                    <div>
                      <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Order ID</span>
                      <span className="text-base font-bold text-white font-mono">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Date Placed</span>
                      <span className="text-sm font-semibold text-white">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Payment Route</span>
                      <span className="text-sm font-semibold text-white">{order.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Fulfillment Status</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-heading font-extrabold uppercase mt-1 inline-block ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* items summary list */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded border border-white/10 flex-shrink-0 flex justify-center items-center"
                            style={{ backgroundColor: item.canvasColor }}
                          >
                            {item.imageUrl && (
                              <img src={item.imageUrl} className="w-8 h-8 object-contain" alt="thumb" />
                            )}
                          </div>
                          <div>
                            <div className="font-heading text-sm font-bold text-white uppercase">{item.productName}</div>
                            <span className="text-kulfi-white-400 text-2xs uppercase">Canvas Shade: {item.canvasColorName} | Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-heading font-bold text-sm text-white">₹{item.totalPrice * item.quantity}</div>
                          <span className="text-3xs text-kulfi-white-400 block">(Base: ₹{item.basePrice} + Commission: ₹{item.commission})</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* delivery tracking matrix map */}
                  <div className="bg-jugaad-black-950/80 p-4 rounded-lg border border-white/5 space-y-4">
                    <div className="text-xs font-mono text-desi-lime-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} className="animate-spin" /> Live Middleman Dispatch Status
                    </div>
                    <div className="grid grid-cols-4 text-center text-3xs font-mono uppercase tracking-wide gap-2">
                      <div className={`p-2 rounded border ${order.status === 'Design Approved' ? 'border-bhangra-pink-500 text-bhangra-pink-500 font-bold bg-bhangra-pink-500/5' : 'border-white/5 text-kulfi-white-400'}`}>
                        1. Approved
                      </div>
                      <div className={`p-2 rounded border ${order.status === 'Partner Printing' ? 'border-chai-gold-500 text-chai-gold-500 font-bold bg-chai-gold-500/5' : 'border-white/5 text-kulfi-white-400'}`}>
                        2. Partner Shop
                      </div>
                      <div className={`p-2 rounded border ${order.status === 'Out for Delivery' ? 'border-vibe-purple-500 text-vibe-purple-500 font-bold bg-vibe-purple-500/5' : 'border-white/5 text-kulfi-white-400'}`}>
                        3. Dispached
                      </div>
                      <div className={`p-2 rounded border ${order.status === 'Delivered' ? 'border-desi-lime-500 text-desi-lime-500 font-bold bg-desi-lime-500/5' : 'border-white/5 text-kulfi-white-400'}`}>
                        4. Delivered
                      </div>
                    </div>
                  </div>

                  {/* Shipping address info */}
                  <div className="flex gap-2.5 items-start text-xs text-kulfi-white-400 border-t border-white/5 pt-4">
                    <MapPin size={16} className="text-masala-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-white">Delivery Swag Destination:</span>
                      <div>{order.shippingAddress.fullName} • +91 {order.shippingAddress.phone}</div>
                      <div>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: PARTNER/PRINT-SHOP DASHBOARD */}
        {activeTab === 'partner' && (
          <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center border-b-2 border-white/10 pb-4 gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase text-white tracking-tight">
                  Printing Partner Center
                </h2>
                <p className="text-kulfi-white-400 text-sm">
                  Incoming printing orders for local shop fulfillment. All base manufacturing logic belongs here.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-jugaad-black-900 border border-white/10 px-4 py-2 rounded-lg">
                <Printer size={18} className="text-chai-gold-500 animate-pulse" />
                <span className="text-xs font-mono uppercase text-chai-gold-500 font-bold">Partner Code: PRT-9403</span>
              </div>
            </div>

            {/* Payout metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Total Base Printing Revenue</span>
                  <span className="text-2xl font-heading font-extrabold text-white">₹{orders.reduce((sum, ord) => sum + ord.items.reduce((acc, it) => acc + (it.basePrice * it.quantity), 0), 0)}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-full text-white"><TrendingUp size={20} /></div>
              </div>
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Pending Job Prints</span>
                  <span className="text-2xl font-heading font-extrabold text-chai-gold-500">{orders.filter(ord => ord.status === 'Design Approved' || ord.status === 'Partner Printing').length} Jobs</span>
                </div>
                <div className="p-3 bg-white/5 rounded-full text-white"><Clock size={20} /></div>
              </div>
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Dispatched To Middleman</span>
                  <span className="text-2xl font-heading font-extrabold text-desi-lime-500">{orders.filter(ord => ord.status === 'Out for Delivery' || ord.status === 'Delivered').length} Jobs</span>
                </div>
                <div className="p-3 bg-white/5 rounded-full text-white"><Check size={20} /></div>
              </div>
            </div>

            {/* Print Jobs List */}
            <div className="space-y-6">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Active Printing Jobs</h3>
              
              {orders.map(order => (
                <div key={order.id} className="bg-jugaad-black-900 border-2 border-white/10 rounded-neo-card p-6 space-y-4">
                  {/* Job Header */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'Design Approved' && (
                        <button
                          onClick={() => handlePartnerUpdateStatus(order.id, 'Partner Printing')}
                          className="px-3 py-1.5 bg-chai-gold-500 hover:bg-chai-gold-600 text-jugaad-black-950 font-heading font-bold text-xs uppercase rounded transition"
                        >
                          Accept & Print Job
                        </button>
                      )}
                      {order.status === 'Partner Printing' && (
                        <button
                          onClick={() => handlePartnerUpdateStatus(order.id, 'Out for Delivery')}
                          className="px-3 py-1.5 bg-vibe-purple-500 hover:bg-vibe-purple-600 text-white font-heading font-bold text-xs uppercase rounded transition"
                        >
                          Mark Job Printed & Ship
                        </button>
                      )}
                      {order.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handlePartnerUpdateStatus(order.id, 'Delivered')}
                          className="px-3 py-1.5 bg-desi-lime-500 hover:bg-desi-lime-600 text-jugaad-black-950 font-heading font-bold text-xs uppercase rounded transition"
                        >
                          Deliver to Customer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Print specifications matrix (Critical parameter for partner) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-xs font-mono text-desi-lime-500 uppercase font-semibold">Custom Specifications:</div>
                      
                      {order.items.map(item => (
                        <div key={item.id} className="bg-jugaad-black-950/80 p-4 rounded border border-white/5 space-y-2 text-xs font-mono">
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">PRODUCT TYPE:</span>
                            <span className="text-white font-bold">{item.productType.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">CANVAS SHADE:</span>
                            <span className="text-white font-bold">{item.canvasColorName} ({item.canvasColor})</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">QTY TO MANUFACTURE:</span>
                            <span className="text-white font-bold">{item.quantity} units</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">GRAPHIC FILE:</span>
                            <span className="text-white font-bold truncate max-w-[200px]">{item.imageName}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">TRANSFORMS:</span>
                            <span className="text-white font-bold">Scale: {item.scale}x, Rot: {item.rotation}°, X/Y: {item.offsetX}/{item.offsetY}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-kulfi-white-400">TEXT TO PRINT:</span>
                            <span className="text-bhangra-pink-500 font-extrabold">{item.printText || 'NONE'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-kulfi-white-400">TEXT HEX COLOR:</span>
                            <span className="text-white font-bold" style={{ color: item.textColor }}>{item.textColor}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* visual print asset download center */}
                    <div className="bg-jugaad-black-950/60 p-4 rounded border border-white/5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-bhangra-pink-500 uppercase font-semibold">Print Asset Center</div>
                        <p className="text-3xs font-mono text-kulfi-white-400">
                          Inspect the composite print layer design file with isolated transparency parameters.
                        </p>
                        
                        {order.items[0]?.imageUrl && (
                          <div className="w-full h-32 bg-jugaad-black-950 border border-white/10 rounded flex justify-center items-center relative overflow-hidden">
                            <img src={order.items[0].imageUrl} className="max-h-28 object-contain" alt="print preview" />
                            {order.items[0].isBgRemoved && (
                              <span className="absolute top-1 right-1 bg-desi-lime-500 text-jugaad-black-950 text-[8px] font-mono font-bold px-1.5 rounded uppercase">AI MASK PASS</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <a 
                          href={order.items[0]?.imageUrl} 
                          download={`PrintJob_${order.id}`}
                          className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-2xs uppercase text-center border border-white/10"
                        >
                          Download Print file
                        </a>
                        <button
                          onClick={() => alert(`Printing configuration blueprint sent to partner printer queue (300 DPI layout output format)`)}
                          className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-2xs uppercase text-center border border-white/10"
                        >
                          Print Blueprint
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 6: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase text-white tracking-tight border-b-2 border-white/10 pb-4">
              Middleman Admin Center
            </h2>

            {/* Middleman Commission metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg">
                <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Total Gross Sales</span>
                <span className="text-3xl font-heading font-extrabold text-white">₹{orders.reduce((sum, ord) => sum + ord.totalAmount, 0)}</span>
              </div>
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg">
                <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Middleman Commissions (12%)</span>
                <span className="text-3xl font-heading font-extrabold text-desi-lime-500">₹{orders.reduce((sum, ord) => sum + ord.items.reduce((acc, it) => acc + (it.commission * it.quantity), 0), 0)}</span>
                <span className="text-3xs font-mono text-desi-lime-500 block mt-1">Our exact platform share</span>
              </div>
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg">
                <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Print Shop Partner Payouts</span>
                <span className="text-3xl font-heading font-extrabold text-white">₹{orders.reduce((sum, ord) => sum + ord.items.reduce((acc, it) => acc + (it.basePrice * it.quantity), 0), 0)}</span>
              </div>
              <div className="bg-jugaad-black-900 border border-white/10 p-5 rounded-lg">
                <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Fulfillment Rate</span>
                <span className="text-3xl font-heading font-extrabold text-vibe-purple-500">100%</span>
              </div>
            </div>

            {/* General admin stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Partner listings */}
              <div className="lg:col-span-6 bg-jugaad-black-900 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="font-heading text-lg font-bold uppercase text-white border-b border-white/5 pb-2">Active Printing Shop Partners</h3>
                <div className="space-y-3 font-mono text-xs text-kulfi-white-400">
                  <div className="flex justify-between items-center p-2.5 bg-jugaad-black-950/60 rounded">
                    <div>
                      <div className="text-white font-bold">Ludhiana Swag Printers</div>
                      <span className="text-3xs">ID: PRT-9403 • Ludhiana, Punjab</span>
                    </div>
                    <span className="text-2xs bg-desi-lime-500 text-jugaad-black-950 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-jugaad-black-950/60 rounded">
                    <div>
                      <div className="text-white font-bold">Cyberabad Digital Mugs</div>
                      <span className="text-3xs">ID: PRT-8329 • Hyderabad, Telangana</span>
                    </div>
                    <span className="text-2xs bg-desi-lime-500 text-jugaad-black-950 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-jugaad-black-950/60 rounded opacity-60">
                    <div>
                      <div className="text-white font-bold">Dharavi T-shirt Ink</div>
                      <span className="text-3xs">ID: PRT-4932 • Mumbai, Maharashtra</span>
                    </div>
                    <span className="text-2xs bg-white/10 text-white/50 px-2 py-0.5 rounded uppercase font-bold">Paused</span>
                  </div>
                </div>
              </div>

              {/* Gen Z Indian Market Insights */}
              <div className="lg:col-span-6 bg-jugaad-black-900 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="font-heading text-lg font-bold uppercase text-white border-b border-white/5 pb-2">Vibe Analytics</h3>
                <div className="space-y-4 text-xs font-mono text-kulfi-white-400">
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span>MOST ORDERED PRODUCT:</span>
                      <span className="text-white font-bold">Mast Over-Sized Tee (65%)</span>
                    </div>
                    <div className="w-full bg-jugaad-black-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-bhangra-pink-500 h-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span>MOST POPULAR CANVAS COLOR:</span>
                      <span className="text-white font-bold">Jugaad Black (55%)</span>
                    </div>
                    <div className="w-full bg-jugaad-black-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-vibe-purple-500 h-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span>MOST PRINTED DESI SLANG:</span>
                      <span className="text-white font-bold">"BAWAAL" (42%)</span>
                    </div>
                    <div className="w-full bg-jugaad-black-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-desi-lime-500 h-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vinyl CD Deck: Active Job Status Indicator */}
            <div className="mt-8 p-6 bg-gradient-to-r from-jugaad-black-950 to-jugaad-black-900 border border-white/10 rounded-lg flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 animate-spin-slow flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-bhangra-pink-500"></div>
                 </div>
                 <div>
                   <h4 className="font-heading font-bold text-white uppercase">Live Production Deck</h4>
                   <p className="text-2xs font-mono text-kulfi-white-400">Syncing real-time print head telemetry from fulfillment partners.</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 {['STATUS_OK', 'SYNC_LIVE', 'READY_PRINT'].map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-white/5 text-desi-lime-500 text-3xs font-mono font-bold uppercase border border-desi-lime-500/20">{tag}</span>
                 ))}
               </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER: Mobile bottom navigation bar + Desktop directory */}
      <footer id="studio-footer" className={`bg-jugaad-black-900 border-t border-white/10 relative flex flex-col justify-center overflow-hidden ${activeTab === 'home' ? 'snap-section h-screen pt-24 pb-8' : 'py-8'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <h4 className="font-heading text-sm font-black uppercase text-white">Press Book</h4>
              <p className="text-kulfi-white-400 text-xs max-w-[200px]">
                Premium custom design and merchandise printing services. No minimum order limit.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading text-sm font-black uppercase text-white">Legal Swag</h4>
              <ul className="text-xs font-mono text-kulfi-white-400 space-y-1.5 uppercase">
                <li><a href="#" className="hover:text-white">Privacy Spec</a></li>
                <li><a href="#" className="hover:text-white">Terms of printing</a></li>
                <li><a href="#" className="hover:text-white">Partner policy</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading text-sm font-black uppercase text-white">Custom Lab</h4>
              <ul className="text-xs font-mono text-kulfi-white-400 space-y-1.5 uppercase">
                <li><a href="#" onClick={() => { setSelectedProduct(PRODUCT_TEMPLATES[0]); setActiveTab('customize'); }} className="hover:text-white">T-shirts</a></li>
                <li><a href="#" onClick={() => { setSelectedProduct(PRODUCT_TEMPLATES[1]); setActiveTab('customize'); }} className="hover:text-white">Coffee Mugs</a></li>
                <li><a href="#" onClick={() => { setSelectedProduct(PRODUCT_TEMPLATES[2]); setActiveTab('customize'); }} className="hover:text-white">Pens</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-heading text-sm font-black uppercase text-white">We accept</h4>
              <div className="flex flex-wrap gap-2 text-2xs font-mono uppercase text-desi-lime-500">
                <span className="px-2 py-1 bg-jugaad-black-950 rounded border border-white/5">UPI</span>
                <span className="px-2 py-1 bg-jugaad-black-950 rounded border border-white/5">RuPay</span>
                <span className="px-2 py-1 bg-jugaad-black-950 rounded border border-white/5">Net Banking</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-kulfi-white-400 pt-8 border-t border-white/5">
            © 2026 PRESS BOOK PRINTS • CO-PUBLISHED & DELIVERED GLOBALLY. ALL PRINTS INTENDED.
          </div>
        </div>

        {/* Mobile Sticky Floating Navigation bar */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-jugaad-black-900 border-t border-white/10 md:hidden flex justify-around items-center h-16 px-4 backdrop-blur-lg bg-opacity-95">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex flex-col items-center justify-center w-12 h-12 transition ${activeTab === 'home' ? 'text-bhangra-pink-500' : 'text-kulfi-white-400'}`}
          >
            <Layers size={18} />
            <span className="text-[9px] font-bold uppercase mt-1">Library</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('customize')} 
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-bhangra-pink-500 text-white shadow-glow-pink border-4 border-jugaad-black-950 transform -translate-y-4 hover:scale-105 active:scale-95 transition`}
          >
            <Sparkles size={20} className="animate-pulse" />
          </button>
          
          <button 
            onClick={() => setActiveTab('cart')} 
            className={`flex flex-col items-center justify-center w-12 h-12 relative transition ${activeTab === 'cart' ? 'text-bhangra-pink-500' : 'text-kulfi-white-400'}`}
          >
            <ShoppingBag size={18} />
            <span className="text-[9px] font-bold uppercase mt-1">Cart</span>
            {cart.length > 0 && (
              <span className="absolute top-1.5 right-2 bg-desi-lime-500 text-jugaad-black-950 text-3xs font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </nav>
      </footer>

      {/* MODAL 1: CHECKOUT INFO */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-jugaad-black-950/80 backdrop-blur-sm">
          <div className="bg-jugaad-black-900 border-3 border-bhangra-pink-500 rounded-neo-card max-w-lg w-full p-6 shadow-glow-pink space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white flex items-center gap-1.5">
                <MapPin size={18} className="text-bhangra-pink-500" /> Checkout & Shipping
              </h3>
              <button 
                onClick={() => setCheckoutModalOpen(false)}
                className="text-kulfi-white-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Phone & OTP login verification (OTP authentication required for security) */}
            <div className="bg-jugaad-black-950/70 p-4 rounded border border-white/5 space-y-4">
              <div className="text-xs font-mono text-desi-lime-500 uppercase tracking-widest flex items-center gap-1">
                <User size={12} /> Secure OTP Authentication
              </div>

              {!otpVerified ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div className="col-span-2">
                      <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">10-Digit Mobile Number (+91)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-xs font-mono text-kulfi-white-400">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value.replace(/\D/g,'') })}
                          placeholder="9876543210"
                          className="w-full bg-jugaad-black-900 border border-white/10 focus:border-desi-lime-500 text-white rounded p-2.5 pl-12 text-sm focus:outline-none transition"
                        />
                      </div>
                    </div>
                    <button
                      onClick={sendMockOtp}
                      className="py-2.5 px-3 rounded bg-desi-lime-500 hover:bg-desi-lime-600 text-jugaad-black-950 font-heading font-bold text-xs uppercase transition"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>

                  {otpSent && (
                    <div className="grid grid-cols-3 gap-2 items-end border-t border-white/5 pt-3">
                      <div className="col-span-2">
                        <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">Enter 6-Digit OTP Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={inputOtp}
                          onChange={(e) => setInputOtp(e.target.value.replace(/\D/g,''))}
                          placeholder="123456"
                          className="w-full bg-jugaad-black-900 border border-white/10 focus:border-desi-lime-500 text-white rounded p-2.5 text-sm focus:outline-none transition font-mono tracking-widest text-center"
                        />
                      </div>
                      <button
                        onClick={verifyMockOtp}
                        className="py-2.5 px-3 rounded bg-white text-jugaad-black-950 font-heading font-bold text-xs uppercase transition"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {otpError && (
                    <div className="text-xs font-mono text-bazaar-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {otpError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-desi-lime-500/10 border border-desi-lime-500/30 p-2.5 rounded text-xs text-desi-lime-500 font-mono">
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    <span>Customer Verified: +91 {shippingAddress.phone}</span>
                  </div>
                  <button 
                    onClick={() => { setOtpVerified(false); setOtpSent(false); }}
                    className="text-white hover:underline text-3xs uppercase font-bold"
                  >
                    Change Number
                  </button>
                </div>
              )}
            </div>

            {/* Address Form */}
            <div className="space-y-4">
              <div className="text-xs font-mono text-masala-orange-500 uppercase tracking-widest">
                Delivery Swag Address
              </div>

              <div>
                <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full bg-jugaad-black-950 border border-white/10 focus:border-masala-orange-500 text-white rounded p-2.5 text-sm focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">Pincode (ZIP)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={shippingAddress.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g,''))}
                    placeholder="500081"
                    className="w-full bg-jugaad-black-950 border border-white/10 focus:border-masala-orange-500 text-white rounded p-2.5 text-sm focus:outline-none transition font-mono"
                  />
                  {pincodeError && (
                    <span className="text-[10px] text-bazaar-red-500 block mt-1 font-mono">{pincodeError}</span>
                  )}
                </div>

                <div>
                  <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">State / Territory</label>
                  <input
                    type="text"
                    readOnly
                    value={shippingAddress.state}
                    placeholder="Enter PIN to auto-select"
                    className="w-full bg-jugaad-black-950/60 border border-white/10 text-kulfi-white-400 rounded p-2.5 text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">City</label>
                  <input
                    type="text"
                    readOnly
                    value={shippingAddress.city}
                    placeholder="Enter PIN to auto-select"
                    className="w-full bg-jugaad-black-950/60 border border-white/10 text-kulfi-white-400 rounded p-2.5 text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-3xs font-mono text-kulfi-white-400 block mb-1 uppercase">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="Flat No, Wing, Building Name"
                    className="w-full bg-jugaad-black-950 border border-white/10 focus:border-masala-orange-500 text-white rounded p-2.5 text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* checkout total & action */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <div>
                <span className="text-3xs font-mono text-kulfi-white-400 block uppercase">Total Amount</span>
                <span className="text-xl font-heading font-extrabold text-white">₹{getCartTotals().totalSum}</span>
              </div>
              <button
                onClick={initiatePayment}
                className="py-3 px-6 rounded-neo-pill bg-bhangra-pink-500 text-white font-heading font-extrabold uppercase hover:scale-105 transition"
              >
                Proceed to Payment &rarr;
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: UPI PAYMENTS (RAZORPAY SIMULATED GATEWAY) */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-jugaad-black-950/80 backdrop-blur-sm">
          <div className="bg-jugaad-black-900 border-3 border-desi-lime-500 rounded-neo-card max-w-sm w-full p-6 shadow-glow-lime space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-heading text-base font-bold uppercase text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-desi-lime-500" /> UPI Secure checkout
              </h3>
              <span className="text-3xs font-mono text-kulfi-white-400 bg-jugaad-black-950 px-2 py-0.5 rounded border border-white/5">UPI AutoRoute v2.0</span>
            </div>

            {/* QR Scan container */}
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg text-center space-y-4">
              <div className="text-3xs font-mono text-jugaad-black-500 uppercase tracking-widest font-bold">Scan QR code using BHIM, GPay, Paytm</div>
              
              {/* Dummy QR Code using CSS vectors */}
              <div className="w-40 h-40 bg-jugaad-black-950 border-8 border-white p-2 flex flex-wrap relative">
                {/* QR Finder squares */}
                <div className="w-12 h-12 border-4 border-white absolute top-2 left-2 bg-jugaad-black-950"></div>
                <div className="w-12 h-12 border-4 border-white absolute top-2 right-2 bg-jugaad-black-950"></div>
                <div className="w-12 h-12 border-4 border-white absolute bottom-2 left-2 bg-jugaad-black-950"></div>
                <div className="absolute inset-8 bg-white border border-jugaad-black-950 grid grid-cols-2 p-1 gap-1">
                  <div className="bg-jugaad-black-950"></div>
                  <div></div>
                  <div></div>
                  <div className="bg-jugaad-black-950"></div>
                </div>
              </div>

              <div>
                <span className="text-2xs font-mono text-jugaad-black-900 font-bold block">UPI ID: pressbook@paytm</span>
                <span className="text-xs font-heading font-extrabold text-bhangra-pink-500">PAY ₹{getCartTotals().totalSum}</span>
              </div>
            </div>

            {/* Timeout countdown */}
            <div className="bg-jugaad-black-950/70 p-3 rounded border border-white/5 flex justify-between items-center text-xs font-mono">
              <span className="text-kulfi-white-400">QR Code Expires in:</span>
              <span className="text-chai-gold-500 font-bold">
                {Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, '0')} mins
              </span>
            </div>

            {/* Payment simulation processing */}
            {paymentProcessing ? (
              <div className="p-4 bg-jugaad-black-950 rounded border border-white/5 overflow-hidden min-h-[300px] flex flex-col justify-center items-center">
                <PrintingAssemblyLoader 
                  loadingMode={true} 
                  itemType={cart[0]?.productType === 'mug' ? 'mug' : 'tshirt'} 
                  customText={cart[0]?.printText || 'PRINTING SWAG'} 
                  customTextColor={cart[0]?.textColor || '#ff3366'}
                  shirtColor={cart[0]?.canvasColor || '#090A0F'}
                  mugColor={cart[0]?.canvasColor || '#f8fafc'}
                  loop={true}
                  speed="fast"
                />
                <span className="text-xs font-mono text-desi-lime-500 uppercase tracking-widest mt-4 animate-pulse">Printing & Packaging your Swag...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="py-2.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-heading font-bold text-xs uppercase transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSuccess}
                  className="py-2.5 rounded bg-desi-lime-500 hover:bg-desi-lime-600 text-jugaad-black-950 font-heading font-bold text-xs uppercase transition"
                >
                  Simulate UPI Success
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
