'use client'

import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
}

export const Button = styled(({ loading, ...props }: ButtonProps) => (
  <button {...props} />
))`
  cursor: pointer;
  height: 40px;
  background-color: ${({ disabled, theme: { colors } }) =>
    disabled ? colors.inactive : colors.primary};
  border: none;
  box-sizing: border-box;
  border-radius: 6px;
  color: ${({ disabled, theme: { colors } }) =>
    disabled ? colors.inactiveText : colors.activeText};
  font-size: 14px;
  font-weight: 300;
  padding: 0 16px;
  transition: 0.3s ease-in-out all;
  &:focus {
    outline: none;
  }
  &:disabled {
    background: ${(p) => p.theme.colors.inactive};
  }
  &:hover {
    background: ${({ disabled, theme: { colors } }) =>
      disabled ? colors.inactive : darken(0.2, colors.primary)};
  }
  &::-moz-focus-inner {
    border: 0;
  }
  ${(props) =>
    props.loading
      ? css`
          position: relative;
          color: transparent;
          transition: none;
          &:before,
          &:after {
            position: absolute;
            content: '';
            top: 50%;
            left: 50%;
            margin: -11px 0 0 -11px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 4px solid rgba(0, 0, 0, 0.15);
          }
          &:after {
            border: 4px solid;
            border-color: #fff transparent transparent;
            animation: rotate-360 0.6s linear;
            animation-iteration-count: infinite;
          }
        `
      : ''}
`
