# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  React Component (story-generator-example.tsx)                    │ │
│  │                                                                   │ │
│  │  • Text Input (prompt)                                            │ │
│  │  • Settings (temperature, max_tokens)                             │ │
│  │  • Generate Button                                                │ │
│  │  • Response Display                                               │ │
│  │                                                                   │ │
│  │  Hook: useAgent("story-generator")                                │ │
│  │    ├─ loading state                                               │ │
│  │    ├─ error handling                                              │ │
│  │    └─ response data                                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    │ POST { prompt, settings }          │
│                                    ▼                                    │
└────────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ HTTP Request
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER (localhost:3000)                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  API Route: /api/tools/[slug]/route.ts                           │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  1. Receive request from frontend                          │ │ │
│  │  │  2. Extract slug (e.g., "story-generator")                 │ │ │
│  │  │  3. Parse request body                                     │ │ │
│  │  │  4. Forward to FastAPI backend                             │ │ │
│  │  │  5. Handle errors                                          │ │ │
│  │  │  6. Return response to frontend                            │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  Features:                                                       │ │
│  │  ✓ CORS handling                                                 │ │
│  │  ✓ Error transformation                                          │ │
│  │  ✓ Security (hides backend URL)                                  │ │
│  │  ✓ Logging                                                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                    │                                   │
│                                    │ Forward request                   │
│                                    ▼                                   │
└───────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ HTTP POST
                                    │ BACKEND_URL/api/v1/agents/story-generator
                                    │
┌───────────────────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND (127.0.0.1:8000)                    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Endpoint: POST /api/v1/agents/{agent-slug}                     │ │
│  │                                                                 │ │
│  │  Request Format:                                                │ │
│  │  {                                                              │ │
│  │    "prompt": "Write a story about...",                          │ │
│  │    "settings": {                                                │ │
│  │      "temperature": 0.7,                                        │ │
│  │      "max_tokens": 1000                                         │ │
│  │    },                                                           │ │
│  │    "user_context": {}                                           │ │
│  │  }                                                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                    │                                  │
│                                    ▼                                  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Agent Processing Logic                                         │ │
│  │                                                                 │ │
│  │  1. Validate request                                            │ │
│  │  2. Initialize AI agent                                         │ │
│  │  3. Process prompt with settings                                │ │
│  │  4. Generate content                                            │ │
│  │  5. Track token usage                                           │ │
│  │  6. Format response                                             │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                    │                                  │
│                                    ▼                                  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Response Format:                                               │ │
│  │  {                                                              │ │
│  │    "status": "success",                                         │ │
│  │    "agent_id": "uuid-1234-5678",                                │ │
│  │    "content": "Once upon a time...",                            │ │
│  │    "usage": {                                                   │ │
│  │      "total_tokens": 150                                        │ │
│  │    }                                                            │ │
│  │  }                                                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                    │                                  │
│                                    │ Return response                  │
└────────────────────────────────────┼──────────────────────────────────┘
                                     │
                                     │ HTTP Response
                                     ▼
                              (Back to Next.js)
                                     │
                                     ▼
                            (Back to React Component)
                                     │
                                     ▼
                              Display to User
```

---

## Data Flow

### 1. **User Input → Frontend**
```
User types: "Write a story about a dragon"
          ↓
useState updates: prompt = "Write a story about a dragon"
          ↓
User clicks: "Generate Story" button
```

### 2. **Frontend → useAgent Hook**
```
useAgent("story-generator").callAgent({
  prompt: "Write a story about a dragon",
  settings: { temperature: 0.7, max_tokens: 1000 }
})
          ↓
Hook sets: loading = true
          ↓
Calls: lib/agent-api.ts → callAgent()
```

### 3. **Agent API → Next.js Proxy**
```
fetch("/api/tools/story-generator", {
  method: "POST",
  body: JSON.stringify({
    prompt: "...",
    settings: {...}
  })
})
          ↓
