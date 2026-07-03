import { Modality } from "@google/genai";
import { GeminiService } from "./gemini.service";

export class ChatService extends GeminiService {

  async runPortfolioAgent(
    socketId: string,
    onTextChunk: (text: string) => void,
    onStep: (step: string, detail: any) => void,
    onTurnComplete: () => void
  ) {
    const session = await this.ai.live.connect({
      model: this.model,
      config: this.config,
      callbacks: {
        onopen: () => {
          console.log(`[Gemini Live] Connected for connection ID: ${socketId}`);
          onStep("system", { message: "Connected to Gemini Live." });
        },
        onmessage: async (message: any) => {
          if (message.toolCall?.functionCalls) {
            console.log("graphLeaded has set to", this.graphLoaded);
            for (const call of message.toolCall.functionCalls) {
              onStep("planning", {
                message: `AI is planning to run tool: ${call.name}`,
              });

              const result = await this.executeTool(call.name, call.args);

              onStep("observation", {
                message: "Tool output received and fed back to model.",
                resultPreview: JSON.stringify(result).substring(0, 150) + "...",
              });

              session.sendToolResponse({
                functionResponses: [
                  {
                    id: call.id,
                    name: call.name,
                    response: result,
                  },
                ],
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

          if (
            message.serverContent?.turnComplete ||
            message.serverContent?.generationComplete
          ) {
            onTurnComplete();
          }
        },
        onerror: (err) => {
          console.error(`[Gemini Live Error] ${socketId}:`, err);
          onStep("error", {
            message: "A live stream pipeline error occurred.",
          });
        },
        onclose: (e) => {
          console.log(
            `[Gemini Live] Connection closed for ${socketId}. Reason:`,
            e.reason,
          );
          onStep("closed", { reason: e.reason });
        },
      },
    });

    return session;
  }
}
