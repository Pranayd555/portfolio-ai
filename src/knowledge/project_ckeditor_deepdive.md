# Portfolio Project Deep-Dive: CKEditor 5 Custom S3/R2 Asset Workflow

This document provides a highly comprehensive, production-grade technical deep-dive into the custom **CKEditor 5 File Manager and Upload Adapter** plugin developed and open-sourced by Pranay Das. It outlines the business constraints, architectural layout, implementation engineering, and real-world optimizations that allowed an enterprise platform to modernise its rich-text stack while retaining control over its storage costs.

This markdown file acts as an advanced reference block for his personal AI assistant to precisely answer questions regarding rich-text ecosystems, object storage pipelines, and custom asset-management tooling.

---

## 1. Context, Problem Statement, & Constraints

### A. The Dependency Trigger

During a major cross-organizational modernization initiative, the foundational parent platform was upgraded from **Angular 13 to Angular 14**. This upgrade broke backward compatibility with several core dependencies, making a mandatory migration from **CKEditor 4 to CKEditor 5** necessary.

### B. The Storage Disconnect & Hidden Costs

* **Legacy State:** In CKEditor 4, the platform relied on a custom Amazon S3 file-upload pipeline. It was completely decoupled, highly configurable, cost-free (excluding raw bandwidth/storage fees), and fit cleanly with the company's AWS infrastructure.
* **The CKEditor 5 Paradigm Shift:** CKEditor 5 moved away from open-ended upload fields toward proprietary commercial out-of-the-box ecosystems, specifically **CKBox** and **CKFinder**.
* **The Constraints:** While CKBox and CKFinder are excellent products, they presented severe blockers for this ecosystem:
1. **Financial Multipliers:** They introduced commercial, per-seat licensing models that scale up aggressively for platforms with heavy multi-tenant traffic.
2. **Infrastructure Duplication:** They forced a separate, isolated storage cloud runtime onto an engineering stack that already centralized all digital assets directly into raw S3 buckets.



### C. The Engineering Objective

> *"How do we migrate to CKEditor 5 and keep the S3-based asset workflow we already rely on—without introducing CKBox/CKFinder costs and without regressing advanced asset browsing features?"*

---

## 2. System Architecture & Component Mapping

To satisfy these constraints, a custom decoupled compilation structure was designed to build a bespoke UMD asset module wrapper. This decoupled layout ensures that the parent Angular build pipeline does not need to handle internal rich-text webpack operations.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PARENT ANGULAR 21 CONSUMER                                │
│   Imports Built UMD Module ──> Provides API Configuration (Bucket, Delimiter, Paths)   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Passes Runtime Context
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          CUSTOM CKEDITOR 5 BUNDLE (WEBPACK)                            │
│  ┌───────────────────────────────────┐    ┌─────────────────────────────────────────┐  │
│  │   FileRepository Upload Adapter   │    │      S3/R2 File Manager Plugin          │  │
│  │  Intercepts Drag-and-Drop / Pastes │    │  Triggered via Custom Toolbar UI Icon   │  │
│  └─────────────────┬─────────────────┘    └────────────────────┬────────────────────┘  │
└────────────────────┼───────────────────────────────────────────┼───────────────────────┘
                     │ Asynchronous Base64/Buffer Stream          │ Interacts via AWS SDK WASM
                     ▼                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             INFRASTRUCTURE STORAGE EDGE LAYER                          │
│         [ Amazon S3 / Cloudflare R2 ] ◄────────────────────────┘                       │
│         - ListObjectsV2Command (Prefix & Delimiter Isolation Mapping)                  │
│         - DeleteObjectsCommand (Batch Execution command block)                         │
│         - Real-time secure previews served via AWS Signed URLs (`getSignedUrl`)        │
└────────────────────────────────────────────────────────────────────────────────────────┘

