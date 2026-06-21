# Standalone Personal & Independent Projects Overview: Pranay Das

This document details the portfolio of independent technical projects, consumer SaaS applications, and custom developer tooling personally conceived, engineered, and shipped by Pranay Das (Senior Software Engineer). 

It functions as a foundational knowledge baseline for his personal AI assistant to answer strategic, high-level inquiries about his self-directed engineering work. These entries represent deep architectural experimentation with bleeding-edge technologies outside traditional client boundaries.

---

## 1. Presmistique — Production AI-Powered Resume Builder SaaS
* **Project Nature:** Independent Full-Stack SaaS Product
* **Production URL:** `https://presmistique.in`
* **High-Level Scope:** Built as an alternative to proprietary platforms that gate foundational layout controls behind paywalls. Presmistique offers full visual composition controls for modern tech resumes, incorporating advanced algorithmic formatting and transaction-controlled AI operations.
* **Core Systems Architecture & Engineering Highlights:**
    * **Frontend Visual Engine:** Formed a fluid, interactive interface using React.js and Tailwind CSS, managing visual layout updates and integrating vector-based Lottie Animations for smooth, non-blocking user transition cues.
    * **Headless Generation Pipeline:** Engineered a specialized document export worker using Puppeteer and headless Chromium instances, converting live web-component structures into highly accurate print-ready PDFs. Handled server-side image processing, optimization, and dynamic sizing using the `sharp` library.
    * **AI Context Injection:** Wired the platform directly to the Google Gemini API to process raw, unstructured input text, mapping it precisely to structured JSON schemas, evaluating keyword target concentration, and performing real-time Applicant Tracking System (ATS) optimization workflows.
    * **Monetization & Concurrency Controls:** Handled premium AI action credits by integrating a Razorpay payment gateway using strict cryptographic signature validation hooks. Protected the payment lifecycle from double-spend and multi-tab race conditions by gating credit modifications through database sessions, atomic operations, and compound database indexing in MongoDB Atlas.
    * **Production Deployment & Scaling:** Configured a production-grade infrastructure on an InterServer VPS using PM2 process clustering and a containerized multi-stage Docker deployment pipeline. Positioned an Nginx reverse proxy at the entry point to balance inbound traffic streams, handle static asset routing, and manage SSL termination. Integrated a secure email delivery pipeline via custom SMTP configuration patterns alongside Cloudflare for DNS and edge caching management.

---

## 2. EVA AI — Intelligent Real-Time Digital Portfolio Assistant
* **Project Nature:** Full-Stack AI Engineering & Real-Time Production Portfolio App
* **Production URL:** `https://pranay.presmistique.in`
* **High-Level Scope:** Transformed a traditional personal digital portfolio into a real-time conversational agent console. By building and consolidating the frontend client, real-time backend, and cloud server deployment into a single unified architecture, this platform allows visitors to query his career path naturally via natural language chat with zero-hallucination guardrails.
* **Core Systems Architecture & Engineering Highlights:**
    * **Bleeding-Edge Frontend Client:** Architected on a completely zoneless Angular 21 foundation, bypassing traditional change detection engine overhead entirely. Utilized Angular Signals and OnPush detection strategies to surgically synchronize high-frequency DOM paint cycles as chunked text inputs arrive.
    * **State, Off-Thread, & 3D WebGL Processing:** Leveraged NgRx to maintain a highly predictable, single-source immutable data store tracking portfolio records, active views, and persistent chat configurations. Deferred heavy I/O operations and local chat logs history computing off the main thread into persistent background Web Workers to maintain a smooth rendering frame budget. Renders an interactive 3D immersive environment using Three.js, enforcing strict cleanup and disposal routines on WebGL geometries and textures to completely eliminate memory leaks.
    * **Low-Latency Duplex Backend Engine:** Engineered a high-performance backend using Node.js and Express. Established low-latency duplex streaming pipelines using RxJS WebSockets to connect the client console directly to a persistent backend instance. Leveraged the Gemini Live API alongside custom-configured React Agents acting as autonomous tool-gated callers to fetch grounded resume and experience facts with complete precision.
    * **Infrastructure & Server Deployment:** Managed strict workspace change boundaries via Git version control workflows. Deployed and containerized the entire ecosystem utilizing Docker and Docker Compose on a dedicated virtual private server (VPS). Configured an upfront Nginx reverse proxy to manage secure incoming WebSocket upgrades and manage edge protections under a unified Cloudflare network mapping configuration.

