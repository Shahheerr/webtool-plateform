import { NextResponse } from "next/server"

/**
 * API Route to fetch available agents from FastAPI backend
 * 
 * GET /api/agents/list
 * 
 * Returns the list of available agents/tools from the FastAPI backend
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"

export async function GET() {
    try {
        console.log("[Next.js Proxy] Fetching agents list from backend")

        const response = await fetch(`${BACKEND_URL}/api/v1/agents/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Don't cache to always get fresh data
            cache: "no-store",
        })

        if (!response.ok) {
            console.error(`[Next.js Proxy] Backend returned error: ${response.status}`)
            return NextResponse.json(
                { error: `Failed to fetch agents: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()

        console.log(`[Next.js Proxy] Fetched ${data.all?.length || 0} agents`)

        return NextResponse.json(data)

    } catch (error) {
        console.error("[Next.js Proxy] Error fetching agents list:", error)

        return NextResponse.json(
            {
                error: "Backend connection failed. Please ensure FastAPI server is running at http://127.0.0.1:8000",
                agents: [],
                tools: [],
                all: [],
            },
            { status: 500 }
        )
    }
}
