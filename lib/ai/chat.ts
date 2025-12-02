import { openai, SERVICE_CONTEXT } from "./index";
import { db } from "@/lib/db";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function createChatCompletion(
  messages: ChatMessage[],
  userId?: string | null
) {
  // Add system context as first message if not present
  const contextualMessages = [
    { role: "system" as const, content: SERVICE_CONTEXT },
    ...messages,
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: contextualMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content || "";

    return {
      content: assistantMessage,
      usage: response.usage,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response");
  }
}

export async function saveChatSession(
  userId: string | null,
  messages: Array<{ role: string; content: string }>
) {
  const session = await db.chatSession.create({
    data: {
      userId,
      title: messages[0]?.content.slice(0, 50) || "New Chat",
      messages: {
        create: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      },
    },
    include: { messages: true },
  });

  return session;
}

export async function getChatHistory(userId: string, limit = 10) {
  return db.chatSession.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}
