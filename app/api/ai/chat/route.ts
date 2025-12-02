import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createChatCompletion } from "@/lib/ai/chat";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = await createChatCompletion(messages, session?.user?.id);

    // Save to chat history if user is logged in
    if (session?.user?.id && sessionId) {
      await db.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          role: "assistant",
          content: response.content,
          metadata: JSON.stringify({ usage: response.usage }),
        },
      });
    }

    return NextResponse.json({
      message: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Fallback response if OpenAI fails
    return NextResponse.json({
      message: "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact Makin Business Services directly for assistance.",
      error: true,
    });
  }
}

// Create new chat session
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { title, initialMessage } = body;

    const chatSession = await db.chatSession.create({
      data: {
        userId: session?.user?.id,
        title: title || "New Chat",
        messages: initialMessage
          ? {
              create: {
                role: "user",
                content: initialMessage,
              },
            }
          : undefined,
      },
      include: { messages: true },
    });

    return NextResponse.json(chatSession, { status: 201 });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    );
  }
}
