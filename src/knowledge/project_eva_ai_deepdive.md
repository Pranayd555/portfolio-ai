# Portfolio Project Deep-Dive: EVA AI — Grounded Real-Time AI Portfolio App

This document provides a comprehensive, production-grade technical deep-dive into **EVA AI**, a full-stack, high-performance personal portfolio platform and real-time conversational agent infrastructure engineered and shipped by Pranay Das. 

The system consolidates an immersive frontend portfolio console featuring high-frequency WebGL rendering, an off-threaded state-driven client console, a low-latency duplex streaming backend, and containerized cloud orchestration. This file stands as an advanced reference block for his personal AI assistant to precisely answer questions regarding real-time synchronization, zoneless reactivity graphs, tool-gated AI context injection, and deployment engineering under high performance budgets.

---

## 1. System Topology & Architectural Data Flow

To preserve a fluid 60 FPS visual environment while concurrently processing incoming duplex AI text token bursts, the platform explicitly isolates responsibilities across decoupled operational threads:

```text
                                [ CLIENT VIEWFRONT LAYOUT SHIELDS ]
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼ (Surgical DOM Changes)               ▼ (GPU Matrix Invalidation)            ▼ (I/O Bound Offloading)
 [ Angular 21 (Zoneless) ]            [ Three.js WebGL Engine ]              [ Long-Lived Web Workers ]
 - Native Signals & Core Effects      - Dedicated Particle/Shader Loop       - IndexedDB Stream Caching
 - Predictable NgRx Global Store      - Disposal Cycle Discipline            - Historical Thread Compression
         │                                                                             │
         └──────────────────────────────────────┬──────────────────────────────────────┘
                                                │ RxJS WebSocket Event Pipelines
                                                ▼ (SSL / Secure Proxy Upgrades)
                              [ NGINX REVERSE PROXY GATEWAY ROUTING ]
                                                │
                                                ▼ (Local Process Forwarding)
                               [ NODE.JS & EXPRESS BACKEND HOST ]
                                                │
                                                ├─> [ Gemini Live API ] (Duplex Audio/Text Protocols)
                                                │
                                                └─> [ Tool Caller / Function Gating ]
                                                            │
                                                            ▼ (Zero-Hallucination Sandbox)
                                                    [ Chunked Experience MD Knowledge Base ]

```

### Flat Telemetry Hierarchy:

1. **The Edge Boundary:** Inbound browser visits stream frontend graphics and UI frames. Change detection operations bypass default zone checking entirely, binding UI renders directly to specific reactive nodes.
2. **The Render Buffer Split:** Presentation views stream slow portfolio states via a single-source store, local high-frequency chat buffers use surgical node updates, and heavy JSON serialization routines run inside background threads.
3. **The Duplex Pipeline:** Secure web transactions upgrade automatically into WebSocket protocols at the proxy, streaming binary frames and structured interaction calls continuously.
4. **The Intelligence Guard:** The API server binds session connections directly to AI model endpoints, routing user inquiries through strict system filters and sandboxed local file system context queries before streaming answers back.

---

## 2. Deep Frontend Client Architecture

### A. Bleeding-Edge Reactivity Graph (Angular 21 Zoneless)

* **The Performance Threat:** Traditional Angular relies on a heavy runtime checker (`zone.js`) that intercepts async triggers (WebSockets, timeouts, mouse moves) and scans the entire global DOM tree from top to bottom to execute visual refreshes. In an application displaying an active streaming chat interface while rendering complex WebGL environments, this setup creates massive main-thread layout jank and drops frames.
* **The Implementation Solver:** The portfolio completely strips away `zone.js`, compiling as a fully **Zoneless Angular 21** bundle. Reactivity is entirely driven by explicit **Angular Signals** and components configured with the `OnPush` change detection strategy. Renders execute only when an individual signal's reactive dependency nodes evaluate a change, allowing incoming split-second chat token updates to update text blocks directly without triggering application-wide DOM recalculations.

### B. Prediction and View State (Predictable NgRx Store)

