'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="DleBlogFactory"
        width={40}
        height={40}
        className="object-contain"
      />
      <span className="font-bold text-lg text-gray-900 dark:text-white">DleBlogFactory</span>
    </div>
  )
}

export default Logo
