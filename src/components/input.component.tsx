'use client'

import React, { type JSX } from 'react'
import styled from 'styled-components'

const Holder = styled.div`
  position: relative;
  display: inline-block;
`
const Icon = styled.div`
  position: absolute;
  height: 22px;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
`
const BaseInput = styled.input<{ $hasIcon: boolean; $iconPadding: number }>`
  display: block;
  border: 1px solid ${(p) => p.theme.colors.inactive};
  border-radius: 6px;
  height: 35px;
  padding: ${(p) => (p.$hasIcon ? `0 8px 0 ${p.$iconPadding}px` : '0 8px')};
  transition: border 0.3s ease-in-out;
  font-size: 14px;
  + ${Icon} {
    color: ${(p) => p.theme.colors.inactive};
    transition: color 0.3s ease-in-out;
  }
  &:active,
  &:focus {
    border: 1px solid ${(p) => p.theme.colors.primary};
    outline: none;
    + ${Icon} {
      color: ${(p) => p.theme.colors.primary};
    }
  }
`

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  icon?: JSX.Element | string
  iconPadding?: number
  className?: string
}

export const Input = ({
  icon,
  className,
  iconPadding = 35,
  ...props
}: InputProps) => (
  <Holder className={className}>
    <BaseInput $hasIcon={Boolean(icon)} $iconPadding={iconPadding} {...props} />
    {icon && <Icon>{icon}</Icon>}
  </Holder>
)
