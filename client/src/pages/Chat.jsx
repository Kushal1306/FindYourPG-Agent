
// "use client"

// import React from "react"

// import { useState, useRef, useEffect } from "react"
// import ReactMarkdown from "react-markdown"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Loader2, Terminal, CheckCircle2, AlertCircle, Send, ChevronDown, ChevronUp } from "lucide-react"
// import  Badge  from "@/components/ui/badge"
// import { motion, AnimatePresence } from "framer-motion"
// import { cn } from "@/lib/utils"



// export default function ChatUI() {
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState("")
//   const [isStreaming, setIsStreaming] = useState(false)
//   const [currentToolCalls, setCurrentToolCalls] = useState([])
//   const messagesEndRef = useRef(null)
//   const textareaRef = useRef(null)
//   const [isExpanded, setIsExpanded] = useState(false) // Moved useState to top level

//   // Generate a unique ID for messages
//   const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages, currentToolCalls])

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const handleSend = async () => {
//     if (!input.trim()) return

//     const userMessage = { id: generateId(), role: "user", content: input }
//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setIsStreaming(true)
//     setCurrentToolCalls([])

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       })
//       // const response = await fetch("http://localhost:3000/candidate/chat/", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({ message: input }),
//       // })

//       if (!response.ok) throw new Error("Network response was not ok")

//       const reader = response.body.getReader()
//       const decoder = new TextDecoder("utf-8")
//       let buffer = ""
//       const assistantMessageId = generateId()
//       let assistantContent = ""
//       let toolCalls = []

//       while (true) {
//         const { value, done } = await reader.read()
//         if (done) break
//         buffer += decoder.decode(value, { stream: true })

//         const parts = buffer.split(/\r?\n/)
//         buffer = parts.pop() || ""

//         for (const line of parts) {
//           if (!line.startsWith("data:")) continue
//           const jsonStr = line.replace(/^data:\s*/, "")

//           try {
//             const parsed = JSON.parse(jsonStr)

//             switch (parsed.type) {
//               case "content":
//                 assistantContent += parsed.content
//                 setMessages((prev) => {
//                   const existingMessage = prev.find((m) => m.id === assistantMessageId)
//                   if (existingMessage) {
//                     return prev.map((m) => (m.id === assistantMessageId ? { ...m, content: assistantContent } : m))
//                   } else {
//                     return [
//                       ...prev,
//                       {
//                         id: assistantMessageId,
//                         role: "assistant",
//                         content: assistantContent,
//                       },
//                     ]
//                   }
//                 })
//                 break

//               case "content_complete":
//                 setMessages((prev) => {
//                   return prev.map((m) =>
//                     m.id === assistantMessageId ? { ...m, content: parsed.full_content || assistantContent } : m,
//                   )
//                 })
//                 break

//               case "tool_execution_start":
//                 // Clear any previous tool calls
//                 setCurrentToolCalls([])
//                 break

//               case "tool_executing":
//                 const newToolCall = {
//                   id: `tool_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
//                   name: parsed.tool,
//                   args: parsed.args,
//                   status: "executing",
//                 }

//                 toolCalls = [...toolCalls, newToolCall]
//                 setCurrentToolCalls(toolCalls)
//                 break

//               case "tool_result":
//                 toolCalls = toolCalls.map((tool) =>
//                   tool.name === parsed.tool && tool.status === "executing"
//                     ? { ...tool, status: "completed", result: parsed.result }
//                     : tool,
//                 )
//                 setCurrentToolCalls(toolCalls)
//                 break

//               case "tool_error":
//                 toolCalls = toolCalls.map((tool) =>
//                   tool.name === parsed.tool && tool.status === "executing"
//                     ? { ...tool, status: "error", error: parsed.error }
//                     : tool,
//                 )
//                 setCurrentToolCalls(toolCalls)
//                 break

//               case "generating_response":
//                 // Keep the current tool calls visible but indicate we're generating a response
//                 break

//               case "complete":
//                 // Add tool results to the message
//                 setMessages((prev) => {
//                   return prev.map((m) =>
//                     m.id === assistantMessageId ? { ...m, toolCalls: toolCalls, toolResults: parsed.tool_results } : m,
//                   )
//                 })