```

---

## 3. Implementation Engineering (The "How It Works")

### A. The Core Custom Build Stack

The plugin was decoupled from Angular's native compiler and engineered inside an isolated vanilla environment compiled using a customized **Webpack 5** configuration. It links directly against CKEditor 5's open-source packages (e.g., `@ckeditor/ckeditor5-core`, `@ckeditor/ckeditor5-upload`).

### B. Custom Upload Adapter Injection

When a user pastes an image or drags a file into the rich text interface, the default upload mechanisms are overridden. A custom adapter class targets the editor's native `FileRepository` system:

1. **Instantiation:** The plugin listens for the editor's ready cycle and hooks into `editor.plugins.get('FileRepository')`.
2. **Adapter Mapping:** It overrides the repository's baseline runtime factory with a specialized handler:
```javascript
fileRepository.createUploadAdapter = (loader) => {
    return new S3UploadAdapter(loader, runtimeConfig);
};

```


3. **Stream Resolution:** The `S3UploadAdapter` class implements the standard `upload()` and `abort()` contracts. It intercepts the internal file Promise, converts the file into array buffers or blob streams, and pipes them directly to the specified cloud storage endpoint without bloating the document with massive inline base64 string maps.

### C. The S3/R2 Directory Browser Modal (Bypassing CKFinder)

To let users browse, reuse, and organize assets already present on the cloud, a highly dynamic file manager plugin was integrated directly into the core editor toolbar:

1. **Toolbar Command UI:** Adds a custom visual icon onto the toolbar. Clicking this action fires an internal event that reveals an asynchronous asset management modal built with HTML5, vanilla JavaScript, and Tailwind CSS.
2. **Dynamic Prefix Parsing:** Instead of treating an S3 bucket as a flat unstructured key pool, the plugin simulates a real folder system. It structures navigation by binding runtime paths to the `@aws-sdk/client-s3` command suites:
* **`ListObjectsV2Command`:** Configured with an explicit target `Prefix` (e.g., `uploads/images/`) and a `Delimiter` string (set to `/`).
* **Hierarchical Separation:** The engine separates common return objects: elements inside `CommonPrefixes` map to mock workspace folders (enabling deep double-click directory traversal), while elements under `Contents` parse into interactive grid-mapped files.


3. **Batch Destructive Operations:** Incorporates multi-select features bound to `DeleteObjectsCommand`, passing arrays of unique keys to execute atomic bucket cleanups safely from the editor view.

---

## 4. Performance Tuning & Security Architecture

### A. Non-Blocking Viewport Threading & Signed Previews

* **The Performance Bottleneck:** Loading a directory containing hundreds of massive high-resolution imagery assets can immediately throttle the browser rendering engine, tanking frame rates and locking the user interface thread.
* **The Optimization:**
1. **Lazy Render Bounds:** The file browser modal maps image thumbnails to a light placeholder grid, loading images asynchronously as they enter the visible boundary.
2. **AWS Signed URL Caching (`getSignedUrl`):** To avoid public bucket exposure, assets remain private. The plugin fetches temporary, secure presigned URLs from an edge controller or a serverless cloud companion script. These URLs are generated with short-lived expiration windows, preserving platform security boundaries while speeding up file reuse workflows.



### B. Multi-Cloud Storage Interoperability

The core client layer maps commands down to standard AWS S3 API contracts. This decoupling ensures complete interoperability between:

* **Amazon S3** (Standard high-availability enterprise backend configurations).
* **Cloudflare R2** (Zero egress-fee alternative targets to maximize operational cost efficiency).

---

## 5. Key Architectural Takeaways

1. **Migrations Hide Structural Constraints:** What began as a standard Angular framework update highlighted how a major dependency rewrite (CKEditor 4 to 5) can inadvertently force costly architectural tool rollouts if left unvetted.
2. **Proprietary Software Workarounds:** Building custom plugin boundaries allows companies to avoid expensive software licensing costs while preserving established cloud infrastructure setups.
3. **Bundling Modularity is Maintainability:** Standardizing the rich text build as an isolated UMD package avoids compiler collisions inside complex, high-frequency parent applications like enterprise Angular 21 platforms.