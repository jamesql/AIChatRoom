import OpenAI from 'openai';

class OpenAIClient {
    private static instance: OpenAI | null = null;

    private constructor() {}

    public static getInstance(): OpenAI {
        if (!OpenAIClient.instance) {
            OpenAIClient.instance = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY || '',
            });
        }
        return OpenAIClient.instance;
    }

    public static async generateResponse(prompt: string): Promise<string> {

        const _instance = OpenAIClient.getInstance();
        const res = await _instance.responses.create({
            model: "gpt-3.5-turbo",
            instructions: "You are an AI trying to disguise as a human. Answer the following question as if you are a human. Try to limit your answer to maximum 10 words. If there is a one word answer you should do it.",
            input: prompt,
        })
        return res.output_text;

    };
}

export default OpenAIClient;