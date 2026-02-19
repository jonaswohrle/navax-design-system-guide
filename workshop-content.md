# Vercel & v0 Workshop

---

## Willkommen zum Vercel & v0 Workshop

In diesem Workshop erfahrt ihr, wie v0 die Art und Weise verändert, wie Software gebaut wird. Wir schauen uns die Vercel-Plattform an, bauen gemeinsam mit v0 und erkunden anhand interaktiver AI Showcases, was mit modernen AI Tools heute möglich ist.

### Was wir heute machen

Drei Blöcke -- von der Plattform über Hands-on mit v0 bis hin zu Inspirationen für eigene Projekte.

1. **Vercel Platform** -- Die Plattform hinter Next.js, Turborepo und dem AI SDK. Open Source Foundation, Framework-Defined Infrastructure, Developer Tools und AI Cloud.
2. **v0 -- AI-Powered Development** *(Hauptteil)* -- v0 verändert, wer Frontend bauen kann. AI Code Generation, Git-native Workflows, Design System Integration und wie aus Prompts Produkte werden.
3. **AI Showcases -- Projektideen** -- Interaktive Demos als Inspiration: Prompt Coach, Image Studio und Content Pipeline. Fertige Patterns für AI SDK, Streaming und Multi-Model Pipelines.

### Warum v0?

v0 ist nicht nur ein Code-Generator -- es verändert grundlegend, wie Teams von der Idee zum fertigen Produkt kommen.

- **Rapid Prototyping** -- Product Manager beschreiben eine Idee in natürlicher Sprache. v0 generiert einen funktionierenden Prototyp in Minuten statt Wochen -- so wie es Okta, eBay und Procore bereits tun.
- **Vibe Coding für Teams** -- Engineering-Teams nutzen v0 als Coding-Accelerator. Boilerplate generieren, Components scaffolden, interne Tools bauen -- wie bei Microsoft (6.000+ Entwickler) und Amazon.
- **Design System Integration** -- v0 kennt eure Design Tokens, Components und Patterns. Jeder generierte Code folgt automatisch eurem Design System -- konsistent, accessible und on-brand.

### Referenzen

v0 wird bereits eingesetzt bei: **OpenAI**, **Microsoft**, **Amazon**, **BCG**, **WPP**

---

## Vercel Platform

*Open source, framework-defined infrastructure, and AI Cloud*

### The Platform Behind Modern Web Development

Vercel is where developers build, ship, and scale the modern web. From open-source frameworks to self-driving infrastructure and a purpose-built AI Cloud, Vercel handles the complexity so teams can focus on creating exceptional user experiences.

**Key Highlights:**
- **v0** -- AI-powered code generation with design system integration
- **Workflows** -- Durable, resumable multi-step agent orchestration
- **AI Gateway** -- Unified routing to OpenAI, Anthropic, Google, Bedrock
- **Edge Network** -- Global CDN with 100+ points of presence

---

### Built on Open Source

Vercel's most impactful tools are free and open-source -- downloaded over 100 million times per week. The open-source foundation ensures no vendor lock-in and a thriving community that shapes the modern web.

| Project | Description | Stars |
|---------|-------------|-------|
| **Next.js** | The React framework for production. Hybrid static and server rendering, TypeScript support, smart bundling, route pre-fetching, file-system routing, and API routes. | 130k+ |
| **Turborepo** | High-performance monorepo build system. Incremental computation, content-aware hashing, parallel execution, and remote caching for teams of any size. | 27k+ |
| **AI SDK** | The TypeScript toolkit for building AI applications. Unified provider API, streaming UI, structured outputs, tool calling, and agent patterns -- framework-agnostic. | 15k+ |
| **Nuxt** | The intuitive Vue framework. Server-side rendering, file-based routing, auto imports, and a rich module ecosystem. Vercel provides first-class deployment support. | 56k+ |
| **SvelteKit** | The Svelte application framework for building fast web apps. Server-side rendering, code splitting, and zero-JS hydration patterns. Natively supported on Vercel. | 19k+ |
| **shadcn/ui** | Beautifully designed, accessible UI components built with Radix UI and Tailwind CSS. Copy-paste into your project -- you own the code. Powers design systems worldwide. | 82k+ |

