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
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ? 0 : null)

  if (faqItems.length === 0) {
    return null
  }

  const toggleItem = (index: number) => {
    // Only one item can be open at a time - clicking same item closes it
    setOpenIndex(openIndex === index ? null : index)
  }

  const renderAccordion = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wide">
          {title}
        </h2>
      )}
      {faqItems.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div key={`${faq.id}-${index}`} className="mb-3 last:mb-0">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#f7f9fb] hover:bg-gray-100 transition-colors"
            >
              <span
                className={`text-sm md:text-base font-medium ${isOpen ? 'text-red-500' : 'text-[#1a365d]'}`}
              >
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                  isOpen ? 'rotate-180' : ''
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
                isOpen ? 'max-h-[1000px]' : 'max-h-0'
              }`}
            >
              <div className="py-4 text-gray-600 text-sm leading-relaxed">
                <RichText data={faq.answer} />
              </div>
            </div>
          </div>
        )
      })}
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
        <div
          key={`${faq.id}-${index}`}
          className="cursor-pointer"
          onClick={() => toggleItem(index)}
        >
          <div className="flex items-start gap-3">
            <span className={`mt-1 transition-transform ${openIndex === index ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              {openIndex === index && (
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
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && layout !== 'accordion' && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">
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
