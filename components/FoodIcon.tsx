import React from "react"
import Svg, { Path } from "react-native-svg"

export const FoodIcon = ({ color = "#01519A", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <Path d="M6 1v7" />
    <Path d="M10 1v7" />
  </Svg>
)

