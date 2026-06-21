# EVA ROUTING GRAPH & KNOWLEDGE RETRIEVAL MAP

## Purpose & Guardrails
* This file serves as the **master lookahead routing map** for the AI assistant (Eva).
* This file **does not** contain descriptive answers to user questions. It coordinates routing workflows so the agent knows exactly which underlying sources to request based on conversational context.

---

## 1. Production Runtime File Map (TypeScript Configuration)

Eva uses this exact lookup dictionary within her core service tier to translate tool-called enum properties down to physical workspace markdown targets:

```typescript
readonly fileMap: Record<KnowledgeSource, string> = {
    knowledge_graph: 'knowledge_graph.md',
    ckeditor5: 'project_ckeditor_deepdive.md',
    fruit_basket: 'project_fruit_basket_deepdive.md',
    presmistique: 'project_presmistique_deepdive.md',
    projects_overview: 'projects_overview.md',
    eva_ai: 'project_eva_ai_deepdive.md',
    codelens_graph: 'project_codelens_graph_deepdive.md',
    skills: 'skills.md',
    experience: 'experience.md'
}

```

---

## 2. Source Catalog & Contents Manifest

### experience.md

* **Contains:** Explicit corporate employment records (Unified Infotech, ITC Infotech, TCS), client assignments (McGraw Hill, CQFluency, Mondee, Old Mutual, Citi Bank), and professional milestones/awards.

### projects_overview.md

* **Contains:** High-level comprehensive overview index and technical summaries of all standalone personal projects, application lifecycles, and relational maps.

### project_presmistique_deepdive.md

* **Contains:** Deep full-stack architecture of the Resume Builder platform, React 19 visual canvas forms, Puppeteer/Chromium headless PDF worker queues, sharp compression metrics, MongoDB transactions, and Razorpay payment signatures tracking.

### project_ckeditor_deepdive.md

* **Contains:** Custom Webpack compilers build configurations, browser native upload overrides via `FileRepository.createUploadAdapter`, Amazon S3/Cloudflare R2 storage tree traversal, `ListObjectsV2` folder grouping strategies, and presigned access caching patterns.

### project_eva_ai_deepdive.md

* **Contains:** The real-time chat agent architecture, Zoneless Angular 21 Signals rendering paths, background data threading via persistent Web Workers, RxJS WebSocket duplex servers, Three.js performance cleanups, and tool-gated context retrieval pipelines.

### project_codelens_graph_deepdive.md

* **Contains:** Advanced workspace AST analytics engine, TypeScript VS Code extension activation states, tree-sitter AST parsing rules, sql.js embedded storage layouts, incremental workspace change monitors, and the Model Context Protocol (MCP) server tool definitions.

### project_fruit_basket_deepdive.md

* **Contains:** Reference blueprint tracking predictable reactive unidirectional states using `@ngrx/store`, `@ngrx/effects`, and `@ngrx/store-devtools`. Detailed implementations of flattening operators (`switchMap`, `exhaustMap`) to eliminate race-conditions.

### skills.md

* **Contains:** Hard core matrix index profiles of code languages, frontend and backend framework versions, infrastructure providers, and engineering practices.

---

## 3. Token Keyword Knowledge Graph

```text
  [ USER INBOUND PROMPT ]
             │
             ├──► "State Management" ─► Look up enums: fruit_basket, eva_ai, experience
             │                           └──► Target: project_fruit_basket_deepdive.md, project_eva_ai_deepdive.md, experience.md
             │
             ├──► "S3 / R2 Bucket" ───► Look up enums: ckeditor5, presmistique
             │                           └──► Target: project_ckeditor_deepdive.md, project_presmistique_deepdive.md
             │
             └──► "VS Code / MCP" ────► Look up enums: codelens_graph, projects_overview
                                         └──► Target: project_codelens_graph_deepdive.md, projects_overview.md

```

