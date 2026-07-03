import React from 'react';

interface ProductVectorProps {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProductVector: React.FC<ProductVectorProps> = ({ productId, className = '', style }) => {
  const baseStyle: React.CSSProperties = {
    display: 'block',
    maxHeight: '100%',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    ...style,
  };

  switch (productId) {
    case 'tshirt':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main T-Shirt Body */}
          <path
            d="M34 16C37 19 63 19 66 16L78 28L68 36L66 32V84H34V32L32 36L22 28L34 16Z"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Collar seam */}
          <path
            d="M34 16C37 19 63 19 66 16"
            stroke="#090A0F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Sleeve seams */}
          <line
            x1="32"
            y1="36"
            x2="34"
            y2="32"
            stroke="#090A0F"
            strokeWidth="1"
            strokeDasharray="2 1"
          />
          <line
            x1="68"
            y1="36"
            x2="66"
            y2="32"
            stroke="#090A0F"
            strokeWidth="1"
            strokeDasharray="2 1"
          />
        </svg>
      );

    case 'hoodie':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Long sleeves & main body */}
          <path
            d="M32 22L18 48L24 53L33 38V82H67V38L76 53L82 48L68 22H32Z"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hood overlay */}
          <path
            d="M34 22C34 10 66 10 66 22C58 26 42 26 34 22Z"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pouch Pocket */}
          <path
            d="M40 58H60L58 74H42L40 58Z"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Drawstrings */}
          <line
            x1="45"
            y1="25"
            x2="45"
            y2="36"
            stroke="#090A0F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="55"
            y1="25"
            x2="55"
            y2="36"
            stroke="#090A0F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mug':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Handle */}
          <path
            d="M62 30C75 30 75 70 62 70"
            stroke="#090A0F"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M62 35C71 35 71 65 62 65"
            fill="#090A0F"
            opacity="0.05"
          />
          {/* Cylinder Body */}
          <rect
            x="24"
            y="20"
            width="38"
            height="60"
            rx="4"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Rim ellipse */}
          <ellipse
            cx="43"
            y="20"
            rx="19"
            ry="4"
            fill="#E2E8F0"
            stroke="#090A0F"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'notebook':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Notebook cover */}
          <rect
            x="28"
            y="15"
            width="46"
            height="70"
            rx="3"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spiral binding rings */}
          <path
            d="M23 22H31M23 31H31M23 40H31M23 49H31M23 58H31M23 67H31M23 76H31"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Sheet divider line */}
          <line
            x1="35"
            y1="15"
            x2="35"
            y2="85"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>
      );

    case 'pen':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="rotate(-15 50 50)">
            {/* Pen cap & body barrel */}
            <rect
              x="15"
              y="46"
              width="62"
              height="8"
              rx="1.5"
              fill="#FFFFFF"
              stroke="#090A0F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Pocket clip */}
            <path
              d="M58 42H70V48"
              stroke="#090A0F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pen nib tip */}
            <path
              d="M15 46L8 50L15 54Z"
              fill="#E2E8F0"
              stroke="#090A0F"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Grip bands */}
            <line x1="28" y1="46" x2="28" y2="54" stroke="#090A0F" strokeWidth="1.5" />
            <line x1="32" y1="46" x2="32" y2="54" stroke="#090A0F" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'phone_case':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phone Cover Case Body */}
          <rect
            x="32"
            y="15"
            width="36"
            height="70"
            rx="7"
            fill="#FFFFFF"
            stroke="#090A0F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Camera bump rectangle */}
          <rect
            x="36"
            y="19"
            width="12"
            height="18"
            rx="2"
            fill="#E2E8F0"
            stroke="#090A0F"
            strokeWidth="1.5"
          />
          {/* Camera Lenses */}
          <circle cx="42" cy="24" r="2.5" fill="#090A0F" />
          <circle cx="42" cy="32" r="2.5" fill="#090A0F" />
          {/* Volume button details */}
          <rect x="30" y="30" width="2" height="6" fill="#090A0F" rx="0.5" />
          <rect x="30" y="38" width="2" height="6" fill="#090A0F" rx="0.5" />
        </svg>
      );

    default:
      return null;
  }
};
