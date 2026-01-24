'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import type { Agent, CityDatum, ContentTemplate } from '@/payload-types'

/**
 * Template Preview Component for PayloadCMS Admin
 *
 * Allows editors to preview how a template will render with different
 * agent and city data combinations before publishing.
 */

interface TemplatePreviewProps {
  path: string
}

interface PreviewState {
  loading: boolean
  error: string | null
  content: string | null
  uniquenessScore: number | null
  missingTokens: string[]
  usedGenerators: string[]
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ path }) => {
  const { value: templateId } = useField<string>({ path: 'contentTemplate' })

  const [agents, setAgents] = useState<Agent[]>([])
  const [cities, setCities] = useState<CityDatum[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [preview, setPreview] = useState<PreviewState>({
    loading: false,
    error: null,
    content: null,
    uniquenessScore: null,
    missingTokens: [],
    usedGenerators: [],
  })
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch agents and cities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, citiesRes] = await Promise.all([
          fetch('/api/agents?limit=100&depth=0'),
          fetch('/api/city-data?limit=100&depth=0'),
        ])

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json()
          setAgents(agentsData.docs || [])
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json()
          setCities(citiesData.docs || [])
        }
      } catch (err) {
        console.error('Failed to fetch preview data:', err)
      }
    }

    fetchData()
  }, [])

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!selectedAgent && !selectedCity) {
      setPreview(prev => ({
        ...prev,
        error: 'Please select an agent or city to preview',
      }))
      return
    }

    setPreview(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/template-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          agentId: selectedAgent || undefined,
          cityId: selectedCity || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate preview')
      }

      const data = await response.json()

      setPreview({
        loading: false,
        error: null,
        content: data.content,
        uniquenessScore: data.uniquenessScore,
        missingTokens: data.missingTokens || [],
        usedGenerators: data.usedGenerators || [],
      })
    } catch (err) {
      setPreview(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Preview failed',
      }))
    }
  }, [templateId, selectedAgent, selectedCity])

  // Get uniqueness grade color
  const getScoreColor = (score: number | null): string => {
    if (score === null) return '#6b7280'
    if (score >= 70) return '#10b981'
    if (score >= 50) return '#3b82f6'
    if (score >= 35) return '#f59e0b'
    if (score >= 20) return '#f97316'
    return '#ef4444'
  }

  const getScoreGrade = (score: number | null): string => {
    if (score === null) return 'N/A'
    if (score >= 70) return 'Excellent'
    if (score >= 50) return 'Good'
    if (score >= 35) return 'Acceptable'
    if (score >= 20) return 'Risky'
    return 'Dangerous'
  }

  if (!templateId) {
    return null
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
          Template Preview
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Selection Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                  color: '#374151',
                }}
              >
                Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Select agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fullDesignation || agent.displayName || agent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                  color: '#374151',
                }}
              >
                City Data
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Select city...</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={generatePreview}
                disabled={preview.loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: preview.loading ? 'not-allowed' : 'pointer',
                  opacity: preview.loading ? 0.6 : 1,
                }}
              >
                {preview.loading ? 'Generating...' : 'Preview'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {preview.error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.25rem',
                color: '#b91c1c',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              {preview.error}
            </div>
          )}

          {/* Metrics Display */}
          {preview.content && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {/* Uniqueness Score */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: getScoreColor(preview.uniquenessScore),
                  }}
                >
                  {preview.uniquenessScore !== null ? `${preview.uniquenessScore}%` : 'N/A'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Uniqueness ({getScoreGrade(preview.uniquenessScore)})
                </div>
              </div>

              {/* Missing Tokens */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: preview.missingTokens.length > 0 ? '#f59e0b' : '#10b981',
                  }}
                >
                  {preview.missingTokens.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Missing Tokens
                </div>
              </div>

              {/* Used Generators */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#3b82f6',
                  }}
                >
                  {preview.usedGenerators.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Dynamic Sections
                </div>
              </div>
            </div>
          )}

          {/* Missing Tokens List */}
          {preview.missingTokens.length > 0 && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: '0.25rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#92400e',
                  marginBottom: '0.5rem',
                }}
              >
                Missing Tokens:
              </div>
              <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                {preview.missingTokens.map((token) => (
                  <code
                    key={token}
                    style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.375rem',
                      backgroundColor: '#fef3c7',
                      borderRadius: '0.125rem',
                      marginRight: '0.375rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {`{{${token}}}`}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview */}
          {preview.content && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                maxHeight: '400px',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Rendered Content
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {preview.content}
              </div>
            </div>
          )}

          {/* Used Generators List */}
          {preview.usedGenerators.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.25rem',
                }}
              >
                Dynamic Generators Used:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {preview.usedGenerators.map((gen) => (
                  <span
                    key={gen}
                    style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                    }}
                  >
                    {gen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TemplatePreview