//                 // Clear current tool calls as they're now part of the message
//                 setCurrentToolCalls([])
//                 break

//               case "error":
//                 setMessages((prev) => [...prev, { id: generateId(), role: "error", content: parsed.error }])
//                 break
//             }
//           } catch (err) {
//             console.error("Error parsing SSE JSON", err)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error streaming:", error)
//       setMessages((prev) => [...prev, { id: generateId(), role: "error", content: "Error fetching response." }])
//     } finally {
//       setIsStreaming(false)
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
//     }
//   }, [input])

//   // Render tool call with appropriate styling based on status
//   const renderToolCall = (tool) => {
//     return (
//       <motion.div
//         key={tool.id}
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0 }}
//         className="mb-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"
//       >
//         <div className="flex items-center gap-2 mb-2">
//           <Terminal className="h-4 w-4 text-slate-600" />
//           <span className="font-medium text-slate-700">{tool.name}</span>

//           {tool.status === "executing" && (
//             <Badge
//               variant="outline"
//               className="ml-auto flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
//             >
//               <Loader2 className="h-3 w-3 animate-spin" />
//               Executing
//             </Badge>
//           )}
//           {tool.status === "completed" && (
//             <Badge
//               variant="outline"
//               className="ml-auto flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
//             >
//               <CheckCircle2 className="h-3 w-3" />
//               Completed
//             </Badge>
//           )}
//           {tool.status === "error" && (
//             <Badge variant="outline" className="ml-auto flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
//               <AlertCircle className="h-3 w-3" />
//               Error
//             </Badge>
//           )}

//           <Button
//             variant="ghost"
//             size="sm"
//             className="ml-2 p-1 h-6 w-6 rounded-full"
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//           </Button>
//         </div>

//         {/* Only show parameters when expanded */}
//         {isExpanded && (
//           <div className="text-xs font-mono bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto">
//             <div className="mb-1 text-slate-500">Parameters:</div>
//             <pre className="text-slate-700">{JSON.stringify(tool.args, null, 2)}</pre>
//           </div>
//         )}

//         {/* Always show results/errors regardless of expanded state */}
//         {/* {tool.status === "completed" && tool.result && (
//           <div className="mt-2 text-xs font-mono bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto">
//             <div className="mb-1 text-slate-500">Result:</div>
//             <pre className="text-slate-700">{JSON.stringify(tool.result, null, 2)}</pre>
//           </div>
//         )} */}

//         {tool.status === "error" && tool.error && (
//           <div className="mt-2 text-xs font-mono bg-red-50 p-2 rounded border border-red-200 text-red-700 overflow-x-auto">
//             <div className="mb-1 text-red-500">Error:</div>
//             <pre>{tool.error}</pre>
//           </div>
//         )}
//       </motion.div>
//     )
//   }

//   return (
//     <div className="flex flex-col h-screen max-h-screen bg-gray-50">
//       <Card className="flex flex-col h-full border-0 rounded-none shadow-none">
//         <CardHeader className="border-b bg-white shadow-sm z-10">
//           <CardTitle className="flex items-center justify-center gap-2">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="/placeholder.svg?height=32&width=32" />
//               <AvatarFallback className="bg-blue-600 text-white">FG</AvatarFallback>
//             </Avatar>
//             <span>Find Your PG</span>
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
//               <Avatar className="h-16 w-16 bg-blue-100">
//                 <AvatarFallback className="text-blue-600 text-xl">AI</AvatarFallback>
//               </Avatar>
//               <p className="text-center max-w-md">
//                  I can help you find your PG.
//                 {/* I can help you manage jobs and hiring campaigns. Ask me about creating jobs, managing campaigns, or
//                 inviting candidates to interviews. */}
//               </p>
//             </div>
//           )}

