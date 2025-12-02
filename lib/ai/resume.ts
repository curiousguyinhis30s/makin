import { openai } from "./index";

const RESUME_ENHANCEMENT_PROMPT = `You are a professional resume writer specializing in the Saudi Arabian and GCC job market.

Your task is to enhance the provided resume while:
1. Maintaining factual accuracy - do not add false information
2. Using strong action verbs and quantifiable achievements
3. Optimizing for ATS (Applicant Tracking Systems)
4. Following professional resume best practices
5. Keeping it concise yet impactful
6. Using proper formatting with bullet points
7. Highlighting relevant skills for the target market

Format the output as a well-structured resume with clear sections:
- Professional Summary
- Work Experience (most recent first)
- Education
- Skills
- Certifications (if any)

If the user specifies a target job or industry, tailor the resume accordingly.`;

export async function enhanceResume(
  resumeText: string,
  targetJob?: string,
  language: "en" | "ar" = "en"
) {
  const languageInstruction = language === "ar"
    ? "Write the enhanced resume in Arabic."
    : "Write the enhanced resume in English.";

  const targetInstruction = targetJob
    ? `Target Job/Industry: ${targetJob}`
    : "";

  const messages = [
    {
      role: "system" as const,
      content: `${RESUME_ENHANCEMENT_PROMPT}\n\n${languageInstruction}`,
    },
    {
      role: "user" as const,
      content: `Please enhance the following resume:\n\n${targetInstruction}\n\n${resumeText}`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const enhancedResume = response.choices[0]?.message?.content || "";

    return {
      content: enhancedResume,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Resume enhancement error:", error);
    throw new Error("Failed to enhance resume");
  }
}

export async function parseResumeForSuggestions(resumeText: string) {
  const messages = [
    {
      role: "system" as const,
      content: `You are a career advisor. Analyze the provided resume and give specific, actionable suggestions for improvement. Focus on:
1. Missing sections that should be added
2. Weak phrases that could be strengthened
3. Skills that might be missing based on the experience
4. Formatting improvements
5. ATS optimization tips

Provide the response as a JSON object with the following structure:
{
  "overallScore": number (1-100),
  "suggestions": [
    { "category": "string", "suggestion": "string", "priority": "high" | "medium" | "low" }
  ],
  "missingSkills": ["string"],
  "keyStrengths": ["string"]
}`,
    },
    {
      role: "user" as const,
      content: resumeText,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const analysis = response.choices[0]?.message?.content || "{}";
    return JSON.parse(analysis);
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume");
  }
}