* **Global Portals Tracking:** Structural site statistics, project overview matrices, employment histories, and navigation views are bound inside a global immutable layout slice handled by **NgRx Store**.
* **State Coexistence:** Local presentation changes utilize short-lived component-level state loops, while shared data structures rely on memoized selectors. Templates unpack data bindings exclusively via the asynchronous pipe pattern, enforcing strict garbage-collection cycles on data subscriptions when components are unmounted.

### C. Multi-Threaded State Management (Web Workers & Local Storage)

* **Off-Thread Processing:** Heavy data parsing, historical chat string formatting, and internal chat indexing operations are extracted entirely out of the browser's presentation engine into dedicated **Web Workers**.
* **Persistence Layer:** Background worker threads stream compressed session history payloads directly into an in-browser **IndexedDB** client context. This mechanism safeguards raw user state data continuously across reloads without competing for the main thread's layout and style compute cycles.

### D. Immersive Visualization (Three.js WebGL Particle Loop)

* **The Render Pipeline:** Implements a fully interactive, shader-driven particle system and custom background layer powered by a **Three.js (r183)** rendering environment. The loop interfaces with the browser’s native `requestAnimationFrame` lifecycle to run smooth camera movements.
* **GPU Lifecycle Discipline:** To protect client environments from graphics driver crashes and progressive resource fatigue during long sessions, the system implements a strict object lifecycle model. When the portfolio shifts layouts or minimizes views, all active material attributes, vertex positions, uniforms buffers, and textures execute explicit manual purges down to the graphics pipeline via `.dispose()`.

---

## 3. High-Throughput Real-Time Backend Engine

### A. Node.js & Express Real-Time Core

* **The Stack:** Node.js (v22 Pinned), Express, RxJS WebSocket wrapper layers.
* **The Streaming Architecture:** Eschews standard stateless HTTP request structures for real-time channels. Inbound chat lines tunnel through an RxJS-managed duplex WebSocket server abstraction layer, maintaining low-latency bidirectional socket operations.

### B. Zero-Hallucination AI Grounding (Gemini Live API & Function Callers)

* **The Technical Challenge:** Consumer LLMs are natively prone to hallucinating facts when answering professional history inquiries, often inventing client titles, shifting project histories across companies, or combining distinct technology stacks.
* **The Grounding Solution:** The portfolio backend leverages the **Gemini Live API** backed by structured function-calling schemas.
* **Tool-Gated Retrieval (RAG Framework):** The model is restricted by a strict system prompt and denied access to open-ended training lookups. When a user asks an experience question, the platform triggers automated function calling hooks, executing secure sandboxed local text context retrieval runs against your production-grade `experience.md` and `projects-overview.md` files. The agent receives the explicit facts as a contextual array, compiling a verified answer without improvising milestones.

---

## 4. Cloud Infrastructure & Containerized Deployment

* **Hosting Infrastructure:** Hardened Virtual Private Server (VPS) hosted via InterServer running clean Linux kernel instances.
* **System Packaging & Isolation:** Orchestrated uniformly using a multi-stage **Docker and Docker Compose** delivery framework. The production configuration ensures that chunked text knowledge stores are compiled directly into the container storage block, protecting tool call operations from experiencing path resolution breaks or environment mismatches.
* **Gateway Routing (Nginx Server Constraints):** An **Nginx** server operates directly at the ingress boundary to manage network routing and security:
* Manages **SSL/TLS Termination** using secure certificate verification.
* Intercepts standard upgrade request headers, executing proxy handshakes to convert connections safely into persistent `ws://` WebSocket channels.
* Enforces reverse proxy parameter restrictions (`proxy_read_timeout`, `proxy_send_timeout`) to support long-lived conversational streams.


* **Network Edge Architecture:** Configured and protected via a **Cloudflare** network overlay. Cloudflare maps secure edge entry paths, protects backend server IP endpoints, mitigates malicious automated volumetric scanning vectors, and handles fast regional script mapping optimizations globally.

```

```