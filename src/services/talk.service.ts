import { GeminiService } from "./gemini.service";

export class TalkService extends GeminiService {
  responseQueue: any[] = [];
  async waitMessage() {
    let done = false;
    let message = undefined;
    while (!done) {
      message = this.responseQueue.shift();
      if (message) {
        done = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    return message;
  }

  async handleTurn() {
    const turns = [];
    let done = false;
    while (!done) {
      const message = await this.waitMessage();
      turns.push(message);
      if (message.serverContent && message.serverContent.turnComplete) {
        done = true;
      }
    }
    return turns;
  }
  async runPortfolioAgent(
    socketId: string,
    onAudioChunk: (totalResponse: any) => void,
    onStep: (step: string, detail: any) => void,
    onTurnComplete: () => void,
  ) {
    const session = await this.ai.live.connect({
      model: this.model,
      config: this.config,
      callbacks: {
        onopen: () => {
          console.log(`[Gemini Live] Connected for connection ID: ${socketId}`);
          onStep("system", { message: "Connected to Gemini Live." });
        },
        onmessage: async (response: any) => {
          if (response.toolCall?.functionCalls) {
            console.log("graphLeaded has set to", this.graphLoaded);
            for (const call of response.toolCall.functionCalls) {
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

          const content = response.serverContent;
          if (content?.modelTurn?.parts) {
            for (const part of content.modelTurn.parts) {
              if (part.serverContent && part.serverContent.interrupted) {
                // The generation was interrupted
                // If realtime playback is implemented in your application,
                // you should stop playing audio and clear queued playback here.
                this.responseQueue = [];
              }
              if (part.inlineData) {
                const audioData = part.inlineData.data;
                // Process or play audioData (base64 encoded string)
                onAudioChunk(audioData);
              }
            }
          }

          if (
            response.serverContent?.turnComplete ||
            response.serverContent?.generationComplete
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

    if (typeof session.sendClientContent === 'function') {
      await session.sendClientContent({
        turns: [
          {
            role: 'user',
            parts: [
              {
                text: "Hello! I just opened Pranay's portfolio.",
              },
            ],
          },
        ],
        turnComplete: true,
      });
    } else {
      console.warn('[Gemini Live] session.sendClientContent not available; welcome audio cannot be sent.');
    }

    return session;
  }
}