//           {messages.map((msg) => (
//             <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
//                 <Avatar
//                   className={cn(
//                     "h-8 w-8 flex-shrink-0",
//                     msg.role === "user"
//                       ? "bg-blue-600"
//                       : msg.role === "assistant"
//                         ? "bg-white border border-gray-200"
//                         : "bg-red-100 border border-red-200",
//                   )}
//                 >
//                   <AvatarFallback
//                     className={
//                       msg.role === "user" ? "text-white" : msg.role === "assistant" ? "text-blue-600" : "text-red-600"
//                     }
//                   >
//                     {msg.role === "user" ? "U" : msg.role === "assistant" ? "AI" : "!"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div
//                   className={cn(
//                     "p-3 rounded-lg shadow-sm",
//                     msg.role === "user"
//                       ? "bg-blue-600 text-white"
//                       : msg.role === "assistant"
//                         ? "bg-white border border-gray-200"
//                         : "bg-red-50 text-red-800 border border-red-200",
//                   )}
//                 >
//                   <div className="prose prose-sm max-w-none">
//                     <ReactMarkdown>{msg.content}</ReactMarkdown>
//                   </div>

//                   {/* Render tool calls that are part of a message */}
//                   {msg.toolCalls && msg.toolCalls.length > 0 && (
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <p className="text-xs text-gray-500 mb-2">Tools executed:</p>
//                       {msg.toolCalls.map(renderToolCall)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Render current tool calls that are being processed */}
//           {currentToolCalls.length > 0 && (
//             <div className="flex justify-start">
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8 bg-white border border-gray-200 flex-shrink-0">
//                   <AvatarFallback className="text-blue-600">AI</AvatarFallback>
//                 </Avatar>
//                 <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
//                   <p className="text-sm text-gray-500 mb-2">Executing tools:</p>
//                   <AnimatePresence>{currentToolCalls.map(renderToolCall)}</AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           )}

//           {isStreaming && currentToolCalls.length === 0 && (
//             <div className="flex justify-start">
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8 bg-white border border-gray-200 flex-shrink-0">
//                   <AvatarFallback className="text-blue-600">AI</AvatarFallback>
//                 </Avatar>
//                 <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center space-x-2">
//                   <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                   <span className="text-gray-500 text-sm">Thinking...</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </CardContent>

//         <CardFooter className="p-4 border-t bg-white">
//           <div className="flex flex-col w-full space-y-2">
//             <Textarea
//               ref={textareaRef}
//               className="min-h-[80px] max-h-[200px] resize-none p-3 focus-visible:ring-blue-500"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask about PG's NearBy. Specify your location..."
//               disabled={isStreaming}
//             />
//             <Button
//               className="self-end gap-2 bg-blue-600 hover:bg-blue-700"
//               onClick={handleSend}
//               disabled={isStreaming || !input.trim()}
//             >
//               {isStreaming ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="h-4 w-4" />
//                   Send Message
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


