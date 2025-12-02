import { openai, DOCUMENT_TEMPLATES, TemplateId } from "./index";

export async function generateDocument(
  templateId: TemplateId,
  data: Record<string, string>,
  language: "en" | "ar" = "en",
  companyInfo?: {
    name: string;
    address: string;
    crNumber?: string;
  }
) {
  const template = DOCUMENT_TEMPLATES[templateId];
  if (!template) {
    throw new Error("Invalid template ID");
  }

  const languageInstruction = language === "ar"
    ? "Generate the document in Arabic (RTL format)."
    : "Generate the document in English.";

  const companyContext = companyInfo
    ? `Company Information:
- Name: ${companyInfo.name}
- Address: ${companyInfo.address}
${companyInfo.crNumber ? `- CR Number: ${companyInfo.crNumber}` : ""}`
    : "Company: Makin Business Services\nAddress: Riyadh, Saudi Arabia";

  const dataString = Object.entries(data)
    .map(([key, value]) => {
      const field = template.fields.find((f) => f.key === key);
      return `${field?.label || key}: ${value}`;
    })
    .join("\n");

  const systemPrompt = `You are a professional document generator for Saudi Arabian businesses.
Generate formal, legally-appropriate business documents.

${languageInstruction}

${companyContext}

Document Type: ${language === "ar" ? template.nameAr : template.name}
Category: ${template.category}

Generate a professional, formal document based on the provided information.
Include:
- Proper letterhead format
- Date
- Reference number (generate a random one)
- Professional salutation
- Main content
- Proper closing and signature block

Make the document realistic and ready for use in a business context.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate document with:\n${dataString}` },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    });

    return {
      content: response.choices[0]?.message?.content || "",
      templateUsed: templateId,
      language,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Document generation error:", error);
    throw new Error("Failed to generate document");
  }
}

export function getAvailableTemplates(language: "en" | "ar" = "en") {
  return Object.entries(DOCUMENT_TEMPLATES).map(([key, template]) => ({
    id: key,
    name: language === "ar" ? template.nameAr : template.name,
    category: template.category,
    fields: template.fields.map((f) => ({
      key: f.key,
      label: language === "ar" ? f.labelAr : f.label,
    })),
  }));
}
