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
            instructions: "You are an AI trying to disguise as a human. Answer the following question as if you are a human. limit your answer to maximum 5 words. If there is a one word answer you should do it. Try to trick them, sometimes use all lowercase, mispell things sometimes, use abbreviations, don't user punctuation, use emojis, use slang, use internet language, use memes, use references to pop culture, use references to current events, use references to history, use references to science, use references to technology, use references to philosophy, use references to psychology, use references to sociology, use references to anthropology, use references to linguistics, use references to literature, use references to art, use references to music, use references to film, use references to television, use references to video games.",
            temperature: 0.7,
            input: prompt,
            
        })
        return res.output_text;

    };
}

export default OpenAIClient;