**Why Open Source Matters:** Every line of code you write with Next.js, Turborepo, or the AI SDK is yours. No proprietary runtime, no lock-in. Deploy anywhere -- Vercel just makes it faster. The community contributes features, finds bugs, and shapes the roadmap.

---

### Framework-Defined Infrastructure

Traditional infrastructure requires manual configuration of servers, CDNs, databases, and scaling policies. Vercel inverts this: your framework defines the infrastructure. Write code, and the platform automatically provisions what you need.

#### Core Infrastructure

- **Edge Network** -- Content is served from the edge location closest to each user. Static assets, serverless functions, and ISR pages are distributed across 100+ points of presence worldwide.
- **Serverless Functions** -- API routes and server components run as serverless functions. Automatic scaling from zero to millions of requests. Pay only for what you use -- no idle servers.
- **Zero-Config Backends** -- Deploy Python (FastAPI, Flask, Django) and TypeScript (Express, Hono) backends with zero configuration. Vercel reads the framework and provisions the right runtime.
- **Enterprise Security** -- SOC 2 Type II compliance, DDoS protection, WAF, and automatic HTTPS. Security headers, CSP policies, and audit logs for enterprise governance.

#### Self-Driving Infrastructure

Beyond "infrastructure as code" -- infrastructure that drives itself. The platform learns from production data to automatically optimize performance, detect issues before they impact users, and recommend code improvements.

- **Express Intent, Not Configuration** -- Tell the platform what you need, not how to set it up. Vercel reads your framework, routes, and data patterns to provision the optimal infrastructure automatically.
- **Automatic Issue Detection** -- Production monitoring that doesn't just alert -- it diagnoses. Vercel AI identifies performance regressions, error patterns, and scaling bottlenecks in real-time.
- **Proactive Optimization** -- Continuously analyzes traffic patterns, resource usage, and response times. Adjusts caching strategies, function regions, and edge rules without manual intervention.
- **AI-Powered Recommendations** -- Vercel Agent surfaces actionable suggestions: unused dependencies, slow database queries, suboptimal image formats, and missing cache headers. Fix with one click.

---

### Developer Tools That Scale

From local development to global production, Vercel provides a seamless developer experience. Every tool is designed to reduce friction and help teams ship faster.

- **Preview Deployments** -- Every Git push gets a unique URL. Share with stakeholders, run E2E tests, and validate changes before they hit production. Integrated with GitHub, GitLab, and Bitbucket.
- **Vercel Toolbar** -- In-page collaboration for your team. Visual feedback, feature flags, draft mode, and performance insights -- all accessible directly in the preview deployment.
- **Observability** -- Full-stack visibility with Vercel Analytics, Speed Insights, and Logs. Track Core Web Vitals (LCP, CLS, INP), real-user metrics, audience insights, and function performance.
- **AI Gateway** -- Unified API for every AI provider. Route requests to OpenAI, Anthropic, Google, or AWS Bedrock through a single endpoint. Built-in rate limiting, cost tracking, and fallback routing.
- **Workflows** -- Durable, resumable workflows that survive restarts. Multi-step orchestration, pause for external events, retry on failure, and long-running agent tasks with built-in observability.
- **Firewall & Protection** -- Built-in web application firewall, bot protection, and rate limiting. Block malicious traffic at the edge before it reaches your application.

---

### The AI Cloud

Vercel AI Cloud is a unified platform for AI workloads. It extends the Frontend Cloud with the infrastructure primitives, SDKs, and security needed to build, deploy, and scale intelligent, agent-powered applications.

#### AI Gateway

