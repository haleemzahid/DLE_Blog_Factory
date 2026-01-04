#!/usr/bin/env node

/**
 * Vercel Build Script
 * 
 * This script handles the build process for Vercel deployments.
 * It runs migrations only if required environment variables are present.
 * 
 * Usage:
 *   node scripts/vercel-build.js
 * 
 * Requirements:
 *   - PAYLOAD_SECRET environment variable for migrations
 *   - POSTGRES_URL environment variable for database connection
 */

import { execSync } from 'child_process'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

function runCommand(command, description) {
  try {
    console.log(`\n🔧 ${description}...`)
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed successfully`)
    return true
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return false
  }
}

function build() {
  console.log('🚀 Starting Vercel build process...\n')

  const hasPayloadSecret = !!process.env.PAYLOAD_SECRET
  const hasPostgresUrl = !!process.env.POSTGRES_URL

  console.log('Environment check:')
  console.log(`  PAYLOAD_SECRET: ${hasPayloadSecret ? '✅ Set' : '❌ Not set'}`)
  console.log(`  POSTGRES_URL: ${hasPostgresUrl ? '✅ Set' : '❌ Not set'}`)

  // Run migrations only if environment variables are properly configured
  if (hasPayloadSecret && hasPostgresUrl) {
    console.log('\n✅ Environment variables detected. Running database migrations...')
    const migrationSuccess = runCommand(
      'cross-env NODE_ENV=production NODE_OPTIONS=--no-deprecation payload migrate --force-accept-warning',
      'Database migrations'
    )
    
    if (!migrationSuccess) {
      console.error('\n❌ Migration failed. Build cannot continue.')
      process.exit(1)
    }
  } else {
    console.log('\n⚠️  Skipping database migrations (environment variables not fully configured)')
    console.log('Note: Ensure PAYLOAD_SECRET and POSTGRES_URL are set in your Vercel project settings')
  }

  // Run Next.js build
  const buildSuccess = runCommand(
    'next build',
    'Next.js build'
  )

  if (!buildSuccess) {
    console.error('\n❌ Next.js build failed')
    process.exit(1)
  }

  console.log('\n✨ Vercel build completed successfully!')
}

// Run the build
try {
  build()
} catch (error) {
  console.error('❌ Build process failed:', error)
  process.exit(1)
}
