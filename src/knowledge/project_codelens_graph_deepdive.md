# Portfolio Project Deep-Dive: CodeLens Graph — Knowledge Engineering & VS Code Extension Architecture

This document provides a comprehensive, production-grade technical deep-dive into **CodeLens Graph**, an advanced code analysis engine, knowledge graph indexer, and developer lifecycle tool engineered by Pranay Das. 

The system maps local multi-language codebases into an optimized graph structure, presenting developer metrics via an embedded graphical layout and exposing lightweight tools for autonomous AI agents via the Model Context Protocol (MCP). This file acts as an advanced reference block for his personal AI assistant to precisely answer engineering questions regarding AST parsing, custom extension lifecycles, and context engineering for AI agent tooling.

---

## 1. Context, Problem Statement, & Core Objectives

### A. The Context Blindspot for AI Agents
As software engineering workflows increasingly integrate LLM-based coding assistants (like Cursor, Copilot, or decoupled custom agents), a fundamental limitation appears: **lack of deep code context**. 
* **The Token Window Problem:** AI assistants are bounded by token constraints. Feeding a complete, massive multi-tenant repository into an active prompt context is impossible or highly cost-inefficient.
* **The Text Search Limitation:** Standard string matching or regex search engines fail to map structural program metrics, such as identifying where an interface is implemented or tracing call hierarchies across disjoint runtime components.

### B. What CodeLens Graph Solves
CodeLens Graph runs inside the localized workspace to eliminate developer blindspots through continuous code telemetry. It parses components on-the-fly, mapping out class call-graphs, definitions, variables, and structural imports into an queryable database. 

By embedding a custom **Model Context Protocol (MCP) server**, it serves as a lightweight context layer—allowing agents to query structure explicitly rather than guessing through text searches.

---

## 2. System Topology & Architectural Data Flow

To deliver high-velocity workspace lookups without locking the main thread of the editor view, CodeLens Graph isolates structural ingestion layers away from representation frames:

```text
               [ ACTIVE VS CODE WORKSPACE DEPLOYMENT ]
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      ▼ (Event-Driven Monitoring)                             ▼ (Command Triggering)
[ VS Code FileWatcher API ]                         [ Webview UI & Sidebar View ]
  - Incremental Document Interception                 - Visual Entity Map Rendering
  - Atomic Symbol Delta Calculations                  - D3.js Graph Data Presentation
      │                                                       │
      ▼                                                       ▼
[ Tree-Sitter WASM Parser ] ─────────────────────────► [ sql.js Graph Database Engine ]
  - AST Slices Extraction Engine                        - Local Persistent Workspace SQL Cache
  - Direct Token Filtering Queries                      - Structural Adjacency Maps Lookup
      │                                                       ▲
      └───────────────────────────┬───────────────────────────┘
                                  │ Exposes Tools Interface
                                  ▼
                [ EMBEDDED ENGINE MCP SERVER CONTEXT ]
  - codelens_triage        - codelens_context        - codelens_callgraph

```

### Architectural Pipeline Components:

1. **The Extension Core / Activator:** Governed inside `src/extension.ts`, managing initialization blocks and activating context registers upon workspace detection.
2. **The Ingestion Engine:** Combines file monitoring pipelines (`src/ingestion/fileWatcher.ts`) and custom Tree-sitter configurations (`src/ingestion/astParser.ts`) to manage code telemetry changes.
3. **The Persistence Node:** Houses an in-process instance of SQLite compiled to WebAssembly (`src/graph/graphDB.ts`), recording entity linkages.
4. **The Interface Layer:** Connects an integrated MCP tool router (`src/mcp/mcpServer.ts`) and webview panels (`src/ui/graphPanel.ts`) for real-time visualization.

---

## 3. Subsystems Implementation Engineering

### A. The Parsing Pipeline (Tree-sitter WASM & AST Analysis)

The extension implements language parsing utilizing **Tree-sitter WebAssembly (WASM) grammars**, bypassing slow text-scanning fallbacks:

