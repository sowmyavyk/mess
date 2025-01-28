import React from "react"
import Svg, { Path } from "react-native-svg"

export const ProfileIcon = ({ color = "#01519A", size = 24 }) => (
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
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Path d="M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
  </Svg>
)

