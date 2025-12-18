"use client"

import { useState, useCallback } from "react"

export interface AgentResponse {
    status: "success" | "error"
    agent_id: string
    content: string
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export interface AgentSettings {
    temperature?: number
    top_p?: number
    max_tokens?: number
}

export interface CallAgentParams {
    prompt: string
    settings?: AgentSettings
    user_context?: Record<string, unknown>
}

interface UseAgentReturn {
    callAgent: (params: CallAgentParams) => Promise<AgentResponse | null>
    loading: boolean
    error: string | null
    response: AgentResponse | null
    reset: () => void
}

/**
 * Custom hook to interact with AI/Agent endpoints.
 * 
 * @param agentSlug - The slug of the agent to call (e.g., 'story-generator')
 * @returns Object containing callAgent function, loading state, error state, and response
 */
export function useAgent(agentSlug: string): UseAgentReturn {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [response, setResponse] = useState<AgentResponse | null>(null)

    const reset = useCallback(() => {
        setError(null)
        setResponse(null)
        setLoading(false)
    }, [])

    const callAgent = useCallback(async ({ prompt, settings, user_context }: CallAgentParams) => {
        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            // Call the Next.js proxy route which forwards to the FastAPI backend
            const res = await fetch(`/api/tools/${agentSlug}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt,
                    settings,
                    user_context,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || `Error ${res.status}: Failed to fetch response`)
            }

            if (data.status === "error") {
                throw new Error(data.message || "Agent execution failed")
            }

            setResponse(data as AgentResponse)
            return data as AgentResponse

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
            setError(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }, [agentSlug])

    return { callAgent, loading, error, response, reset }
}
