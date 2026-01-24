'use client'

import React, { useState, useEffect } from 'react'

/**
 * Uniqueness Indicator Component for PayloadCMS Admin
 *
 * Displays a visual indicator of content uniqueness score
 * with warnings and recommendations for SEO safety.
 */

interface UniquenessIndicatorProps {
  score: number
  showDetails?: boolean
  onRefresh?: () => void
}

interface ScoreConfig {
  color: string
  bgColor: string
  borderColor: string
  grade: string
  icon: string
  description: string
}

const getScoreConfig = (score: number): ScoreConfig => {
  if (score >= 70) {
    return {
      color: '#065f46',
      bgColor: '#d1fae5',
      borderColor: '#10b981',
      grade: 'Excellent',
      icon: '✓',
      description: 'Content is highly unique and safe for syndication',
    }
  }
  if (score >= 50) {
    return {
      color: '#1e40af',
      bgColor: '#dbeafe',
      borderColor: '#3b82f6',
      grade: 'Good',
      icon: '✓',
      description: 'Content has good uniqueness for most use cases',
    }
  }
  if (score >= 35) {
    return {
      color: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#f59e0b',
      grade: 'Acceptable',
      icon: '!',
      description: 'Content meets minimum uniqueness, consider adding more unique elements',
    }
  }
  if (score >= 20) {
    return {
      color: '#9a3412',
      bgColor: '#ffedd5',
      borderColor: '#f97316',
      grade: 'Risky',
      icon: '⚠',
      description: 'Content uniqueness is low, high risk of duplicate content issues',
    }
  }
  return {
    color: '#991b1b',
    bgColor: '#fee2e2',
    borderColor: '#ef4444',
    grade: 'Dangerous',
    icon: '✗',
    description: 'Content uniqueness is critically low, likely to be flagged as duplicate',
  }
}

export const UniquenessIndicator: React.FC<UniquenessIndicatorProps> = ({
  score,
  showDetails = false,
  onRefresh,
}) => {
  const config = getScoreConfig(score)
  const [isExpanded, setIsExpanded] = useState(showDetails)

  return (
    <div
      style={{
        padding: '0.75rem',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '0.5rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Score Circle */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: `3px solid ${config.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: config.color,
                lineHeight: 1,
              }}
            >
              {score}%
            </span>
          </div>

          {/* Grade and Status */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: config.color,
                }}
              >
                {config.icon} {config.grade}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: config.color,
                opacity: 0.8,
              }}
            >
              Content Uniqueness Score
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                border: `1px solid ${config.borderColor}`,
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                color: config.color,
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              border: `1px solid ${config.borderColor}`,
              borderRadius: '0.25rem',
              backgroundColor: 'white',
              color: config.color,
              cursor: 'pointer',
            }}
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${config.borderColor}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              color: config.color,
              marginBottom: '0.5rem',
            }}
          >
            {config.description}
          </p>

          {/* Score Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.25rem',
              marginTop: '0.75rem',
            }}
          >
            {[
              { label: 'Dangerous', min: 0, max: 20 },
              { label: 'Risky', min: 20, max: 35 },
              { label: 'Acceptable', min: 35, max: 50 },
              { label: 'Good', min: 50, max: 70 },
              { label: 'Excellent', min: 70, max: 100 },
            ].map((tier) => {
              const isActive = score >= tier.min && score < (tier.max === 100 ? 101 : tier.max)
              return (
                <div
                  key={tier.label}
                  style={{
                    padding: '0.25rem',
                    textAlign: 'center',
                    fontSize: '0.625rem',
                    borderRadius: '0.125rem',
                    backgroundColor: isActive ? config.borderColor : 'rgba(255,255,255,0.5)',
                    color: isActive ? 'white' : config.color,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tier.label}
                </div>
              )
            })}
          </div>

          {/* Recommendations based on score */}
          {score < 50 && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              <strong style={{ color: config.color }}>To improve uniqueness:</strong>
              <ul
                style={{
                  margin: '0.375rem 0 0 0',
                  paddingLeft: '1rem',
                  color: config.color,
                }}
              >
                {score < 30 && <li>Add city-specific market data sections</li>}
                {score < 40 && <li>Include neighborhood information</li>}
                {score < 50 && <li>Add demographic or cultural content</li>}
                <li>Use more dynamic tokens for personalization</li>
                <li>Include agent-specific information</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Compact version for inline use
 */
export const UniquenessScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const config = getScoreConfig(score)

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.125rem 0.5rem',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: config.color,
      }}
    >
      <span>{config.icon}</span>
      <span>{score}%</span>
      <span style={{ opacity: 0.8 }}>{config.grade}</span>
    </span>
  )
}

export default UniquenessIndicator
