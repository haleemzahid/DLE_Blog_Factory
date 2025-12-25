'use client'

import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <Image
      src="/logo.png"
      alt="DleBlogFactory"
      width={32}
      height={32}
      className="object-contain"
    />
  )
}

export default Icon
