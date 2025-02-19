import * as React from 'react';
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import theme from '@/src/theme/theme';

interface BlobProps {
  size?: number;
}

export default function Blob({ size = 120 }: BlobProps) {
  const scale = size / 314; // normalize to original SVG size

  return (
    <Svg
      width={size}
      height={size * (271/314)} // maintain aspect ratio
      viewBox="0 0 314 271"
    >
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="154.541"
          y1="0"
          x2="277.433"
          y2="215.148"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#A2D0E4" />
          <Stop offset="0.655" stopColor="#7089E6" />
          <Stop offset="1" stopColor="#9997E1" />
        </LinearGradient>
      </Defs>

      <Ellipse
        cx="157"
        cy="219.5"
        rx="157"
        ry="51.5"
        fill="#333333"
        fillOpacity="0.3"
      />
      
      <Path
        d="M1.71165 148.436C8.54718 86.1272 26.695 62.5216 66.1234 29.7999C121.451 -16.1166 190.675 -1.42012 239.641 23.5558C288.607 48.5318 318.512 127.403 304.71 171.44C290.907 215.476 188.046 258.527 125.606 252.283C63.1657 246.039 -6.83276 226.321 1.71165 148.436Z"
        fill="url(#paint0_linear)"
      />

      {/* Eyes */}
      <Path
        d="M105 101.002C105 119.12 96.9568 122 89.8804 122C77.3358 122 72.5128 113.693 71.2261 106.54C69.9393 99.387 74.1203 82.0251 84.4137 80.2349C96.3135 78.1654 105 90.1572 105 101.002Z"
        fill="white"
      />
      <Circle cx="89.1735" cy="101.173" r="11.1735" fill="black" />
      
      <Path
        d="M238 105.967C238 123.431 222.5 122.567 217.01 121.536C204.859 119.256 206.031 108.94 206.031 100.266C206.031 91.5918 212.168 79.3589 222.501 80.0262C234.719 80.8151 238 95.5137 238 105.967Z"
        fill="white"
      />
      <Circle cx="220.173" cy="101.173" r="11.1735" fill="black" />

      {/* Eyebrows */}
      <Path
        d="M219 69L231.5 72.5"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Path
        d="M68 73.3013L83 70"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Smile */}
      <Path
        d="M129 126C130.972 131.587 137.882 140.996 156.614 140.996C174.36 140.996 180.924 132.244 184.21 126"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </Svg>
  );
} 