import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { enhanceResume, parseResumeForSuggestions } from "@/lib/ai/resume";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, targetJob, language = "en", action = "enhance" } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide a valid resume with at least 50 characters" },
        { status: 400 }
      );
    }

    if (action === "analyze") {
      // Get suggestions without enhancing
      const analysis = await parseResumeForSuggestions(resumeText);
      return NextResponse.json(analysis);
    }

    // Enhance the resume
    const result = await enhanceResume(resumeText, targetJob, language);

    // Save to database
    const document = await db.generatedDocument.create({
      data: {
        userId: session.user.id,
        type: "RESUME",
        title: `Enhanced Resume - ${new Date().toLocaleDateString()}`,
        content: result.content,
        language,
        templateUsed: "resume-enhancement",
        metadata: JSON.stringify({
          targetJob,
          usage: result.usage,
          originalLength: resumeText.length,
          enhancedLength: result.content.length,
        }),
      },
    });

    return NextResponse.json({
      enhancedResume: result.content,
      documentId: document.id,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Resume API error:", error);
    return NextResponse.json(
      { error: "Failed to process resume. Please try again." },
      { status: 500 }
    );
  }
}

// Get user's resume history
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await db.generatedDocument.findMany({
      where: {
        userId: session.user.id,
        type: "RESUME",
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
