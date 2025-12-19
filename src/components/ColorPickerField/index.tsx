'use client'

import React from 'react'
import { useField, TextInput, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

export const ColorPickerField: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="field-type text">
      <FieldLabel label={field.label} path={path} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={handleColorChange}
          style={{
            width: '50px',
            height: '38px',
            padding: '2px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={handleTextChange}
          placeholder="#ffffff"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
            fontSize: '14px',
          }}
        />
        <div
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: value || '#ffffff',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
          }}
        />
      </div>
      {field.admin?.description && typeof field.admin.description === 'string' && (
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
          {field.admin.description}
        </p>
      )}
    </div>
  )
}
