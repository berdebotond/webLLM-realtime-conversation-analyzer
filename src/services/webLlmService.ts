import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { HumanMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { Message } from '../types';
import { InitProgressReport } from "@mlc-ai/web-llm";
import { format } from "path";

export class WebLLMService {
    private model: ChatWebLLM | null = null;
    private modelLoadingProgress: { text: string; progress?: number } = { text: '' };
    private onProgressCallback: ((progress: { text: string; progress?: number }) => void) | null = null;

    async initializeModel(modelId: string, onProgress: (progress: { text: string; progress?: number }) => void) {
        this.onProgressCallback = onProgress;
        
        try {
            this.model = new ChatWebLLM({
                model: modelId,
                temperature: 0.7,
            });

            await this.model.initialize((report: InitProgressReport) => {
                this.modelLoadingProgress = {
                    text: `Loading model: ${report.text || ''}`,
                    progress: report.progress ? Number(report.progress) : undefined
                };
                this.onProgressCallback?.(this.modelLoadingProgress);
            });
        } catch (error) {
            console.error('WebLLM initialization error:', error);
            throw error;
        }
    }

    async analyzeChatWithWebLLM(messages: Message[]) {
        if (!this.model) {
            throw new Error('Model not initialized. Please select and load a WebLLM model first.');
        }

        const parser = new JsonOutputParser();

        try {
            const response = await this.model
                .pipe(parser)
                .invoke([new HumanMessage(`You are a JSON generator. Output ONLY valid JSON.

                {
                    "politeness": 0,
                    "professionalism": 0,
                    "problemResolution": 0,
                    "clarity": 0,
                    "emotionalIntelligence": 0,
                    "technicalAccuracy": 0,
                    "completionScore": 0
                }

                Above is the EXACT format you must use. Replace zeros with scores from 0-100.
                Analyze this conversation and output ONLY a JSON object:

                ${messages.map(m => `${m.sender}: ${m.content}`).join('\n')}`)]);

            // Validate the response has all required fields
            const requiredFields = ['politeness', 'professionalism', 'problemResolution', 
                'clarity', 'emotionalIntelligence', 'technicalAccuracy', 'completionScore'];
            
            if (!response || typeof response !== 'object' || 
                !requiredFields.every(field => typeof response[field] === 'number')) {
                throw new Error('Invalid response format from model');
            }

            return response;
        } catch (error) {
            console.error('WebLLM analysis error:', error);
            throw error;
        }
    }

    isInitialized() {
        return this.model !== null;
    }
}

export const webLLMService = new WebLLMService();