* **Angular / TypeScript / Zoneless / Signals:**
-> `experience` (experience.md)
-> `eva_ai` (project_eva_ai_deepdive.md)
-> `presmistique` (project_presmistique_deepdive.md - reference engine check)
* **RxJS / NgRx State Loops / Immutability:**
-> `fruit_basket` (project_fruit_basket_deepdive.md)
-> `eva_ai` (project_eva_ai_deepdive.md)
-> `experience` (experience.md)
* **Resume Engine / Payments / Transactions / PDF Export:**
-> `presmistique` (project_presmistique_deepdive.md)
-> `projects_overview` (projects_overview.md)
* **Rich-Text Customization / Upload Adapters / Webpack:**
-> `ckeditor5` (project_ckeditor_deepdive.md)
-> `projects_overview` (projects_overview.md)
* **Code Analysis / Tree-sitter AST Parsing / SQLite WASM:**
-> `codelens_graph` (project_codelens_graph_deepdive.md)
-> `projects_overview` (projects_overview.md)
* **Cloud Infrastructure / Docker Clustering / Nginx Reverse Proxy:**
-> `presmistique` (project_presmistique_deepdive.md)
-> `eva_ai` (project_eva_ai_deepdive.md)
* **Performance Tuning / Bundle Reductions / Off-Thread Workers:**
-> `experience` (experience.md)
-> `eva_ai` (project_eva_ai_deepdive.md)
-> `fruit_basket` (project_fruit_basket_deepdive.md)

---

## 4. Cross-Source Cross-Reference Matrix

* **Scenario A: User prompts inquire about state management or reactive data handling:**
* **Read Sequence:** `fruit_basket` ──► `eva_ai` ──► `experience`


* **Scenario B: User prompts inquire about framework updates or platform migrations:**
* **Read Sequence:** `experience` ──► `ckeditor5` ──► `eva_ai`


* **Scenario C: User prompts inquire about personal products architectures or monetization setups:**
* **Read Sequence:** `presmistique` ──► `projects_overview` ──► `eva_ai`


* **Scenario D: User prompts inquire about local code indexing, language tools, or agent tooling protocol:**
* **Read Sequence:** `codelens_graph` ──► `projects_overview`



---

## 5. Deterministic Retrieval Rules

* **Rule 1 (The Pre-Flight Gate):** Eva must read this map file before invoking any contextual tool calls to gauge the full retrieval path.
* **Rule 2 (No Short-Circuiting):** If a user question spans multiple architectural concepts (e.g., "Tell me how you use S3 inside your projects"), Eva must loop over the `fileMap`, extract all matching source files (`project_ckeditor_deepdive.md` AND `project_presmistique_deepdive.md`), and combine the outputs. Never quit after a single file find.
* **Rule 3 (Dual Timeline Grounding):** When an index term exists across both client timelines (`experience`) and standalone setups, read both files to clearly isolate commercial engineering constraints from prototype engineering boundaries.
* **Rule 4 (Strict Zero-Hallucination Bound):** If user criteria fall outside the text boundaries of the compiled file maps, explicitly declare that the information is absent rather than inventing details.

---

## 6. Execution Routing Examples

* **User Intent:** "What awards did Pranay receive at TCS?"
* **Eva Target Routing:** Maps to `experience` ──► Reads `experience.md`


* **User Intent:** "How did you build the real-time websocket layers for your chat portfolio?"
* **Eva Target Routing:** Maps to `eva_ai` ──► Reads `project_eva_ai_deepdive.md`


* **User Intent:** "Explain the abstract tree parsing and SQLite storage inside your VS Code tool."
* **Eva Target Routing:** Maps to `codelens_graph` ──► Reads `project_codelens_graph_deepdive.md`


* **User Intent:** "How do you protect your credit ledger wallet from race condition failures?"
* **Eva Target Routing:** Maps to `presmistique` ──► Reads `project_presmistique_deepdive.md`



```

```