Next.js receives request at: /api/tools/[slug]/route.ts
```

### 4. **Next.js Proxy → FastAPI**
```
fetch("http://127.0.0.1:8000/api/v1/agents/story-generator", {
  method: "POST",
  body: JSON.stringify({
    prompt: "...",
    settings: {...}
  })
})
          ↓
FastAPI receives and processes request
          ↓
AI generates story
```

### 5. **FastAPI → Next.js Proxy**
```
Response: {
  status: "success",
  content: "Once upon a time, there was a dragon...",
  usage: { total_tokens: 150 }
}
          ↓
Next.js receives response
          ↓
Forwards to frontend
```

### 6. **Response → Frontend Display**
```
useAgent hook receives response
          ↓
Hook sets: loading = false
Hook sets: response = { ... }
          ↓
React re-renders
          ↓
User sees generated story
```

---

## File Dependencies

```
React Component
    └── lib/use-agent.ts (React Hook)
            └── lib/agent-api.ts (API Client)
                    └── /api/tools/[slug]/route.ts (Next.js Proxy)
                            └── FastAPI Backend (External)

Type Definitions
    └── types/agent-api.ts
            ├── AgentRequest
            ├── AgentResponse
            ├── AgentSettings
            └── AgentSlug
```

---

## Directory Structure

```
webtool-plateform/
│
├── app/
│   ├── api/
│   │   └── tools/
│   │       └── [slug]/
│   │           └── route.ts          ← Next.js Proxy API Route
│   ├── demo/
│   │   └── page.tsx                  ← Full demo page
│   └── minimal-demo/
│       └── page.tsx                  ← Minimal demo page
│
├── components/
│   ├── story-generator-example.tsx   ← Example component
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── textarea.tsx
│
├── lib/
│   ├── agent-api.ts                  ← Core API client
│   ├── use-agent.ts                  ← React hook
│   └── utils.ts
│
├── types/
│   └── agent-api.ts                  ← TypeScript types
│
├── .env.local                        ← Environment config (gitignored)
├── INTEGRATION.md                    ← Full documentation
├── QUICKSTART.md                     ← Quick start guide
├── CONFIGURATION.md                  ← Configuration scenarios
├── INTEGRATION_SUMMARY.md            ← Implementation summary
├── test-integration.mjs              ← Integration test script
│
└── package.json
```

---

## Security & Performance

### Security Layers
```
┌─────────────────────────────────────┐
│  1. Client-Side Validation          │
│     • Check prompt not empty        │
│     • Validate settings range       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Next.js Proxy Layer             │
│     • Hide backend URL              │
│     • Could add auth here           │
│     • Rate limiting (optional)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. FastAPI Backend                 │
│     • Request validation            │
│     • Authentication                │
│     • Authorization                 │
│     • Input sanitization            │
└─────────────────────────────────────┘
```

### Error Handling Flow
```
Error occurs anywhere
       ↓
Is it in FastAPI?
  │
  ├─ YES → FastAPI error response
  │            ↓
  │         Next.js forwards error
  │            ↓
  │         Frontend displays error
  │
  └─ NO → Is it in Next.js proxy?
           │
           ├─ YES → Proxy error response
           │            ↓
           │         Frontend displays error
           │
           └─ NO → Network/Frontend error
                        ↓
                     useAgent catches error
                        ↓
                     Frontend displays error
```

---

## Key Benefits of This Architecture

### ✅ Separation of Concerns
- **Frontend**: UI/UX, user interactions
- **Next.js Proxy**: Security, CORS, request forwarding
- **Backend**: AI logic, data processing

### ✅ Security
- Backend URL not exposed to client
- Can add authentication in proxy layer
- Single point for security policies

### ✅ Flexibility
- Easy to swap backend technology
- Can add caching in proxy
- Can implement rate limiting

### ✅ Type Safety
- Full TypeScript support
- Compile-time error checking
- Autocomplete in IDE

### ✅ Developer Experience
- Simple hook API: `useAgent()`
- Automatic state management
- Comprehensive error handling

---

*This architecture follows industry best practices for modern full-stack applications.*
