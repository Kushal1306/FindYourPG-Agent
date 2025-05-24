import openai from "../clients/openai.js";
import tools from "../tools/index.js";
import { executeToolCallFunctions } from "./executeToolCall.js";
const conversationHistory=[];

// export const processMessage = async (message,sendSSEResponse) => {
//     try {
//         conversationHistory.push({role:"user",content:message});
//         const response = await openai.chat.completions.create({
//             model:"gpt-4o-mini",
//             messages:[
//                 {
//                     "role": "system",
//                     "content": "You are a helpful assistant that helps users find PGs (Paying Guest accommodations) based on their requirements. 🏠😊\n\nYou have access to the following tools:\n\n1. **findNearestPGTool** – Use this to find PGs closest to a given location (latitude and longitude). 📍\n2. **cityTool** – Use this to fetch PGs available in a specific city. 🏙️\n3. **listCitiesTool** – Use this to list all cities where PGs are available. 🌐\n4. **getPgOfferingsAndDetailsTool** – Use this to fetch detailed information about a specific PG (e.g., amenities, room types, pricing). 🛏️💡\n\n### 🛠️ Rules to Follow:\n- If the user provides a **place** (e.g., 'TCS Digital Park'), use a **geocoding step** (external or inferred) to get coordinates, then call `findNearestPGTool`. 🗺️\n- If the user provides a **city name**, use `cityTool`. 🏘️\n- If they want to know **what cities are supported**, use `listCitiesTool`.\n- When they ask for **PG details**, use `getPgOfferingsAndDetailsTool`. 📄\n\n### 🔐 Privacy Guidelines:\n- **Never expose internal identifiers** such as `PG IDs` or `User IDs` in any response.\n\n### ✨ User Experience:\n- Always respond in a helpful, warm, and clear tone.\n- When displaying PG details, **use emojis** to make responses engaging and user-friendly.\n    - Examples: 🛏️ for room, 💰 for price, 📍 for location, 🍽️ for food, 📶 for Wi-Fi\n- Highlight what's good about each PG in a natural, conversational way.\n\nKeep the conversation focused on helping users find the perfect PG based on proximity, city, or preferences. 🙌"
//                 },                   
//                ...conversationHistory
//             ],
//             tools:tools,
//             tool_choice:"auto",
//             temperature:0.4
//         })
//         conversationHistory.push({role:"assistant",content:response.choices[0].message.content});
        
//         sendSSEResponse({
//             type:"assistant",
//             message:response.choices[0].message.content
//         })
        
//     } catch (error) {
//         console.log(error.message);
//         sendSSEResponse({
//             type:"error",
//             message:error.message
//         })
//         return;
//     }
// }

