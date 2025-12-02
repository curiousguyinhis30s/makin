import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateDocument, getAvailableTemplates } from "@/lib/ai/documents";
import { db } from "@/lib/db";
import { TemplateId } from "@/lib/ai/index";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, data, language = "en", companyInfo } = body;

    if (!templateId || !data) {
      return NextResponse.json(
        { error: "Template ID and data are required" },
        { status: 400 }
      );
    }

    // Generate the document
    const result = await generateDocument(
      templateId as TemplateId,
      data,
      language,
      companyInfo
    );

    // Save to database
    const document = await db.generatedDocument.create({
      data: {
        userId: session.user.id,
        type: templateId.toUpperCase(),
        title: `${templateId.replace(/_/g, " ")} - ${new Date().toLocaleDateString()}`,
        content: result.content,
        language,
        templateUsed: templateId,
        metadata: JSON.stringify({
          inputData: data,
          usage: result.usage,
        }),
      },
    });

    return NextResponse.json({
      content: result.content,
      documentId: document.id,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate document. Please try again." },
      { status: 500 }
    );
  }
}

// Get available templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get("language") as "en" | "ar") || "en";

    const templates = getAvailableTemplates(language);
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