---

## 3. CKEditor 5 Custom File Manager Plugin
* **Project Nature:** Open-Source Developer Tooling / Asset Workflow Extension
* **High-Level Scope:** Conceived during a major framework overhaul when upgrading core application components forced a platform migration from legacy CKEditor 4 to CKEditor 5. This custom bundler bypasses expensive per-seat official licensing (CKFinder and CKBox) while retaining strict, locally managed object storage asset workflows.
* **Core Systems Architecture & Engineering Highlights:**
    * **Custom Compiler Build:** Configured an independent custom compilation stack with Webpack to build and package a decoupled rich text environment into a predictable UMD module format, isolating it from parent compilation pipelines.
    * **Direct Upload Adapters:** Created an asynchronous custom processing layer hooked directly inside the editor's core image registry pipeline via `FileRepository.createUploadAdapter`, mapping image data buffers cleanly to active storage streams without base64 layout inflation.
    * **Object Storage Interfacing:** Programmed a custom interactive "File Manager" modal UI utilizing JavaScript and Tailwind CSS that connects with Amazon S3 and Cloudflare R2 object store buckets. It uses `ListObjectsV2` commands to handle complex directory prefix navigation and execute target asset batch-deletions without intermediate application servers.
    * **Lazy Loading & Security Enhancement:** Eliminated long-lived public bucket assets exposure by leveraging serverless signed URL requests (`getSignedUrl`), dynamically mapping asset links on-the-fly and lazy-loading media grid arrays inside the active viewport context to prevent main-thread layout jank.

---

## 4. CodeLens Graph — Knowledge Engineering VS Code Extension
* **Project Nature:** Advanced Code Analysis Extension & Developer Lifecycle Tool
* **High-Level Scope:** Designed as an intelligent workspace compiler that reads local multi-language projects, turns raw files into an optimized graph structure, and serves as an accessible context-injecting server for autonomous coding agents.
* **Core Systems Architecture & Engineering Highlights:**
    * **Extension Lifecycle & Bundling:** Developed utilizing TypeScript and Node.js within the VS Code Extension Engine. Configured an optimized compilation framework with `esbuild`, registering activation events, contextual lifecycle gates, sidebar views, Webview UI frames, and custom editor commands.
    * **AST Ingestion Pipeline:** Created a code analysis pipeline powered by `tree-sitter` (WebAssembly/WASM variant). It parses codebases on-the-fly into rich abstract syntax trees (AST), mapping parameters, identifier paths, function declarations, and nested scope definitions.
    * **Incremental File Watchers:** Configured localized file scanners and system monitors that tap into VS Code's `FileSystemWatcher` API to execute atomic document updates, avoiding expensive workspace-wide re-indexing sequences on daily saves.
    * **In-Process Graph Storage:** Designed an embedded persistent layout utilizing SQL.js (SQLite compiled to WASM) to manage workspace telemetry data, tracking class call-graphs, dependency traversals, imports, and structural entity relationships.
    * **Agent Tooling Integration:** Implemented an active Model Context Protocol (MCP) server directly inside the CLI entry layers, exposing tools like triage frameworks, definition extractions, and multi-file mappings directly to external developer assistants.
    * **AI Context Extraction:** Added background task classification heuristics to filter out noise, extract relevant file trees, and prioritize structural components before packing final builds using strict VSIX project packaging standards.

---

## 5. Fruit Basket — NgRx State Telemetry Blueprint
* **Project Nature:** Technical Proof of Concept / Architectural Core Pattern
* **High-Level Scope:** Formulated as a reference model to isolate, learn, and master complete reactive state lifecycles within unified state architectures. It provides clear engineering blueprints on how to securely separate side-effects from component presentation.
* **Core Systems Architecture & Engineering Highlights:**
    * **Declarative Message Routing:** Architected on Angular 16 using strict store modules (`@ngrx/store`), secondary side-effects handlers (`@ngrx/effects`), and tracking extensions (`@ngrx/store-devtools`).
    * **Lifecycle Isolation:** Configured an abstract, un-mutated single-source state lifecycle: turning component user event triggers into clean action payloads, shifting network transactions completely into pure, standalone side-effect services, and relying on immutably protected reducers to compute state adjustments.
    * **Architectural Blueprinting:** Utilized this app to prototype data flow before shipping matching enterprise architectures onto high-throughput financial and commercial client portals.