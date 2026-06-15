# Deep Dive: CKEditor 5 Custom Asset Workflow Migration

## The Core Objective
Initiated as a requirement during an enterprise platform migration from Angular 13 to Angular 14, where a forced upgrade from CKEditor 4 to 5 broke existing file infrastructure. Rather than rolling out expensive, vendor-locked proprietary media platforms like CKBox or CKFinder, this custom module maintains complete control over company cloud buckets.

## Component Breakdown & Architecture
* **Compilation Separation:** Developed purely in JavaScript using Webpack 5 to export an independent UMD module (`ClassicEditor`). This insulated the core Angular framework from having to parse complicated internal editor build pipelines directly inside its TypeScript configuration.
* **Core Elements:**
  * `src/ckeditor.js`: Controls basic configurations and sets up the toolbars.
  * `src/fileManagerPlugin.js`: Coordinates core cloud parameters and mounts commands.
  * `src/S3BrowseCommand.js`: Mounts modal view spaces, captures UI inputs, and operates the cloud buckets.
  * `src/S3UploadAdapter.js`: Connects directly into the text engine's native upload streams.

## High-Performance Lazy Previews Engine
* **The Problem:** Traditional object exploration pipelines that download complete image data down the pipeline to show thumbnail panels create severe UI lag and excessive network overhead.
* **The Fix:** Configured a dual-phase retrieval cycle using Amazon SDK clients:
  1. **Phase 1 (Key Mapping):** Queries file keys via `ListObjectsV2Command` configured with a strict delimiter (`/`) and a designated folder path prefix. It records basic metadata and checks filenames for image extensions without touching the underlying bytes.
  2. **Phase 2 (Lazy Presigned URLs):** When items enter the browser viewport, the app executes a `GetObjectCommand` mapped through the SDK's `getSignedUrl` method with an expiration limit of 3600 seconds . The browser decodes these transient URLs on demand, offloading memory tracking completely from the application thread.

## System Constraints & Cloud Configuration
* **UX Guardrails:** Hardcoded restriction rules preventing uploads outside standard formats (PNG/JPG/JPEG), implemented pre-flight size checks with built-in compression warnings, and established strict folder asset caps to guarantee bucket predictability.
* **Native Insertion Logic:** Clicking a verified image returns its presigned cloud path and feeds it into the editor's native `insertImage` workflow. For advanced assets like audio, it crafts custom schema model elements that cleanly downcast into valid HTML5 `<audio>` players.
* **CORS Sandbox Rules:** Browser-driven bucket deletions and uploads require definitive CORS validation policies. The architecture establishes local development security clearances through a strict bucket allowance file:json
  [
    {
      "AllowedOrigins": ["http://localhost:8080"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"]
    }
  ]