A unified API for every AI provider. Route requests to OpenAI, Anthropic, Google, Fireworks, or AWS Bedrock through a single endpoint. Switch models without code changes. Built-in rate limiting, cost tracking, and fallback routing.

```typescript
import { streamText } from "ai"

// No provider package needed
const result = streamText({
  model: "openai/gpt-5.2",     // or
  // model: "anthropic/claude-opus-4.5",
  // model: "google/gemini-2.5-pro",
  prompt: "Explain quantum computing",
})
```

#### Agent Infrastructure

Build and deploy AI agents that can browse the web, call APIs, manage deployments, and interact with users. Vercel provides the runtime, observability, and security for production-grade agents.

- Durable execution for long-running agent tasks
- Built-in tool calling with external API integrations
- Streaming UI for real-time agent feedback
- Secure sandboxed execution environments
- Agent-to-agent communication protocols

#### Additional AI Capabilities

- **AI SDK 6** -- The open-source TypeScript toolkit for AI apps. Unified provider API, streaming responses, structured outputs, tool calling, and multi-step agent patterns.
- **Vercel AI Integrations** -- One-click integrations with Supabase, Neon, Upstash, Stripe, and more. Databases, caching, auth, and payments -- all connected to your AI application.
- **Enterprise AI Governance** -- Model access policies, usage quotas, audit trails, and content filtering. Control which models your team can use and track spending across projects.

#### Why Vercel

- **Open source, not open trap** -- Next.js, Turborepo, AI SDK -- all MIT-licensed. Build with confidence knowing the core tools are community-owned and vendor-neutral.
- **Infrastructure that disappears** -- No Terraform files, no Kubernetes configs, no capacity planning. Your framework defines the infrastructure. Vercel provisions it automatically.
- **AI-native by design** -- AI Gateway, AI SDK, agent infrastructure, and streaming UI. Every primitive you need to build production AI applications, integrated into the platform.
- **From commit to global in seconds** -- Push code, get a preview URL. Merge to main, deploy to 100+ edge locations. Automatic HTTPS, CDN, and serverless scaling. Zero operational overhead.

---

## How v0 Is Changing Who Can Build Frontend

v0 combines AI-powered code generation with Git-native workflows and design system integration, turning everyone from product managers to backend engineers into effective frontend contributors.

---

### What is v0?

v0 is Vercel's AI-powered development environment. It generates production-ready React code from natural language prompts, connected directly to your Git repository and your design system.

- **AI Code Generation** -- Describe what you need in plain language. v0 generates production-ready Next.js components using your design system, shadcn/ui, and Tailwind CSS.
- **Git-Native Workflow** -- Every change v0 makes is committed to a branch in your GitHub repository. Review, approve, and merge through the same PR process your team already uses.
- **Instant Preview Deployments** -- Every commit gets a live preview URL on Vercel's edge network. Share links with stakeholders, test on any device, and iterate in real-time.

---

### Developer Workflows with v0

v0 doesn't replace your Git workflow -- it plugs directly into it. Every AI-generated change follows the same branch-PR-review-merge cycle your team already knows.

#### The v0 Git Flow

1. **Connect Repository** -- Link your GitHub repo to v0. It reads your existing codebase, design tokens, and component library.
2. **Prompt & Generate** -- Describe what you want in natural language. v0 generates code that follows your existing patterns and imports your components.
3. **Review on Branch** -- All changes are pushed to a feature branch. v0 creates clean, reviewable commits with descriptive messages.
4. **Preview & Iterate** -- Each push triggers a Vercel preview deployment. Share the live URL, get feedback, and iterate with more prompts.
5. **Merge & Ship** -- Once approved, merge the PR like any other. The code is yours -- no lock-in, no proprietary runtime.

#### Key Principles

