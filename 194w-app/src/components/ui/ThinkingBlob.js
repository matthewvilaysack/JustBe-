import * as React from "react";
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";

export default function Blob({ size = 308 }) {
  const scale = size / 308;
  const height = 253 * scale;

  return (
    <Svg width={size} height={height} viewBox="0 0 308 253" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_436_158"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(221 31) rotate(75.8686) scale(219.131 367.769)"
        >
          <Stop offset="0" stopColor="#A2D0E4" />
          <Stop offset="0.712776" stopColor="#7089E6" />
          <Stop offset="1" stopColor="#9997E1" />
        </RadialGradient>
      </Defs>

      {/* Main Blob Shape */}
      <Path
        d="M0.711654 148.436C7.54718 86.1272 25.695 62.5216 65.1234 29.7999C120.451 -16.1166 189.675 -1.42012 238.641 23.5558C287.607 48.5318 317.512 127.403 303.71 171.44C289.907 215.476 187.046 258.527 124.606 252.283C62.1657 246.039 -7.83276 226.321 0.711654 148.436Z"
        fill="url(#paint0_radial_436_158)"
      />

      {/* Left Eye */}
      <Path
        d="M104 101.002C104 119.12 95.9568 122 88.8804 122C76.3358 122 71.5128 113.693 70.2261 106.54C68.9393 99.387 73.1203 82.0251 83.4137 80.2349C95.3135 78.1654 104 90.1572 104 101.002Z"
        fill="white"
      />
      <Circle cx="90.6735" cy="93.0001" r="11.1735" fill="black" />

      {/* Right Eye */}
      <Path
        d="M237 105.967C237 123.431 221.5 122.567 216.01 121.536C203.859 119.256 205.031 108.94 205.031 100.266C205.031 91.5918 211.168 79.3589 221.501 80.0262C233.719 80.8151 237 95.5137 237 105.967Z"
        fill="white"
      />
      <Circle cx="223.173" cy="91.1735" r="11.1735" fill="black" />

      {/* Eyebrows */}
      <Path
        d="M218 69L230.5 72.5"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Path
        d="M67 73.3013L82 70"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Mouth */}
      <Path
        d="M128.663 163.759C132.163 156.259 148.663 153.5 164.163 149.259M128.663 163.759L126.163 155.259M128.663 163.759L130.163 168.759"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </Svg>
  );
}
