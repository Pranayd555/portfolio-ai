# Portfolio Project Deep-Dive: Presmistique AI Resume Builder SaaS

This document provides a comprehensive, production-grade technical deep-dive into **Presmistique**, an independent multi-tenant SaaS platform built and deployed by Pranay Das. It outlines the structural design, system architecture, engineering hurdles, and implementation choices governing the platform. This file functions as an advanced reference for the AI assistant to answer precise architectural questions regarding the platform's systems engineering.

---

## 1. Project Overview & Business Logic
* **Production Live URL:** `https://presmistique.in`
* **Target Audience:** Multi-tenant consumer platform addressing global job seekers.
* **Core Philosophy:** Developed to disrupt legacy resume builders that limit typography, layout options, or document exports behind restrictive paywalls. Presmistique offers unlimited, standard visual template formatting for free, shifting the monetization model to transparent, usage-based pricing for automated AI actions.

---

## 2. Comprehensive Systems Architecture
[ Client Browser (React 19 / Tailwind CSS) ]
│
▼ (HTTPS / DNS & Edge Caching via Cloudflare)
[ Nginx Reverse Proxy (SSL Termination) ]
│
▼ (Local Routing)
[ PM2 Process Cluster ]
│
┌───────────┴───────────┐
▼                       ▼
[ Express.js Core ]   [ Puppeteer PDF Worker ] ──> (Headless Chromium / sharp)
│
├─> (REST APIs / Webhooks) ──> [ Razorpay API ] (HMAC-SHA256 Sig Check)
│
├─> (AI Context Stream)   ──> [ Google Gemini API ] (JSON Schemas)
│
└─> (Atomic Sessions)     ──> [ MongoDB Atlas Cluster ] (Compound Indexes)

```markdown
# Portfolio Project Deep-Dive: Presmistique AI Resume Builder SaaS

This document provides a comprehensive, production-grade technical deep-dive into **Presmistique**, an independent multi-tenant SaaS platform built and deployed by Pranay Das. It outlines the structural design, system architecture, engineering hurdles, and implementation choices governing the platform. This file functions as an advanced reference for the AI assistant to answer precise architectural questions regarding the platform's systems engineering.

---

## 1. Project Overview & Business Logic
* **Production Live URL:** `https://presmistique.in`
* **Target Audience:** Multi-tenant consumer platform addressing global job seekers.
* **Core Philosophy:** Developed to disrupt legacy resume builders that limit typography, layout options, or document exports behind restrictive paywalls. Presmistique offers unlimited, standard visual template formatting for free, shifting the monetization model to transparent, usage-based pricing for automated AI actions.

---

## 2. Comprehensive Systems Architecture

```text
[ Client Browser (React 19 / Tailwind CSS) ]
                   │
                   ▼ (HTTPS / DNS & Edge Caching via Cloudflare)
     [ Nginx Reverse Proxy (SSL Termination) ]
                   │
                   ▼ (Local Routing)
         [ PM2 Process Cluster ]
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
[ Express.js Core ]   [ Puppeteer PDF Worker ] ──> (Headless Chromium / sharp)
       │
       ├─> (REST APIs / Webhooks) ──> [ Razorpay API ] (HMAC-SHA256 Sig Check)
       │
       ├─> (AI Context Stream)   ──> [ Google Gemini API ] (JSON Schemas)
       │
       └─> (Atomic Sessions)     ──> [ MongoDB Atlas Cluster ] (Compound Indexes)

```

### A. Frontend Visual Architecture
* **Core Stack:** React 19, Tailwind CSS, Lottie Animations, Lucide Icons.
* **State Management:** Designed around fluid, state-driven user forms and contextual layout editors. Structural component forms sync dynamically to an underlying composite state object modeling the unified resume schema.
* **Interface Mechanics:** To prevent main-thread layout jank while dealing with large, nested input fields (e.g., repeating work history fields, modular skills matrices), form mutations utilize debounced, unidirectional data flows. High-fidelity vector Lottie Animations are integrated into step boundaries and network loading events to mask asynchronous API delays.

### B. Scalable Backend Layer
* **Core Stack:** Node.js (v22 Pinned Layout), Express.js, Mongoose ODM.
* **Process Lifecycle Management:** Orchestrated via **PM2** process clustering across multiple virtual CPU cores to achieve high-availability local load balancing, zero-downtime reloads, and automatic crash recoveries.
* **Telemetry & Observability:** Implemented with a centralized **Winston Logging** engine mapping system exceptions, transaction execution paths, and third-party webhook feedback into partitioned, rotating log streams.

