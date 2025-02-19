import * as React from 'react';
import Svg, { 
  Path, 
  Circle, 
  Ellipse, 
  Defs, 
  LinearGradient, 
  Stop,
} from 'react-native-svg';
import theme from '@/src/theme/theme';

interface BlobProps {
  size?: number;
}

export default function Blob({ size = 347 }: BlobProps) {
  const scale = size / 347;
  const height = 310 * scale;

  return (
    <Svg width={size} height={height} viewBox="0 0 347 310" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_180_469"
          x1="173.541"
          y1="24"
          x2="296.433"
          y2="239.148"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#A2D0E4" />
          <Stop offset="0.655" stopColor="#7089E6" />
          <Stop offset="1" stopColor="#9997E1" />
        </LinearGradient>
      </Defs>

      {/* Shadow Ellipse */}
      <Ellipse
        cx="177"
        cy="250.5"
        rx="157"
        ry="51.5"
        fill="#333333"
        fillOpacity="0.3"
      />
      
      {/* Main Blob Shape */}
      <Path
        d="M20.7117 172.436C27.5472 110.127 45.695 86.5216 85.1234 53.7999C140.451 7.88342 209.675 22.5799 258.641 47.5558C307.607 72.5318 337.512 151.403 323.71 195.44C309.907 239.476 207.046 282.527 144.606 276.283C82.1657 270.039 12.1672 250.321 20.7117 172.436Z"
        fill="url(#paint0_linear_180_469)"
      />

      {/* Left Eye */}
      <Path
        d="M124 125.002C124 143.12 115.957 146 108.88 146C96.3358 146 91.5128 137.693 90.2261 130.54C88.9393 123.387 93.1203 106.025 103.414 104.235C115.314 102.165 124 114.157 124 125.002Z"
        fill="white"
      />
      <Circle cx="108.173" cy="125.173" r="11.1735" fill="black" />

      {/* Right Eye */}
      <Path
        d="M257 129.967C257 147.431 241.5 146.567 236.01 145.536C223.859 143.256 225.031 132.94 225.031 124.266C225.031 115.592 231.168 103.359 241.501 104.026C253.719 104.815 257 119.514 257 129.967Z"
        fill="white"
      />
      <Circle cx="239.173" cy="125.173" r="11.1735" fill="black" />

      {/* Eyebrows */}
      <Path
        d="M238 93L250.5 96.5"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Path
        d="M87 97.3013L102 94"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Mouth - Exact curve from SVG */}
      <Path
        d="M141.267 165C141.122 170.52 143.475 180.622 157.03 184.818C169.872 188.794 177.085 182.308 181.22 177.368"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </Svg>
  );
} 