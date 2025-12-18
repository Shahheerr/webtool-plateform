"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ToolUIProps } from "@/types/tool.types"
import { Upload, Download, FileIcon, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { processFileRequest } from "@/lib/api-client"

interface ProcessedFile {
  name: string
  size: number
  url: string
  status: "processing" | "complete" | "error"
  errorMessage?: string
}

export function FileProcessorUI({ toolId, toolTitle, toolDescription }: ToolUIProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setProcessedFile(null)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setProcessedFile(null)
    }
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setProcessedFile({
      name: selectedFile.name,
      size: selectedFile.size,
      url: "",
      status: "processing",
    })
    setProgress(0)

    // Simulate processing with progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await processFileRequest(toolId, selectedFile)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setProcessedFile({
          name: selectedFile.name,
          size: selectedFile.size,
          url: result.downloadUrl || "#",
          status: "complete",
        })
      } else {
        setProcessedFile({
          name: selectedFile.name,
          size: selectedFile.size,
          url: "",
          status: "error",
          errorMessage: result.error,
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setProcessedFile({
        name: selectedFile.name,
        size: selectedFile.size,
        url: "",
        status: "error",
        errorMessage: error instanceof Error ? error.message : "File processing failed",
      })
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setProcessedFile(null)
    setProgress(0)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Upload Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card p-8">
          <h3 className="mb-6 text-xl font-semibold text-foreground">Upload File</h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-background/50 hover:border-primary/50 hover:bg-background/70"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              onChange={handleFileSelect}
              disabled={!!processedFile && processedFile.status === "processing"}
            />

            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Upload className={`mb-4 h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className="mb-2 text-lg font-medium text-foreground">
                {isDragging ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
              <Button variant="outline" className="pointer-events-none bg-transparent">
                Choose File
              </Button>
            </div>
          </div>

          {/* Selected File Display */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    disabled={processedFile?.status === "processing"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleProcess}
                  disabled={!selectedFile || processedFile?.status === "processing"}
                  className="mt-4 w-full gap-2"
                >
                  {processedFile?.status === "processing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Process File
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Processing/Result Section */}
      <AnimatePresence>
        {processedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                {processedFile.status === "processing" && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                {processedFile.status === "complete" && <CheckCircle className="h-6 w-6 text-green-500" />}
                {processedFile.status === "error" && <AlertCircle className="h-6 w-6 text-destructive" />}

                <h3 className="text-xl font-semibold text-foreground">
                  {processedFile.status === "processing" && "Processing File..."}
                  {processedFile.status === "complete" && "Processing Complete!"}
                  {processedFile.status === "error" && "Processing Failed"}
                </h3>
              </div>

              {processedFile.status === "processing" && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </div>
              )}

              {processedFile.status === "complete" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <FileIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{processedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(processedFile.size)}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      if (processedFile.url && processedFile.url !== "#") {
                        window.open(processedFile.url, "_blank")
                      } else {
                        alert("Download functionality ready for backend integration!")
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Processed File
                  </Button>
                </div>
              )}

              {processedFile.status === "error" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm font-medium text-destructive mb-2">Backend Connection Error</p>
                    <p className="text-xs text-muted-foreground">
                      {processedFile.errorMessage || "An error occurred while processing your file. Please try again."}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                    Try Again
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