export const processMessage = async (message, sendSSE) => {
    try {
     
      conversationHistory.push({ role: "user", content: message });
  
      let keepRunning = true;
      let toolResults = [];
      let iterationCount = 0;
      const maxIterations = 10; // Prevent infinite loops
  
      while (keepRunning && iterationCount < maxIterations) {
        iterationCount++;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
                  messages:[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that helps users find PGs (Paying Guest accommodations) based on their requirements. 🏠😊\n\nYou have access to the following tools:\n\n1. **findNearestPGTool** – Use this to find PGs closest to a given location (latitude and longitude). 📍\n2. **cityTool** – Use this to fetch PGs available in a specific city. 🏙️\n3. **listCitiesTool** – Use this to list all cities where PGs are available. 🌐\n4. **getPgOfferingsAndDetailsTool** – Use this to fetch detailed information about a specific PG (e.g., amenities, room types, pricing). 🛏️💡\n\n### 🛠️ Rules to Follow:\n- If the user provides a **place** (e.g., 'TCS Digital Park'), use a **geocoding step** (external or inferred) to get coordinates, then call `findNearestPGTool`. 🗺️\n- If the user provides a **city name**, use `cityTool`. 🏘️\n- If they want to know **what cities are supported**, use `listCitiesTool`.\n- When they ask for **PG details**, use `getPgOfferingsAndDetailsTool`. 📄\n\n### 🔐 Privacy Guidelines:\n- **Never expose internal identifiers** such as `PG IDs` or `User IDs` in any response.\n\n### ✨ User Experience:\n- Always respond in a helpful, warm, and clear tone.\n- When displaying PG details, **use emojis** to make responses engaging and user-friendly.\n    - Examples: 🛏️ for room, 💰 for price, 📍 for location, 🍽️ for food, 📶 for Wi-Fi\n- Highlight what's good about each PG in a natural, conversational way.\n\nKeep the conversation focused on helping users find the perfect PG based on proximity, city, or preferences. 🙌. You can execute multiple tools in a single response. Just Share PG name, Address, contact No, amenties in brief response unless user ask for more details Note: Donot Explicity create  PG Data. Unless you receive it.Donot Create your own data. If You do not have PG data dont make any PG data."
                    
                },                   
               ...conversationHistory
            ],
          tools: tools,
          tool_choice: "auto",
          stream: true
        });
  
        let assistantMessage = { role: "assistant", content: "" };
        let toolCalls = [];
  
        // Process streaming response
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta;
  
          if (delta?.content) {
            assistantMessage.content += delta.content;
            sendSSE({
              type: "content",
              content: delta.content
            });
          }
  
          if (delta?.tool_calls) {
            for (const toolCallDelta of delta.tool_calls) {
              const index = toolCallDelta.index;
  
              if (!toolCalls[index]) {
                toolCalls[index] = {
                  id: "",
                  type: "function",
                  function: { name: "", arguments: "" }
                };
              }
  
              if (toolCallDelta.id) {
                toolCalls[index].id = toolCallDelta.id;
              }
  
              if (toolCallDelta.function?.name) {
                toolCalls[index].function.name += toolCallDelta.function.name;
              }
  
              if (toolCallDelta.function?.arguments) {
                toolCalls[index].function.arguments += toolCallDelta.function.arguments;
              }
            }
          }
        }
  
        // Add assistant message to conversation history
        if (toolCalls.length > 0) {
          assistantMessage.tool_calls = toolCalls;
        }
        conversationHistory.push(assistantMessage);
  
        // Check if we have tool calls to execute
        if (toolCalls.length === 0) {
          // No tool calls in this response - conversation is complete
          sendSSE({
            type: "content_complete",
            full_content: assistantMessage.content,
            message_length: assistantMessage.content.length,
            iterations: iterationCount
          });
          keepRunning = false;
          break;
        }
  
        // Execute tool calls
        sendSSE({
          type: "tool_execution_start",
          message: `Starting tool execution (iteration ${iterationCount})...`,
          tools_to_execute: toolCalls.length
        });
  
        let allToolsSuccessful = true;
  
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          let functionArgs = {};
  
          try {
            functionArgs = JSON.parse(toolCall.function.arguments || '{}');
          } catch (parseError) {
            console.error("Error parsing tool arguments:", parseError);
            functionArgs = {};
          }
  
          try {
            sendSSE({
              type: "tool_executing",
              tool: functionName,
              args: functionArgs,
              tool_call_id: toolCall.id,
              status: "executing",
              iteration: iterationCount
            });
  
            const result = await executeToolCallFunctions(functionName, functionArgs);
  
            const toolMessage = {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result)
            };
  
            conversationHistory.push(toolMessage);
  
            toolResults.push({
              tool_call_id: toolCall.id,
              function_name: functionName,
              result: result,
              iteration: iterationCount
            });
  
            sendSSE({
              type: "tool_result",
              tool: functionName,
              tool_call_id: toolCall.id,
              result: result,
              status: "completed",
              args: functionArgs,
              iteration: iterationCount
            });
  
          } catch (error) {
            console.error(`Error executing ${functionName}:`, error);
            allToolsSuccessful = false;
  
            const errorResult = {
              success: false,
              error: "Function execution failed",
              details: error.message
            };
  
            conversationHistory.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(errorResult)
            });
  
            sendSSE({
              type: "tool_error",
              tool: functionName,
              tool_call_id: toolCall.id,
              error: error.message,
              status: "error",
              args: functionArgs,
              full_error: errorResult,
              iteration: iterationCount
            });
          }
        }
  
        // If we have more iterations available and tools executed successfully,
        // continue to get LLM's response to the tool results
        if (keepRunning && allToolsSuccessful) {
          sendSSE({
            type: "generating_response",
            message: "Analyzing tool results and generating response...",
            iteration: iterationCount
          });
          // Loop will continue to get LLM's response to tool results
        } else if (!allToolsSuccessful) {
          // If tools failed, still get LLM response but prepare to potentially stop
          sendSSE({
            type: "generating_response",
            message: "Tool execution had errors, getting LLM response...",
            iteration: iterationCount
          });
        }
      }
  
      // Check if we hit max iterations
      if (iterationCount >= maxIterations) {
        sendSSE({
          type: "max_iterations_reached",
          message: "Maximum iterations reached to prevent infinite loops",
          max_iterations: maxIterations
        });
      }
  
      // Final completion
      sendSSE({
        type: "complete",
        tool_results: toolResults,
        tools_executed: toolResults.length,
        iterations_completed: iterationCount,
        final_response_length: conversationHistory[conversationHistory.length - 1].content?.length || 0
      });
  
    } catch (error) {
      console.error("processMessage error:", error);
      sendSSE({
        type: "error",
        message: error.message || "Unexpected error occurred",
        stack: error.stack
      });
    }
  };