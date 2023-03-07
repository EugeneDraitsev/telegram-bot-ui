'use client'

import styled from 'styled-components'

const Svg = styled.svg`
  animation: rotate-360 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
`

const Circle = styled.circle`
  animation: spinner-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke: ${(p) => p.color || p.theme.colors.primary};
`

interface SpinnerProps {
  size?: number | string
  strokeWidth?: number
  color?: string
  className?: string
}

export const Spinner = ({
  size = 50,
  color,
  strokeWidth = 2,
  className,
}: SpinnerProps) => (
  <Svg
    className={className}
    style={{ width: size, height: size }}
    viewBox="25 25 50 50"
    aria-label="spinner"
  >
    <Circle
      color={color}
      cx="50"
      cy="50"
      r="20"
      fill="none"
      strokeWidth={strokeWidth}
      strokeMiterlimit="10"
    />
  </Svg>
)
