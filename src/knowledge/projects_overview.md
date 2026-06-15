# Technical Projects Overview

## 1. Presmistique - AI Resume Builder SaaS
A production-ready full-stack SaaS allowing AI-powered resume parsing, ATS scoring, and optimization workflows using Google Gemini API. Features OAuth2 authentication, a specialized token-based monetization system integrated with Razorpay, automated SMTP notifications, and strict multi-tab session guarantees.
* **Core Stack:** React 19, Node.js 22, MongoDB, Tailwind CSS, Gemini AI, Razorpay, Docker.
* **Deep-Dive Target:** See `project_presmistique_deepdive.md` for payment signature code, atomic token math, template caching, and prompt optimization strategies.

## 2. CKEditor 5 Custom S3/R2 Asset Workflow
A custom-built CKEditor 5 module featuring a proprietary JavaScript asset explorer plugin. Replaces native premium options (CKBox/CKFinder) by wiring the core editor pipeline directly to Cloudflare R2 and AWS S3 storage buckets, eliminating recurring vendor fees.
* **Core Stack:** JavaScript, CKEditor 5, Webpack 5, AWS S3, Cloudflare R2, Tailwind CSS.
* **Deep-Dive Target:** See `project_ckeditor_deepdive.md` for custom asset plugins, Webpack bundling rules, and lazy-loaded presigned image URL mechanics.

## 3. NgRx State Management Reference Sandbox
A dedicated reference architecture constructed to master state-driven data reactivity, deterministic intent propagation, and async isolation within an Angular 16 application.
* **Core Stack:** Angular 16, NgRx (Store, Effects, DevTools), TypeScript, RxJS.
* **Deep-Dive Target:** See `project_ngrx_deepdive.md` for explicit action blueprints, pure reducers, and async effect request mapping rules.
