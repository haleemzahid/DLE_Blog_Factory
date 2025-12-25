'use client'

import React from 'react'
import './styles.css'

export const Icon: React.FC = () => {
  return (
    <img
      src="/logo.png"
      alt="DleBlogFactory"
      width={40}
      height={40}
      style={{
        objectFit: 'contain',
        width: '40px',
        height: '40px',
        minWidth: '40px',
        minHeight: '40px',
        maxWidth: 'none',
      }}
    />
  )
}

export default Icon
