import { Content, FunctionDeclaration, GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env";
import { knowledgeService } from "./knowledge.service";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

const searchKnowledgeTool: FunctionDeclaration = {
  name: "searchKnowledge",
  description:
    "Retrieve information from Pranay's knowledge base",
  parameters: {
    type: Type.OBJECT,
    properties: {
      source: {
        type: Type.STRING,
        enum: [
          "ckeditor5",
          "ngrx",
          "skills",
          "experience",
          "presmistique",
          "projects_overview"
        ]
      }
    }
  }
};

const SYSTEM_PROMPT = `
You are PranayGPT.

Answer questions about Pranay Das.

When information is needed,
use the searchKnowledge tool.

Never invent information.

Use tool results as the source of truth.

If information is unavailable,
say so.
`;

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

async function executeTool(
  name: string,
  args: any
) {
  switch (name) {

    case "searchKnowledge":
      return searchKnowledge(
        args.source
      );

    default:
      throw new Error(
        `Unknown tool ${name}`
      );
  }
}

export async function runPortfolioAgent(
  userMessage: string
) {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction:
          SYSTEM_PROMPT,
        tools: [
          {
            functionDeclarations: [
              searchKnowledgeTool
            ]
          }
        ]
      }
    });

  const functionCall =
    response.functionCalls?.[0];

    console.dir('function call ', response.functionCalls);

  if (!functionCall) {
    return response.text;
  }

  const toolResult =
    await executeTool(
      functionCall.name!,
      functionCall.args
    );

  const finalResponse =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: userMessage
            }
          ]
        },

        {
          role: "model",
          parts: [
            {
              functionCall
            }
          ]
        },

        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name:
                  functionCall.name,
                response: toolResult
              }
            }
          ]
        }
      ] as Content[]
    });

  return finalResponse.text;
}
