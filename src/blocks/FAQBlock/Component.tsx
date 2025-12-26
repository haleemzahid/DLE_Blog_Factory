'use client'

import React, { useState } from 'react'
import type { FAQBlock as FAQBlockType } from '@/payload-types'
import RichText from '@/components/RichText'

type FAQItem = {
  question: string
  answer: any
  id?: string | null
}

type Props = FAQBlockType & {
  id?: string
  resolvedFaqs?: FAQItem[]
}

export const FAQBlockComponent: React.FC<Props> = ({
  title,
  faqs,
  layout = 'accordion',
  defaultOpen = false,
  resolvedFaqs,
}) => {
  const faqItems = resolvedFaqs || faqs || []
  const [openItems, setOpenItems] = useState<Set<number>>(defaultOpen ? new Set([0]) : new Set())

  if (faqItems.length === 0) {
    return null
  }

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const renderAccordion = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqItems.map((faq, index) => (
        <div key={`${faq.id}-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openItems.has(index) ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              openItems.has(index) ? 'max-h-[1000px]' : 'max-h-0'
            }`}
          >
            <div className="p-4 bg-gray-50 text-gray-600">
              <RichText data={faq.answer} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTwoColumn = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {faqItems.map((faq, index) => (
        <div key={`${faq.id}-${index}`} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
          <div className="text-gray-600">
            <RichText data={faq.answer} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      {faqItems.map((faq, index) => (
        <div key={`${faq.id}-${index}`} className="cursor-pointer" onClick={() => toggleItem(index)}>
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 transition-transform ${openItems.has(index) ? 'rotate-90' : ''}`}
            >
              ▶
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              {openItems.has(index) && (
                <div className="mt-2 text-gray-600">
                  <RichText data={faq.answer} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}

        {layout === 'accordion' && renderAccordion()}
        {layout === 'twoColumn' && renderTwoColumn()}
        {layout === 'list' && renderList()}
      </div>
    </section>
  )
}