* **The AST Extraction Engine:** As files commit to disk, Tree-sitter compiles documents into an explicit **Abstract Syntax Tree (AST)**.
* **Pattern Mapping via Query Files:** The indexer uses specialized Tree-sitter query configurations (`LANG_QUERIES`) to extract key node types, parameter parameters, function names, and scope boundaries.
* **Polymorphic Fallback Engine:** For edge scenarios where a matching WASM grammar is missing, the parsing architecture drops back smoothly onto a multi-threaded regex symbol extractor to maintain continuous mapping telemetry.

### B. Incremental Indexing via FileSystemWatcher

Re-indexing a complete workspace on every save introduces catastrophic processing overhead that can quickly freeze developer hardware. CodeLens Graph solves this via **Incremental Sync Arrays**:

* **Delta Interception:** Leverages the native `vscode.workspace.createFileSystemWatcher` API to target changes explicitly.
* **Atomic Workspace Purges:** When a file mutates, the extension drops only the graph vertices tied to that specific file's absolute path within the database cache (`graphDB.ts`). It then immediately parses the single document, rewriting the updated dependencies without re-indexing adjacent modules.

### C. Persistent Storage: sql.js Graph Modeling

Rather than introducing heavy, decoupled external graph databases (like Neo4j), storage is centralized inside an in-memory, zero-dependency engine:

* **WASM-Powered SQL Engine:** Implements **sql.js**, an optimized build of SQLite compiled directly to WebAssembly.
* **Adjacency Schema Layout:** Maps the workspace using structured entity-relationship paradigms:
* `nodes` Table: Records symbols, classification types (e.g., `Class`, `Interface`, `Method`), signature flags, and file paths.
* `edges` Table: Captures structural relationships using source-to-target links (e.g., `CALLS`, `IMPLEMENTS`, `IMPORTS`).


* **Performance Tuning:** Implements index strategies across target fields to achieve low-latency query results during heavy call-graph traversals.

### D. Model Context Protocol (MCP) Server Integration

The standout feature of CodeLens Graph is its integrated **MCP Server**, which serves as an operational data gatekeeper for connected AI coding agents:

* **Gated Protocols Integration:** Built using `@modelcontextprotocol/sdk` standards, allowing decoupled runtime clients to interact via standard I/O streams.
* **Pre-Formatted Context Toolkits:** The server registers explicit custom capabilities:
* `codelens_triage`: Evaluates workspace health metrics, sorting structural boundaries based on code density and import count.
* `codelens_context`: Supplies targeted symbol definitions and relational blocks safely validated using `zod` parameter schemas.
* `codelens_callgraph`: Traces execution paths backwards and forwards across the codebase, allowing an agent to see exactly which modules are impacted by a planned modification.



---

## 4. How to Use the CodeLens Graph Extension

CodeLens Graph is optimized to function seamlessly as both a visual navigation interface for developers and a contextual routing backend for AI engines.

### A. Core Developer Workspace Workflows

1. **Extension Activation:** Upon opening a project folder, CodeLens Graph activates, indexing repository configurations seamlessly in the background.
2. **Launching the Webview Console:** Run the command `CodeLens Graph: Open Visual Map` via the VS Code command palette (`Cmd/Ctrl + Shift + P`). This reveals an interactive D3.js-powered canvas in a separate webview pane, rendering the code architecture visually.
3. **Sidebar Analytics Monitoring:** Use the sidebar view to check live component code parameters, view file structural counts, track top dependencies, and evaluate system coupling patterns.

### B. Hooking up AI Agents (Claude Desktop, Cursor, Trae, or Standalone Bots)

To connect your coding assistant to the extension's knowledge indexing infrastructure, update your local agent routing config files (e.g., `claude_desktop_config.json`) to map directly to CodeLens Graph's execution pipeline:

```json
{
  "mcpServers": {
    "codelens-graph-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/codelens-graph/dist/mcpEntry.js"],
      "env": {
        "WORKSPACE_ROOT": "/path/to/your/active/project"
      }
    }
  }
}

```

Once connected, your AI coding agent will bypass blind file searches, automatically executing background graph lookups via the protocol to locate exact system structures instantly.

```

```