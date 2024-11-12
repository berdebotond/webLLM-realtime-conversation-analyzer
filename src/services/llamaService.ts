import { Message } from '../types';

const LLAMA_API_URL = 'http://localhost:11434/api/generate';

export const analyzeChatWithLlama = async (messages: Message[]) => {
    const conversation = messages.map(m => 
        `${m.sender}: ${m.content}`
    ).join('\n');

    const prompt = `
        Analyze this customer service agent's responses and provide metrics in valid JSON format.
        Focus only on the agent's behavior and responses, ignoring customer messages.
        Evaluate based on these criteria:
        - Politeness: Use of courteous language and respectful tone
        - Professionalism: Maintaining composure and proper business etiquette
        - Problem Resolution: Effectiveness in addressing the customer's issue
        - Clarity: Clear and concise communication
        - Emotional Intelligence: Understanding and appropriately responding to customer emotions
        - Technical Accuracy: Correctness of technical information provided

        Return ONLY a JSON object with these numeric values (0-100):
        {
            "politeness": number,
            "professionalism": number,
            "problemResolution": number,
            "clarity": number,
            "emotionalIntelligence": number,
            "technicalAccuracy": number,
            "completionScore": number
        }

        Agent responses to analyze:
        ${conversation}
    `;

    try {
        const response = await fetch(LLAMA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:latest",
                prompt,
                stream: false,
                options: {
                    temperature: 0.1, // Lower temperature for more consistent output
                    top_p: 0.9,
                },
                format: 'json'
            })
        });

        const data = await response.json();
        try {
            return JSON.parse(data.response);
        } catch (parseError) {
            console.error('Failed to parse Llama response:', data.response);
            // Return default values if parsing fails
            return {
                politeness: 50,
                professionalism: 50,
                problemResolution: 50,
                clarity: 50,
                emotionalIntelligence: 50,
                technicalAccuracy: 50,
                completionScore: 50
            };
        }
    } catch (error) {
        console.error('Llama API Error:', error);
        return null;
    }
}; 