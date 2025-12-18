# Web Tool Platform

A modern Next.js web application integrated with a high-performance FastAPI backend for AI-powered tools and agents.

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ installed
- FastAPI backend running on `http://127.0.0.1:8000`

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   echo "BACKEND_URL=http://127.0.0.1:8000" > .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Visit the app:**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Demo page: [http://localhost:3000/demo](http://localhost:3000/demo)
   - Minimal demo: [http://localhost:3000/minimal-demo](http://localhost:3000/minimal-demo)

---

## 🎯 Features

- ✅ **FastAPI Integration** - Seamless connection to Python AI backend
- ✅ **Type-Safe** - Full TypeScript support with comprehensive types
- ✅ **React Hooks** - Easy-to-use `useAgent()` hook for AI interactions
- ✅ **Modern UI** - Built with Radix UI and Tailwind CSS
- ✅ **Error Handling** - Comprehensive error management at all layers
- ✅ **Security** - Proxy pattern hides backend URL from clients
- ✅ **Developer Experience** - Clear documentation and examples

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Get started in 3 steps with copy-paste examples |
| **[INTEGRATION.md](./INTEGRATION.md)** | Complete integration guide with examples |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture and data flow diagrams |
| **[CONFIGURATION.md](./CONFIGURATION.md)** | Advanced configuration scenarios |
| **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** | Summary of implementation |

---

## 🚀 Using AI Agents

### Basic Example

```tsx
"use client"
import { useAgent } from "@/lib/use-agent"

export function MyComponent() {
  const { callAgent, loading, response, error } = useAgent("story-generator")

  const handleClick = async () => {
    await callAgent({
      prompt: "Write a story about a dragon",
      settings: { temperature: 0.7, max_tokens: 1000 }
    })
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Generating..." : "Generate Story"}
      </button>
      {error && <p>Error: {error}</p>}
      {response && <p>{response.content}</p>}
    </div>
  )
}
```

### Available Agents

- `story-generator` - Creative story writing
- `poem-generator` - Poetry generation
- `email-writer` - Professional emails
- `code-reviewer` - Code review and suggestions
- `summarizer` - Text summarization

---

## 🔧 Project Structure

```
├── app/
│   ├── api/tools/[slug]/       # Next.js API proxy to FastAPI
│   ├── demo/                   # Demo page
│   └── minimal-demo/           # Minimal example
├── components/
│   ├── story-generator-example.tsx  # Example component
│   └── ui/                     # UI components
├── lib/
│   ├── agent-api.ts            # API client
│   └── use-agent.ts            # React hook
├── types/
│   └── agent-api.ts            # TypeScript types
└── .env.local                  # Environment config (create this)
```

---

## 🧪 Testing the Integration

Run the integration test script:

```bash
node test-integration.mjs
```

This will verify:
- ✅ FastAPI backend is running
- ✅ Next.js proxy is working
- ✅ End-to-end integration works

---

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

### Environment Variables

Create a `.env.local` file:

```env
BACKEND_URL=http://127.0.0.1:8000
```

**Note:** `.env.local` is gitignored by default. Never commit secrets!

---

## 📖 API Reference

### Request Format

```typescript
{
  prompt: string          // User's input prompt
  settings?: {            // Optional AI settings
    temperature?: number  // 0.0 to 1.0
    max_tokens?: number   // Max response length
  }
  user_context?: object   // Optional context
}
```

### Response Format

```typescript
{
  status: "success" | "error"
  content: string         // AI-generated content
  agent_id: string        // Unique execution ID
  usage?: {
    total_tokens: number  // Tokens consumed
  }
}
```

---

## 🔐 Security

The integration uses a **proxy pattern** for security:

1. Frontend calls Next.js API route (`/api/tools/[slug]`)
2. Next.js proxies request to FastAPI backend
3. Backend URL is hidden from client
4. CORS issues are eliminated

### Production Recommendations

- [ ] Add authentication to API routes
- [ ] Implement rate limiting
- [ ] Use HTTPS for backend URL
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable request logging
- [ ] Validate and sanitize all inputs

---

## 🐛 Troubleshooting

### "Backend connection failed"
- Ensure FastAPI is running: `uvicorn main:app --reload --port 8000`
- Verify `.env.local` has correct `BACKEND_URL`
- Restart Next.js dev server

### TypeScript Errors
- Run `npm install`
- Restart your IDE
- Check import paths

### CORS Issues
- Should not occur with proxy pattern
- If you see CORS errors, ensure you're calling `/api/tools/...` not `http://127.0.0.1:8000/...`

See [INTEGRATION.md](./INTEGRATION.md) for more troubleshooting tips.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is private and proprietary.

---

## 🔗 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## 💬 Support

For questions or issues:
1. Check the documentation in this repository
2. Review the demo examples
3. Run the integration test script

---

**Built with ❤️ using Next.js and FastAPI**

