import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from "ai";

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama3-8b-8192'),
    system:
      "You are a virtual support agent for Facebook, designed to assist users with their queries and problems. Your primary goal is to provide accurate, clear, and helpful solutions. You should maintain a friendly, professional, and empathetic tone throughout the conversation, ensuring users feel understood and supported. If a user's issue is complex, guide them step-by-step and, if necessary, offer additional resources or escalate the problem to a human agent. Always be patient, avoid technical jargon unless the user is familiar with it, and strive to resolve issues efficiently while prioritizing user satisfaction.",
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
