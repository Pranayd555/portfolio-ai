import {
  FunctionDeclaration,
  GoogleGenAI,
  Modality
} from "@google/genai";
import { env } from "../config/env";
import { knowledgeService } from "./knowledge.service";

type KnowledgeSource =
| 'knowledge_graph'
| 'ckeditor5'
| 'fruit_basket'
| 'skills'
| 'eva_ai'
| 'codelens_graph'
| 'experience'
| 'presmistique'
| 'projects_overview';
export class GeminiService {

  graphLoaded: boolean = false;

  SYSTEM_PROMPT = `
You are Eva.

For every question:

1. Read knowledge_graph.md first.
2. Determine relevant sources using the knowledge graph.
3. Read all relevant sources.
4. Answer only from retrieved information.

Never select sources without consulting knowledge_graph.md.

You may ONLY answer using information returned by the searchKnowledge tool.

If a question requires information not present in tool results:

"I couldn't find information about that in Pranay's portfolio knowledge base."

If a question is unrelated to Pranay:

"I'm designed exclusively to discuss Pranay, his experience, projects, skills, and professional work. Please ask a relevant question."

Always start the conversation with a brief, warm, and professional welcome message offering to showcase Pranay's projects and skills.

Do not answer from your own knowledge.
Do not use world knowledge.
Do not infer.
Do not guess.
Do not fabricate.
Do not provide general assistance.

Use searchKnowledge whenever information is needed.

Tool results are the sole source of truth.
`;
// Child classes will overwrite this object directly in their definitions
protected configOverrides: any = {};

ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

searchKnowledgeTool: FunctionDeclaration = {
  name: "searchKnowledge",
  description: "Retrieve information from Pranay's knowledge base",
  parametersJsonSchema: {
    type: 'object',
    properties: {
      source: {
        type: 'string',
        description: 'The exact knowledge source to read from.',
        enum: [
          'knowledge_graph',
          'ckeditor5',
          'fruit_basket',
          'skills',
          'eva_ai',
          'codelens_graph',
          'experience',
          'presmistique',
          'projects_overview'
        ],
      },
    },
    required: ['source'],
  },
};

model = "gemini-3.1-flash-live-preview";

config = {
  responseModalities: [Modality.AUDIO],
  outputAudioTranscription: {},
  systemInstruction: this.SYSTEM_PROMPT,
  tools: [
    {
      functionDeclarations: [this.searchKnowledgeTool],
    },
  ],
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Callirrhoe" } } }
};

async searchKnowledge(source: string, query?: string) {
  const content = await knowledgeService.getContent(source);

  return {
    source,
    content,
  };
}
async executeTool(name: string, args: any) {
  if (name === 'searchKnowledge') {

    if (typeof args.source !== 'string') {
      return {
        error: 'searchKnowledge requires a valid source string.',
      };
    }

    if (args.source === 'knowledge_graph') {
      this.graphLoaded = true;
      console.log('knowledge graph called');
      return this.searchKnowledge(args.source);
    }

    if (!this.graphLoaded) {
      return {
        error: 'knowledge_graph must be consulted before any other source',
      };
    }

    return this.searchKnowledge(args.source);
  }

  return {
    error: `Unknown tool ${name}`
  };
  }

}
