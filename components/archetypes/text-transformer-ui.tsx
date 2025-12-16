"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ToolUIProps } from "@/types/tool.types"
import { Copy, Check, Loader2, Sparkles, ArrowRight } from "lucide-react"

export function TextTransformerUI({ toolId, toolTitle, toolDescription }: ToolUIProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) return

    setIsProcessing(true)
    setOutput("")

    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          data: { input },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOutput(result.data.output || JSON.stringify(result.data, null, 2))
      } else {
        setOutput(`Error: ${result.error}`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Processing failed"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card gradient-border h-full p-6">
          <div className="mb-4 flex items-center justify-between">
            <Label htmlFor="input" className="text-lg font-bold text-foreground">
              Input
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!input && !output}
              className="hover:bg-accent/50"
            >
              Clear All
            </Button>
          </div>

          <Textarea
            id="input"
            placeholder={`Enter your text here for ${toolTitle.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] resize-none bg-background/60 backdrop-blur-sm font-mono text-sm leading-relaxed border-border/60 focus:border-primary/50 transition-colors"
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{input.length} characters</span>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleProcess}
                disabled={!input.trim() || isProcessing}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Process
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Output Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-card gradient-border h-full p-6">
          <div className="mb-4 flex items-center justify-between">
            <Label htmlFor="output" className="text-lg font-bold text-foreground">
              Result
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              className="gap-2 hover:bg-accent/50"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="relative min-h-[400px] rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm p-4 shadow-inner">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-center"
                >
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Processing your request...</p>
                  </div>
                </motion.div>
              ) : output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-sm leading-relaxed text-foreground"
                >
                  <pre className="whitespace-pre-wrap break-words">{output}</pre>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-center text-center text-muted-foreground"
                >
                  <div>
                    <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm font-medium">Your result will appear here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {output && !isProcessing && (
            <div className="mt-4">
              <span className="text-sm font-medium text-muted-foreground">{output.length} characters</span>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
