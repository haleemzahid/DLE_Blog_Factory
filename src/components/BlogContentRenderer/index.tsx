'use client'

import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'
import styles from './index.module.css'

type BlogContentRendererProps = {
  content: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}

/**
 * BlogContentRenderer - Simple HTML tag renderer
 *
 * Converts Lexical JSON to simple HTML tags only
 * No complex components, no converters, just plain HTML
 */

export function BlogContentRenderer({
  content,
  enableGutter = true,
  enableProse = true,
  className,
}: BlogContentRendererProps) {
  if (!content) {
    return null
  }

  // Recursively render nodes as simple HTML
  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    const { type, children = [] } = node

    // TEXT - apply ALL formatting (support combined formats)
    if (type === 'text') {
      let text = node.text || ''

      if (node.format) {
        let formattedText: React.ReactNode = text

        // Apply formats in order (innermost to outermost)
        // This allows combined formats like bold+underline
        if (node.format & 8) formattedText = <code>{formattedText}</code> // Code
        if (node.format & 16) formattedText = <s>{formattedText}</s> // Strikethrough
        if (node.format & 4) formattedText = <u>{formattedText}</u> // Underline
        if (node.format & 2) formattedText = <em>{formattedText}</em> // Italic
        if (node.format & 1) formattedText = <strong>{formattedText}</strong> // Bold

        return <span key={index}>{formattedText}</span>
      }

      return text
    }

    // PARAGRAPH
    if (type === 'paragraph') {
      return <p key={index}>{children.map((c: any, i: number) => renderNode(c, i))}</p>
    }

    // HEADING
    if (type === 'heading') {
      const tag = node.tag || 'h2'
      const headingClasses: Record<string, string> = {
        h1: '!text-4xl !font-bold !my-6',
        h2: '!text-3xl !font-bold !my-5',
        h3: '!text-2xl !font-bold !my-4',
        h4: '!text-xl !font-bold !my-4',
        h5: '!text-lg !font-bold !my-3',
        h6: '!text-base !font-bold !my-3',
      }
      const className = headingClasses[tag] || headingClasses.h2

      switch (tag) {
        case 'h1':
          return <h1 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h1>
        case 'h2':
          return <h2 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h2>
        case 'h3':
          return <h3 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h3>
        case 'h4':
          return <h4 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h4>
        case 'h5':
          return <h5 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h5>
        case 'h6':
          return <h6 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h6>
        default:
          return <h2 key={index} className={className}>{children.map((c: any, i: number) => renderNode(c, i))}</h2>
      }
    }

    // LIST
    if (type === 'list') {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return <Tag key={index}>{children.map((c: any, i: number) => renderNode(c, i))}</Tag>
    }

    // LIST ITEM
    if (type === 'listitem') {
      return <li key={index}>{children.map((c: any, i: number) => renderNode(c, i))}</li>
    }

    // QUOTE
    if (type === 'quote') {
      return <blockquote key={index}>{children.map((c: any, i: number) => renderNode(c, i))}</blockquote>
    }

    // LINK
    if (type === 'link' || type === 'autolink') {
      const href = node.fields?.url || node.url || '#'
      return <a key={index} href={href}>{children.map((c: any, i: number) => renderNode(c, i))}</a>
    }

    // LINE BREAK
    if (type === 'linebreak') {
      return <br key={index} />
    }

    // CODE BLOCK
    if (type === 'code') {
      return (
        <pre key={index}>
          <code>{children.map((c: any, i: number) => renderNode(c, i))}</code>
        </pre>
      )
    }

    // CUSTOM BLOCKS - render as simple divs with content
    if (type === 'block') {
      const blockType = node.fields?.blockType

      // Banner - simple div
      if (blockType === 'banner') {
        return (
          <div key={index} className="banner-block">
            {node.fields?.content && renderContentField(node.fields.content)}
          </div>
        )
      }

      // Code - simple pre/code
      if (blockType === 'code') {
        return (
          <pre key={index}>
            <code>{node.fields?.code || ''}</code>
          </pre>
        )
      }

      // Media - simple img
      if (blockType === 'mediaBlock') {
        const media = node.fields?.media
        if (media && typeof media === 'object' && media.url) {
          return (
            <div key={index} className="media-block">
              <img src={media.url} alt={media.alt || ''} />
              {media.caption && <p>{media.caption}</p>}
            </div>
          )
        }
      }

      return null
    }

    // For unknown types with children, just render children
    if (children.length > 0) {
      return <div key={index}>{children.map((c: any, i: number) => renderNode(c, i))}</div>
    }

    return null
  }

  // Helper to render content field in blocks
  const renderContentField = (contentField: any): React.ReactNode => {
    if (!contentField || !contentField.root) return null
    const children = contentField.root.children || []
    return children.map((node: any, i: number) => renderNode(node, i))
  }

  // Get root children
  const rootChildren = content?.root?.children || []

  return (
    <div
      className={cn(
        'blog-content',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
        },
        className,
      )}
    >
      <div
        className={cn(
          styles.blogContentWrapper,
          { 'prose prose-lg dark:prose-invert max-w-none': enableProse }
        )}
      >
        {rootChildren.map((node: any, index: number) => renderNode(node, index))}
      </div>
    </div>
  )
}

export default BlogContentRenderer
