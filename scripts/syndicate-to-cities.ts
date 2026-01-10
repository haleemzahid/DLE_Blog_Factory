/**
 * CLI Script: Syndicate Content to Cities
 *
 * Usage:
 *   pnpm tsx scripts/syndicate-to-cities.ts --template <postId> --cities <city1,city2,city3>
 *   pnpm tsx scripts/syndicate-to-cities.ts --template <postId> --region southern --dry-run
 *   pnpm tsx scripts/syndicate-to-cities.ts --template <postId> --tier tier1
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { syndicatePostToCities } from '../src/utilities/syndicateContent'

async function main() {
  const args = process.argv.slice(2)

  // Parse command line arguments
  const options = parseArguments(args)

  if (!options.templatePostId) {
    console.error('❌ Error: --template <postId> is required')
    printUsage()
    process.exit(1)
  }

  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ config })

  console.log('✅ Payload CMS initialized')
  console.log()

  try {
    const result = await syndicatePostToCities(payload, options)

    if (result.success) {
      console.log('\n🎉 Syndication completed successfully!')
      process.exit(0)
    } else {
      console.log('\n⚠️  Syndication completed with errors')
      process.exit(1)
    }
  } catch (error: any) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

function parseArguments(args: string[]): any {
  const options: any = {
    dryRun: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--template':
      case '-t':
        options.templatePostId = args[++i]
        break

      case '--cities':
      case '-c':
        options.cityIds = args[++i].split(',')
        break

      case '--region':
      case '-r':
        options.region = args[++i]
        break

      case '--tier':
        options.cityTier = args[++i]
        break

      case '--max':
      case '-m':
        options.maxCities = parseInt(args[++i])
        break

      case '--dry-run':
      case '-d':
        options.dryRun = true
        break

      case '--help':
      case '-h':
        printUsage()
        process.exit(0)
        break
    }
  }

  return options
}

function printUsage() {
  console.log(`
Syndicate Template Post to Cities

Usage:
  pnpm tsx scripts/syndicate-to-cities.ts [options]

Options:
  -t, --template <id>     Template post ID (required)
  -c, --cities <ids>      Comma-separated city IDs (optional)
  -r, --region <region>   Filter by region: northern, central, southern, all (default: all)
  --tier <tier>           Filter by tier: tier1, tier2, tier3, all (default: all)
  -m, --max <number>      Maximum number of cities to process (default: 1000)
  -d, --dry-run           Preview without making changes
  -h, --help              Show this help message

Examples:
  # Syndicate to specific cities (dry run)
  pnpm tsx scripts/syndicate-to-cities.ts --template abc123 --cities city1,city2,city3 --dry-run

  # Syndicate to all Southern California cities
  pnpm tsx scripts/syndicate-to-cities.ts --template abc123 --region southern

  # Syndicate to top 50 cities only
  pnpm tsx scripts/syndicate-to-cities.ts --template abc123 --tier tier1

  # Syndicate to first 10 cities (dry run)
  pnpm tsx scripts/syndicate-to-cities.ts --template abc123 --max 10 --dry-run
`)
}

main()
