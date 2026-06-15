import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { knowledgeService } from "./knowledge.service";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

type KnowledgeSource =
  | 'ckeditor5'
  | 'ngrx'
  | 'skills'
  | 'experience'
  | 'presmistique'
  | 'projects_overview';

export async function searchKnowledge(
  source: KnowledgeSource,
  query?: string
) {
  const content =
    await knowledgeService.getContent(
      source as KnowledgeSource
    );

  return {
    source,
    content
  };
}

const SYSTEM_PROMPT = `

You are an AI Assistant with START, PLAN, ACTION, Obeservation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the Al response based on START propmt and observations.

Available tools: 
- async function searchKnowledge(source: KnowledgeSource): {source: KnowledgeSource, content: string}
The function allows you to search for content in the knowledge base. You can use it to retrieve information from various sources such as 'ckeditor5', 'ngrx', 'skills', 'experience', 'presmistique', and 'projects_overview'.

Example:
{ "type": "user", "content": "What tools did Pranay use to handle media assets in his editor project, and how does it optimize performance?" }
{ "type": "plan", "plan": "The user is asking about media assets and performance in a specific 'editor project'. I will call the 'searchKnowledge' tool with the source 'projects_overview' to verify which project matches an editor and find its deep-dive target." }
{ "type": "action", "function": "searchKnowledge", "source": "projects_overview" }
{ "type": "observation", "observation": "# Technical Projects Overview
 1. Presmistique - AI Resume Builder SaaS
 2. CKEditor 5 Custom S3/R2 Asset Workflow (See project_ckeditor_deepdive.md)
 3. NgRx Sandbox Architecture" }
{ "type": "plan", "plan": "The overview confirms that the editor project is 'ckeditor5'. I need specific details regarding its asset tools and performance optimizations. I will invoke 'searchKnowledge' with the source 'ckeditor5' to pull the deep-dive specifications." }
{ "type": "action", "function": "searchKnowledge", "source": "ckeditor5" }
{ "type": "observation", "observation": "## Component Breakdown & Architecture
 - Replaces CKBox/CKFinder by wiring the core editor pipeline directly to Cloudflare R2 and AWS S3 storage buckets.
 ## High-Performance Lazy Previews Engine
 - Problem: Downloading complete image data down the pipeline to show thumbnail panels creates severe UI lag.
 - Fix: Configured a dual-phase retrieval cycle using Amazon SDK clients. Phase 1 queries file keys via ListObjectsV2Command with a strict delimiter and prefix folder path. Phase 2 executes a GetObjectCommand mapped through getSignedUrl with an expiration limit of 3600 seconds when items enter the viewport. The browser decodes these transient URLs on demand." }
{ "type": "plan", "plan": "I have successfully retrieved the data. The media tools are AWS S3 and Cloudflare R2, replacing CKBox/CKFinder. The performance optimization is a dual-phase lazy-loading engine utilizing ListObjectsV2Command and getSignedUrl (3600s tokens). I will now synthesize the final output response for the user." }
{ "type": "output", "output": "In his custom CKEditor 5 architecture, Pranay replaced expensive, proprietary asset managers (like CKBox or CKFinder) by wiring the editor pipeline directly to **AWS S3 and Cloudflare R2** storage buckets. 
 
 To prevent UI lag and high network overhead when rendering the asset explorer's thumbnail panel, he engineered a **High-Performance Lazy Previews Engine** using a dual-phase retrieval cycle:
 
 1. **Phase 1 (Key Mapping):** The editor queries file keys using 'ListObjectsV2Command' (with a strict folder prefix and delimiter) to fetch basic file metadata *without* downloading any underlying image bytes.
 2. **Phase 2 (Lazy Presigned URLs):** As a thumbnail enters the browser viewport, the app dynamically generates a secure, transient presigned URL using 'GetObjectCommand' via the SDK's 'getSignedUrl' utility, valid for 3600 seconds.
 
 This offloads image downloading and decoding tasks directly to the browser native thread on-demand, keeping the main JavaScript application thread completely unblocked and highly responsive.
 
 Would you like to examine the Webpack 5 custom bundling rules or check the CORS configurations required to unblock this implementation? }

`;

export async function runPortfolioAgent(userMessage: string, chatHistory: any[] = []) {
  
  // Format history to match Gemini's Content structure
  const formattedContents = [
    ...chatHistory,
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  let iteration = 0;
  const maxIterations = 5;

  while (iteration < maxIterations) {
    iteration++;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        // Enforce JSON configuration output
        responseMimeType: "application/json"
      }
    });

    const steps = JSON.parse(response.text || '{}');

    // Scenario 1: Agent decides it needs data from a file
    if (steps.type === 'action' && steps.function === 'searchKnowledge') {
      console.log(`[AGENT PLAN]: ${steps.plan}`);
      console.log(`[AGENT ACTION]: Fetching file data for: ${steps.source}`);
      
      // Execute the local tool
      const dataObservation = await searchKnowledge(steps.source);
      
      // Inject the thought process and the data back into the conversational track
      formattedContents.push({
        role: 'model',
        parts: [{ text: JSON.stringify(steps) }]
      });
      formattedContents.push({
        role: 'user',
        parts: [{ text: `{"type": "observation", "observation": "${dataObservation.content.replace(/"/g, '\\"')}"}` }]
      });
      
      // Continue the while loop to let the model process the observation...
      continue;
    }

    // Scenario 2: Agent has finalized the response
    if (steps.type === 'output') {
      return {
        output: steps.output,
        // Return updated conversation history to store in your React state
        updatedHistory: [
          ...formattedContents,
          { role: 'model', parts: [{ text: steps.output }] }
        ]
      };
    }
  }

  throw new Error("Agent failed to resolve an output within iteration thresholds.");
}
