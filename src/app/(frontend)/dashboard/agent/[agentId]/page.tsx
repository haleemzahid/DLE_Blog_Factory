import React from 'react'
import { AgentDashboard } from '@/components/Analytics'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface AgentDashboardPageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({
  params,
}: AgentDashboardPageProps): Promise<Metadata> {
  const { agentId } = await params
  const payload = await getPayload({ config: configPromise })

  try {
    const agent = await payload.findByID({
      collection: 'agents',
      id: agentId,
    })

    return {
      title: `${agent.name}'s Dashboard | DLE Blog Factory`,
      description: `Analytics dashboard for ${agent.name}`,
    }
  } catch {
    return {
      title: 'Agent Dashboard | DLE Blog Factory',
    }
  }
}

/**
 * Agent Dashboard Page
 * Displays analytics dashboard for a specific agent
 */
export default async function AgentDashboardPage({ params }: AgentDashboardPageProps) {
  const { agentId } = await params
  const payload = await getPayload({ config: configPromise })

  // Get agent info
  let agent
  try {
    agent = await payload.findByID({
      collection: 'agents',
      id: agentId,
    })
  } catch {
    notFound()
  }

  if (!agent) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AgentDashboard agentId={agentId} agentName={agent.name} />
    </div>
  )
}
