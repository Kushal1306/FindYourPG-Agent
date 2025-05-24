
"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Terminal, CheckCircle2, AlertCircle, Send, ChevronDown, ChevronUp } from "lucide-react"
import  Badge  from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"



export default function ChatUI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentToolCalls, setCurrentToolCalls] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false) // Moved useState to top level

  // Generate a unique ID for messages
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentToolCalls])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { id: generateId(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsStreaming(true)
    setCurrentToolCalls([])

    try {
      const response = await fetch("http://localhost:3000/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      // const response = await fetch("http://localhost:3000/candidate/chat/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: input }),
      // })

      if (!response.ok) throw new Error("Network response was not ok")

      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let buffer = ""
      const assistantMessageId = generateId()
      let assistantContent = ""
      let toolCalls = []

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split(/\r?\n/)
        buffer = parts.pop() || ""

        for (const line of parts) {
          if (!line.startsWith("data:")) continue
          const jsonStr = line.replace(/^data:\s*/, "")

          try {
            const parsed = JSON.parse(jsonStr)

            switch (parsed.type) {
              case "content":
                assistantContent += parsed.content
                setMessages((prev) => {
                  const existingMessage = prev.find((m) => m.id === assistantMessageId)
                  if (existingMessage) {
                    return prev.map((m) => (m.id === assistantMessageId ? { ...m, content: assistantContent } : m))
                  } else {
                    return [
                      ...prev,
                      {
                        id: assistantMessageId,
                        role: "assistant",
                        content: assistantContent,
                      },
                    ]
                  }
                })
                break

              case "content_complete":
                setMessages((prev) => {
                  return prev.map((m) =>
                    m.id === assistantMessageId ? { ...m, content: parsed.full_content || assistantContent } : m,
                  )
                })
                break

              case "tool_execution_start":
                // Clear any previous tool calls
                setCurrentToolCalls([])
                break

              case "tool_executing":
                const newToolCall = {
                  id: `tool_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                  name: parsed.tool,
                  args: parsed.args,
                  status: "executing",
                }

                toolCalls = [...toolCalls, newToolCall]
                setCurrentToolCalls(toolCalls)
                break

              case "tool_result":
                toolCalls = toolCalls.map((tool) =>
                  tool.name === parsed.tool && tool.status === "executing"
                    ? { ...tool, status: "completed", result: parsed.result }
                    : tool,
                )
                setCurrentToolCalls(toolCalls)
                break

              case "tool_error":
                toolCalls = toolCalls.map((tool) =>
                  tool.name === parsed.tool && tool.status === "executing"
                    ? { ...tool, status: "error", error: parsed.error }
                    : tool,
                )
                setCurrentToolCalls(toolCalls)
                break

              case "generating_response":
                // Keep the current tool calls visible but indicate we're generating a response
                break

              case "complete":
                // Add tool results to the message
                setMessages((prev) => {
                  return prev.map((m) =>
                    m.id === assistantMessageId ? { ...m, toolCalls: toolCalls, toolResults: parsed.tool_results } : m,
                  )
                })

                // Clear current tool calls as they're now part of the message
                setCurrentToolCalls([])
                break

              case "error":
                setMessages((prev) => [...prev, { id: generateId(), role: "error", content: parsed.error }])
                break
            }
          } catch (err) {
            console.error("Error parsing SSE JSON", err)
          }
        }
      }
    } catch (error) {
      console.error("Error streaming:", error)
      setMessages((prev) => [...prev, { id: generateId(), role: "error", content: "Error fetching response." }])
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Render tool call with appropriate styling based on status
  const renderToolCall = (tool) => {
    return (
      <motion.div
        key={tool.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mb-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-4 w-4 text-slate-600" />
          <span className="font-medium text-slate-700">{tool.name}</span>

          {tool.status === "executing" && (
            <Badge
              variant="outline"
              className="ml-auto flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Executing
            </Badge>
          )}
          {tool.status === "completed" && (
            <Badge
              variant="outline"
              className="ml-auto flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
          {tool.status === "error" && (
            <Badge variant="outline" className="ml-auto flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
              <AlertCircle className="h-3 w-3" />
              Error
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="ml-2 p-1 h-6 w-6 rounded-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Only show parameters when expanded */}
        {isExpanded && (
          <div className="text-xs font-mono bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto">
            <div className="mb-1 text-slate-500">Parameters:</div>
            <pre className="text-slate-700">{JSON.stringify(tool.args, null, 2)}</pre>
          </div>
        )}

        {/* Always show results/errors regardless of expanded state */}
        {/* {tool.status === "completed" && tool.result && (
          <div className="mt-2 text-xs font-mono bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto">
            <div className="mb-1 text-slate-500">Result:</div>
            <pre className="text-slate-700">{JSON.stringify(tool.result, null, 2)}</pre>
          </div>
        )} */}

        {tool.status === "error" && tool.error && (
          <div className="mt-2 text-xs font-mono bg-red-50 p-2 rounded border border-red-200 text-red-700 overflow-x-auto">
            <div className="mb-1 text-red-500">Error:</div>
            <pre>{tool.error}</pre>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      <Card className="flex flex-col h-full border-0 rounded-none shadow-none">
        <CardHeader className="border-b bg-white shadow-sm z-10">
          <CardTitle className="flex items-center justify-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-600 text-white">FG</AvatarFallback>
            </Avatar>
            <span>Find Your PG</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
              <Avatar className="h-16 w-16 bg-blue-100">
                <AvatarFallback className="text-blue-600 text-xl">AI</AvatarFallback>
              </Avatar>
              <p className="text-center max-w-md">
                 I can help you find your PG.
                {/* I can help you manage jobs and hiring campaigns. Ask me about creating jobs, managing campaigns, or
                inviting candidates to interviews. */}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar
                  className={cn(
                    "h-8 w-8 flex-shrink-0",
                    msg.role === "user"
                      ? "bg-blue-600"
                      : msg.role === "assistant"
                        ? "bg-white border border-gray-200"
                        : "bg-red-100 border border-red-200",
                  )}
                >
                  <AvatarFallback
                    className={
                      msg.role === "user" ? "text-white" : msg.role === "assistant" ? "text-blue-600" : "text-red-600"
                    }
                  >
                    {msg.role === "user" ? "U" : msg.role === "assistant" ? "AI" : "!"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "p-3 rounded-lg shadow-sm",
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : msg.role === "assistant"
                        ? "bg-white border border-gray-200"
                        : "bg-red-50 text-red-800 border border-red-200",
                  )}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Render tool calls that are part of a message */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Tools executed:</p>
                      {msg.toolCalls.map(renderToolCall)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Render current tool calls that are being processed */}
          {currentToolCalls.length > 0 && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-white border border-gray-200 flex-shrink-0">
                  <AvatarFallback className="text-blue-600">AI</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">Executing tools:</p>
                  <AnimatePresence>{currentToolCalls.map(renderToolCall)}</AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {isStreaming && currentToolCalls.length === 0 && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-white border border-gray-200 flex-shrink-0">
                  <AvatarFallback className="text-blue-600">AI</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t bg-white">
          <div className="flex flex-col w-full space-y-2">
            <Textarea
              ref={textareaRef}
              className="min-h-[80px] max-h-[200px] resize-none p-3 focus-visible:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about PG's NearBy. Specify your location..."
              disabled={isStreaming}
            />
            <Button
              className="self-end gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
            >
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

