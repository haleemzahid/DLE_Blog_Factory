'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      <Image
        src="/logo.png"
        alt="DleBlogFactory"
        width={80}
        height={80}
        style={{ objectFit: 'contain' }}
      />
      <span
        style={{
          fontSize: '20px',
        }}
      >
        DleBlogFactory
      </span>
    </div>
  )
}

export default Logo