"use client"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import  Badge  from "@/components/ui/badge"
import {
  Loader2,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ChatUI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentToolCalls, setCurrentToolCalls] = useState([])
  const [expandedTools, setExpandedTools] = useState(new Set())
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Generate a unique ID for messages
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentToolCalls])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleToolExpansion = (toolId) => {
    setExpandedTools((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(toolId)) {
        newSet.delete(toolId)
      } else {
        newSet.add(toolId)
      }
      return newSet
    })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { id: generateId(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsStreaming(true)
    setCurrentToolCalls([])

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

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
                break

              case "complete":
                setMessages((prev) => {
                  return prev.map((m) =>
                    m.id === assistantMessageId ? { ...m, toolCalls: toolCalls, toolResults: parsed.tool_results } : m,
                  )
                })
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Render tool call with appropriate styling based on status
  const renderToolCall = (tool) => {
    const isExpanded = expandedTools.has(tool.id)

    return (
      <motion.div
        key={tool.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mb-3 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 bg-slate-200/50 rounded-lg">
                <Terminal className="h-3.5 w-3.5 text-slate-600" />
              </div>
              <span className="font-medium text-slate-800 text-sm truncate">{tool.name}</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {tool.status === "executing" && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Running
                </Badge>
              )}
              {tool.status === "completed" && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2 py-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Done
                </Badge>
              )}
              {tool.status === "error" && (
                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-slate-200/50 rounded-lg"
                onClick={() => toggleToolExpansion(tool.id)}
              >
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-3 bg-slate-100/50 rounded-lg border border-slate-200/50">
                  <div className="text-xs font-medium text-slate-600 mb-2">Parameters:</div>
                  <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(tool.args, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {tool.status === "error" && tool.error && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs font-medium text-red-600 mb-2">Error:</div>
              <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap break-words">{tool.error}</pre>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Card className="flex flex-col h-full border-0 rounded-none shadow-none bg-transparent">
        {/* Header */}
        <CardHeader className="border-b bg-white/80 backdrop-blur-sm shadow-sm z-10 px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="flex items-center justify-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-blue-100">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                  PG
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Find Your PG
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-powered accommodation assistant</p>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-6 px-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative bg-gradient-to-br from-blue-100 to-indigo-100 ring-4 ring-blue-50">
                  <AvatarFallback className="text-blue-600 text-xl sm:text-2xl font-bold">
                    <Sparkles className="h-8 w-8 sm:h-10 sm:w-10" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Welcome to PG Finder!</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  I'm here to help you find the perfect paying guest accommodation. Share your location, budget, and
                  preferences to get started.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  🏠 Location-based search
                </Badge>
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  💰 Budget filtering
                </Badge>
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  ⭐ Ratings
                </Badge>
              </div>
            </motion.div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ring-2",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 ring-blue-100"
                      : msg.role === "assistant"
                        ? "bg-white ring-slate-200"
                        : "bg-red-100 ring-red-200",
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      "text-xs sm:text-sm font-semibold",
                      msg.role === "user" ? "text-white" : msg.role === "assistant" ? "text-blue-600" : "text-red-600",
                    )}
                  >
                    {msg.role === "user" ? "You" : msg.role === "assistant" ? "AI" : "!"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "p-3 sm:p-4 rounded-2xl shadow-sm relative",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : msg.role === "assistant"
                        ? "bg-white border border-slate-200/60 shadow-md"
                        : "bg-red-50 text-red-800 border border-red-200",
                  )}
                >
                  {msg.role === "user" && (
                    <div className="absolute -bottom-1 -right-1 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-700"></div>
                  )}
                  {msg.role === "assistant" && (
                    <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                  )}

                  <div
                    className={cn("prose prose-sm max-w-none", msg.role === "user" ? "prose-invert" : "prose-slate")}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0 text-sm sm:text-base leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => <ul className="mb-2 last:mb-0 text-sm sm:text-base">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 last:mb-0 text-sm sm:text-base">{children}</ol>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Render tool calls that are part of a message */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-slate-500" />
                        <p className="text-xs font-medium text-slate-600">Tools executed:</p>
                      </div>
                      {msg.toolCalls.map(renderToolCall)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Render current tool calls that are being processed */}
          {currentToolCalls.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] lg:max-w-[75%]">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-white ring-2 ring-slate-200 flex-shrink-0">
                  <AvatarFallback className="text-blue-600 text-xs sm:text-sm font-semibold">AI</AvatarFallback>
                </Avatar>
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/60 shadow-md relative">
                  <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-medium text-slate-600">Executing tools:</p>
                  </div>
                  <AnimatePresence>{currentToolCalls.map(renderToolCall)}</AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {isStreaming && currentToolCalls.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex gap-2 sm:gap-3">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-white ring-2 ring-slate-200 flex-shrink-0">
                  <AvatarFallback className="text-blue-600 text-xs sm:text-sm font-semibold">AI</AvatarFallback>
                </Avatar>
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/60 shadow-md flex items-center space-x-3 relative">
                  <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-slate-600 text-sm font-medium">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Footer */}
        <CardFooter className="p-3 sm:p-4 lg:p-6 border-t bg-white/80 backdrop-blur-sm">
          <div className="relative w-full">
            <Textarea
              ref={textareaRef}
              className="min-h-[60px] max-h-[120px] resize-none p-3 sm:p-4 pr-12 sm:pr-14 text-sm sm:text-base rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 bg-white shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about PGs nearby. Specify your location, budget, and preferences..."
              disabled={isStreaming}
            />
            <Button
              size="sm"
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md disabled:opacity-50 transition-all duration-200"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
            >
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
