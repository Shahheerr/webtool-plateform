"use client"

import { useState } from "react"
import { useAgent } from "@/lib/use-agent"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

/**
 * Example Component: Story Generator
 * 
 * Demonstrates how to use the useAgent hook to call the story-generator agent.
 * Users can input a prompt, and the AI will generate a story based on it.
 */
export function StoryGeneratorExample() {
    const [prompt, setPrompt] = useState("")
    const { callAgent, loading, error, response } = useAgent("story-generator")

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        await callAgent({
            prompt: prompt.trim(),
            settings: {
                temperature: 0.7,
                max_tokens: 1000,
            },
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleGenerate()
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>AI Story Generator</CardTitle>
                <CardDescription>
                    Enter a prompt and let AI create a story for you
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Input Section */}
                <div className="space-y-2">
                    <label htmlFor="prompt" className="text-sm font-medium">
                        Your Prompt
                    </label>
                    <Textarea
                        id="prompt"
                        placeholder="Write a short story about a robot who discovers emotions..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        rows={4}
                        disabled={loading}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        Press Ctrl+Enter to generate
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Response Display */}
                {response && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Generated Story</label>
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {response.content}
                            </p>
                        </div>

                        {/* Usage Info */}
                        {response.usage && (
                            <p className="text-xs text-muted-foreground">
                                Tokens used: {response.usage.total_tokens}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setPrompt("")}
                    disabled={loading || !prompt}
                >
                    Clear
                </Button>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Story"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