- **Clean Commit History** -- v0 creates atomic commits with clear messages. Your Git history stays readable -- no messy "AI-generated code" dumps.
- **Pull Requests, Not Magic** -- Every change goes through a PR. Your team reviews the code, suggests edits, and merges when ready. The AI assists, humans decide.
- **Codebase-Aware Generation** -- v0 reads your existing components, utilities, and patterns. It imports from your code instead of generating duplicates.
- **No Vendor Lock-In** -- The output is standard React, Next.js, and Tailwind CSS. Eject any time -- the code is yours, runs anywhere.

---

### Design System Integration

v0 doesn't just generate generic code. It reads your design tokens, component library, and brand guidelines, then generates components that are already on-brand.

#### Token-Aware Generation

v0 reads your CSS variables, Tailwind config, and component library. Generated code uses your exact colors, spacing, typography, and border radius -- not generic defaults.

```css
/* Your design tokens */
--primary: 299 57% 30%;    /* NAVAX magenta */
--secondary: 180 100% 22%; /* NAVAX teal */
--radius: 0.5rem;

/* v0 automatically uses these */
className="bg-primary text-primary-foreground rounded-lg"
```

#### Component Reuse

Instead of generating new buttons and cards from scratch, v0 imports from your existing component library. This ensures consistency and reduces code duplication.

```tsx
/* v0 imports YOUR components */
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavaxLogo } from "@/components/ds/navax-logo"

/* Not generic HTML */
<button class="bg-blue-500">  // Never this
```

#### Additional Capabilities

- **Rules & Instructions** -- Set custom rules for v0 to follow: coding conventions, accessibility standards, naming patterns, and brand voice.
- **shadcn/ui Foundation** -- v0 uses shadcn/ui as its component foundation. Extend, customize, and override -- every component is in your codebase.
- **Visual Design Mode** -- v0's Design Mode lets you adjust styling, spacing, and colors with UI controls. Changes update the code and push to your branch.

---

### Everyone Is a Frontend Developer Now

v0 doesn't replace developers -- it expands who can contribute meaningful frontend work. With design system guardrails and Git-based review, non-engineers can ship real UI.

| Role | Before v0 | With v0 |
|------|-----------|---------|
| **Product Managers** | Write specs and wait weeks for a mockup. Struggle to communicate exact UI requirements. | Prompt v0 to generate a working prototype. Iterate in real-time. Share a live preview URL with the team. |
| **Designers** | Hand off static Figma screens. Hope developers interpret spacing, colors, and interactions correctly. | Generate the actual React component from a description. Fine-tune in Design Mode. The code IS the design. |
| **Backend Engineers** | Avoid frontend entirely or write brittle UI code. Get blocked waiting for frontend team availability. | Describe the UI you need in plain language. v0 handles components, styling, responsiveness. Focus on API logic. |
| **Solution Architects** | Draw architecture diagrams. Build PowerPoint slides. Rely on dev teams to visualize the solution. | Generate interactive prototypes and working dashboards. Present with live demos instead of static slides. |
| **Junior Developers** | Spend weeks learning component patterns, CSS specifics, and design system conventions. | Learn by prompting -- see how v0 structures components, applies patterns, and follows conventions. Ramp up in days. |
| **Customer Success** | Request demo customizations weeks before a client call. Work with screenshots and mockups. | Generate customer-branded demo pages on the fly. Show working prototypes in sales calls. |

---

### The Shift in Practice

v0 represents a fundamental change in how frontend work happens -- not replacing the craft, but making it accessible to more people while maintaining quality through design system guardrails.

- **Git is the contract** -- Everything flows through branches and PRs. AI generates, humans review. The same governance model your team already trusts.
- **Design systems are guardrails** -- v0 reads your tokens, imports your components, and follows your conventions. Brand consistency is automatic, not manual.
- **Prompts are the new specs** -- Instead of writing 20-page requirements documents, describe what you need in natural language. Iterate in minutes, not sprints.
- **Code is the deliverable** -- No more Figma-to-code handoff gap. The generated code IS the design. What you see is what ships to production.
