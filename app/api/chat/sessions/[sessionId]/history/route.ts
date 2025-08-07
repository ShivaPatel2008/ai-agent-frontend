import { NextRequest, NextResponse } from "next/server";
import type { NextApiResponse } from "next";

// Import type for the context
import type { NextFetchEvent } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-agent-backend-em2x.onrender.com";

export async function GET(
  req: NextRequest,
  context: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = context.params;
    console.log(`Getting chat history for session ${sessionId}`);

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to get chat history:", error);
      return NextResponse.json(
        { error: error.error || "Failed to get chat history" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Chat history retrieved successfully:", data);

    interface ChatMessage {
      role: "user" | "assistant";
      message: string;
      timestamp: string | Date;
    }

    const formattedMessages = data.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.message,
      timestamp: msg.timestamp,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error getting chat history:", error);
    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    );
  }
}