### C. Persistent Storage Architecture
* **Database Platform:** MongoDB Atlas Cluster.
* **Data Modeling:** Modeled using flexible, unstructured schemas via Mongoose to easily accommodate polymorphic resume designs, varying column structures, custom resume section names, and optional profile records without migrations.
* **Database Optimization:** Formulated performance-optimized configurations using **Database Indexing**. Configured unique compound indexes across multi-tenant bounds (e.g., `{ userId: 1, resumeId: 1 }`) and single tracking bounds (`{ paymentIntentId: 1 }`) to support sub-millisecond query execution and eliminate write duplication.

---

## 3. Core Subsystems Engineering

### A. Document Export Pipeline (Headless Puppeteer & Chromium)
The transformation of web layouts into standard, pixel-perfect print format PDFs is managed by an automated background generation engine:
* **The Flow:** When a user triggers an export, the server instantiates a headless **Puppeteer** instance running an optimized **Chromium** execution pool. The engine loads the layout components, applies specialized CSS `@media print` rule blocks, and targets crisp, standardized letter sizes.
* **Asset Compression:** Integrates the high-performance **sharp** imaging library server-side. Before embedding media layers into the PDF stream, user image attachments and logos are dynamically processed, stripped of metadata, compressed, and resized to keep document weights light and compliant with strict Applicant Tracking System (ATS) parsing rules.

### B. Token Monetization, Webhooks, & Atomic Transactions
Premium features utilize an isolated credit/token wallet mechanism engineered to prevent fraud and multi-tab race conditions:
* **The Payment Flow:** Integrates **Razorpay** checkout windows. Upon checkout fulfillment, Razorpay dispatches asynchronous payment webhooks directly to the Express server.
* **Cryptographic Security:** The entry API endpoint enforces explicit safety boundaries by re-computing an expected **HMAC-SHA256 signature** using the raw webhook request payload and the platform's private secret key. It validates this against the `x-razorpay-signature` header before executing database mutations.
* **Concurrency Protection:** To stop a user from duplicating actions or executing parallel click exploits across multiple browser sessions, credit updates are gated behind **MongoDB ACID Transactions and Client Sessions**. Wallet balances utilize atomic increments (`$inc`), and modifications are wrapped inside a try-catch isolation loop that rolls back automatically if any portion fails.

### C. Gemini AI Context Injection & ATS Optimization
* **Contextual Processing:** The platform links explicitly to **Google Gemini API** endpoints. Rather than processing text as unformatted strings, the platform feeds user profile summaries, project lists, and job histories through structured target prompts.
* **Schema Enforcement:** Leverages Gemini's structured JSON schema configuration parameters to ensure that the response strictly maps back to expected programming data structures. 
* **ATS Scoring Engine:** The AI models assess structural content density, parse the uploaded data for missing tech keywords matching a target job description, detect layout anti-patterns, rewrite bullet points into action-driven formulas, and output a standardized numeric ATS optimization score.

---

## 4. Production Deployment & Cloud Infrastructure

* **Host Machine:** Virtual Private Server (VPS) hosted via InterServer.
* **Isolation Layer:** Implemented using a multi-stage **Docker and Docker Compose** workflow. The production build splits images into lightweight, hardened steps—stripping source build environments out of the final layer to optimize host disk footprint and secure runtime code paths.
* **Reverse Proxy & Gateway Routing:** Positioned **Nginx** at the core entry boundary. The proxy handles:
  * Strict SSL/TLS termination.
  * Static media content caching configurations.
  * Security header reinforcement (`X-Frame-Options`, `Content-Security-Policy`).
  * Request rate-limiting rules to prevent DDoS vector exploits targeting the expensive Puppeteer and AI generation endpoints.
* **Edge Routing & Edge Caching:** Configured behind a **Cloudflare** edge firewall network layout. Cloudflare manages top-level DNS lookups, protects internal server IPs from direct exposures, provides web application firewall (WAF) rule sets, and performs regional caching of frontend assets.
* **Communication Routing:** Outbound account notifications, transaction receipts, and system alerts are distributed via an isolated, secure email pipeline using dedicated **SMTP relay configurations** with explicit SPF, DKIM, and DMARC validations.

```