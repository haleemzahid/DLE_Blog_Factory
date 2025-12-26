import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <div className={clsx('relative w-[70px] h-[70px]', className)}>
      <img
        src="https://designatedlocalexpert.com/wp-content/uploads/2022/07/cropped-cropped-fav-150x150.png"
        alt="Designated Local Expert Logo"
        width={150}
        height={150}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="object-contain"
      />
    </div>
  )
}
