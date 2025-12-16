"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ToolUIProps } from "@/types/tool.types"
import { Calculator, Loader2, ArrowRight, RotateCcw } from "lucide-react"

export function FormCalculatorUI({ toolId, toolTitle, toolDescription }: ToolUIProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    field1: "",
    field2: "",
    field3: "",
  })
  const [result, setResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalculate = async () => {
    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          data: { fields: formData },
        }),
      })

      const apiResult = await response.json()

      if (apiResult.success) {
        setResult(apiResult.data)
      } else {
        setResult({ error: apiResult.error })
      }
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Calculation failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFormData({ field1: "", field2: "", field3: "" })
    setResult(null)
  }

  const isFormValid = Object.values(formData).some((value) => value.trim() !== "")

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      {/* Input Form Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Input Parameters</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field1" className="text-foreground">
                Input Value 1
              </Label>
              <Input
                id="field1"
                placeholder="Enter value..."
                value={formData.field1}
                onChange={(e) => handleInputChange("field1", e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field2" className="text-foreground">
                Input Value 2
              </Label>
              <Input
                id="field2"
                placeholder="Enter value..."
                value={formData.field2}
                onChange={(e) => handleInputChange("field2", e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field3" className="text-foreground">
                Input Value 3 (Optional)
              </Label>
              <Input
                id="field3"
                placeholder="Enter value..."
                value={formData.field3}
                onChange={(e) => handleInputChange("field3", e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleCalculate} disabled={!isFormValid || isProcessing} className="flex-1 gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Calculate
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Result Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-card p-6">
          <h3 className="mb-6 text-xl font-semibold text-foreground">Result</h3>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[300px] items-center justify-center"
                >
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Calculating...</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  {result.error ? (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                      <p className="text-sm font-medium text-destructive">Error: {result.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-background/50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Calculated Result</h4>
                        <p className="text-2xl font-bold text-foreground">
                          {typeof result.output === "string" ? result.output : JSON.stringify(result, null, 2)}
                        </p>
                      </div>

                      {result.details && (
                        <div className="rounded-lg border border-border bg-background/50 p-4">
                          <h4 className="mb-3 text-sm font-medium text-muted-foreground">Details</h4>
                          <pre className="whitespace-pre-wrap text-xs text-foreground">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[300px] items-center justify-center text-center"
                >
                  <div>
                    <Calculator className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">Enter values and click calculate to see results</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
