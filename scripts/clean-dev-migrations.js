#!/usr/bin/env node

/**
 * Clean Dev Mode Migrations Script
 * 
 * This script removes dev mode migration records from the database.
 * Dev mode records have batch = -1 and prevent production migrations from running.
 * 
 * Usage:
 *   node scripts/clean-dev-migrations.js
 * 
 * Requirements:
 *   - POSTGRES_URL environment variable must be set
 */

import { createRequire } from 'module'
import pg from 'pg'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const { Pool } = pg

async function cleanDevMigrations() {
  const connectionString = process.env.POSTGRES_URL

  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL environment variable is not set')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  })

  try {
    console.log('🔍 Checking for dev mode migration records...')

    // Check if the table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      );
    `)

    if (!tableCheck.rows[0].exists) {
      console.log('✅ payload_migrations table does not exist yet. Nothing to clean.')
      await pool.end()
      return
    }

    // Check for dev mode records
    const devRecordsCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM payload_migrations 
      WHERE batch = -1;
    `)

    const devRecordCount = parseInt(devRecordsCheck.rows[0].count, 10)

    if (devRecordCount === 0) {
      console.log('✅ No dev mode migration records found. Database is clean.')
      await pool.end()
      return
    }

    console.log(`⚠️  Found ${devRecordCount} dev mode migration record(s).`)
    console.log('🧹 Cleaning dev mode migration records...')

    // Delete dev mode records
    const result = await pool.query(`
      DELETE FROM payload_migrations 
      WHERE batch = -1 
      RETURNING name;
    `)

    console.log(`✅ Successfully removed ${result.rowCount} dev mode migration record(s):`)
    result.rows.forEach((row) => {
      console.log(`   - ${row.name}`)
    })

    console.log('\n✨ Database is now ready for production migrations.')
  } catch (error) {
    console.error('❌ Error cleaning dev mode migrations:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the cleanup
cleanDevMigrations()
