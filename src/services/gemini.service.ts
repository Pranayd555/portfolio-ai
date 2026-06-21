import {
  FunctionDeclaration,
  GoogleGenAI,
  Modality
} from "@google/genai";
import { env } from "../config/env";
import { knowledgeService } from "./knowledge.service";

const SYSTEM_PROMPT = `
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

If a question is unrelated to Pranay Das:

"I'm designed exclusively to discuss Pranay Das, his experience, projects, skills, and professional work. Please ask a relevant question."

Do not answer from your own knowledge.
Do not use world knowledge.
Do not infer.
Do not guess.
Do not fabricate.
Do not provide general assistance.

Use searchKnowledge whenever information is needed.

Tool results are the sole source of truth.
`;


const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

const searchKnowledgeTool: FunctionDeclaration = {
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

const model = "gemini-3.1-flash-live-preview";
const config = {
  responseModalities: [Modality.AUDIO],
  outputAudioTranscription: {},
  systemInstruction: SYSTEM_PROMPT,
  tools: [
    {
      functionDeclarations: [searchKnowledgeTool],
    },
  ],
};

let graphLoaded: boolean = false;

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

export async function searchKnowledge(source: KnowledgeSource, query?: string) {
  const content = await knowledgeService.getContent(source);

  return {
    source,
    content,
  };
}

async function executeTool(name: string, args: any) {
  if (name === 'searchKnowledge') {

    if (args.source === 'knowledge_graph') {
      graphLoaded = true;
      console.log('knowledge graph called')
      return searchKnowledge(args.source);
    }

    if (!graphLoaded) {
      return {
        error:
          'knowledge_graph must be consulted before any other source'
      };
    }

    return searchKnowledge(args.source);
  }

  return {
    error: `Unknown tool ${name}`
  };
  }

export async function runPortfolioAgent(socketId: string,
  onTextChunk: (text: string) => void,
  onStep: (step: string, detail: any) => void,
  onTurnComplete: () => void) {
  const session = await ai.live.connect({
    model,
    config,
    callbacks: {
      onopen: () => {
        console.log(`[Gemini Live] Connected for connection ID: ${socketId}`);
        onStep('system', { message: 'Connected to Gemini Live.' });
      },
      onmessage: async (message: any) => {
        if (message.toolCall?.functionCalls) {
          console.log('graphLeaded has set to', graphLoaded);
          for (const call of message.toolCall.functionCalls) {
            onStep('planning', { message: `AI is planning to run tool: ${call.name}` });

            const result = await executeTool(call.name, call.args);

            onStep('observation', {
              message: 'Tool output received and fed back to model.',
              resultPreview: JSON.stringify(result).substring(0, 150) + '...'
            });

            session.sendToolResponse({
              functionResponses: [{
                id: call.id,
                name: call.name,
                response: result,
              }]
            });
          }
        }

        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.text) {
              onTextChunk(part.text);
            }
          }
        }

        if (message.serverContent?.outputTranscription?.text) {
          onTextChunk(message.serverContent.outputTranscription.text);
        }

        if (message.serverContent?.turnComplete || message.serverContent?.generationComplete) {
          onTurnComplete();
        }
      },
      onerror: (err) => {
        console.error(`[Gemini Live Error] ${socketId}:`, err);
        onStep('error', { message: 'A live stream pipeline error occurred.' });
      },
      onclose: (e) => {
        console.log(`[Gemini Live] Connection closed for ${socketId}. Reason:`, e.reason);
        onStep('closed', { reason: e.reason });
      }
    }
  });

  return session;
}

export function updateGraphLoaded() {
  graphLoaded = false;
}
