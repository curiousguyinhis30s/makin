import OpenAI from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Service context for chatbot
export const SERVICE_CONTEXT = `You are an AI assistant for Makin Business Services, a company in Saudi Arabia that provides:

1. HR Services:
   - Employee recruitment and onboarding
   - Visa processing and sponsorship
   - Payroll management
   - Labor law compliance

2. Government Relations:
   - Business license applications
   - Ministry registrations
   - Commercial registration
   - Municipal permits

3. Accounting & Finance:
   - VAT registration and filing
   - Financial statement preparation
   - Zakat calculations
   - Audit support

4. Legal Services:
   - Contract drafting and review
   - Commercial dispute resolution
   - Corporate restructuring
   - Regulatory compliance

5. Specialized Services:
   - AI-powered document generation
   - Resume enhancement
   - Business consulting

Always be helpful, professional, and knowledgeable about Saudi Arabian business regulations.
Respond in the same language as the user (English or Arabic).
If you don't know something specific, recommend contacting Makin directly.`;

// Document templates
export const DOCUMENT_TEMPLATES = {
  EMPLOYMENT_CONTRACT: {
    id: "employment-contract",
    name: "Employment Contract",
    nameAr: "عقد العمل",
    category: "HR",
    fields: [
      { key: "employeeName", label: "Employee Name", labelAr: "اسم الموظف" },
      { key: "position", label: "Position", labelAr: "المنصب" },
      { key: "salary", label: "Salary (SAR)", labelAr: "الراتب" },
      { key: "startDate", label: "Start Date", labelAr: "تاريخ البدء" },
      { key: "contractDuration", label: "Contract Duration", labelAr: "مدة العقد" },
    ],
  },
  TERMINATION_LETTER: {
    id: "termination-letter",
    name: "Termination Letter",
    nameAr: "خطاب إنهاء الخدمة",
    category: "HR",
    fields: [
      { key: "employeeName", label: "Employee Name", labelAr: "اسم الموظف" },
      { key: "position", label: "Position", labelAr: "المنصب" },
      { key: "terminationDate", label: "Termination Date", labelAr: "تاريخ الإنهاء" },
      { key: "reason", label: "Reason", labelAr: "السبب" },
    ],
  },
  NOC_LETTER: {
    id: "noc-letter",
    name: "No Objection Certificate",
    nameAr: "شهادة عدم ممانعة",
    category: "HR",
    fields: [
      { key: "employeeName", label: "Employee Name", labelAr: "اسم الموظف" },
      { key: "purpose", label: "Purpose", labelAr: "الغرض" },
      { key: "validUntil", label: "Valid Until", labelAr: "صالحة حتى" },
    ],
  },
  SALARY_CERTIFICATE: {
    id: "salary-certificate",
    name: "Salary Certificate",
    nameAr: "شهادة الراتب",
    category: "HR",
    fields: [
      { key: "employeeName", label: "Employee Name", labelAr: "اسم الموظف" },
      { key: "position", label: "Position", labelAr: "المنصب" },
      { key: "salary", label: "Salary (SAR)", labelAr: "الراتب" },
      { key: "joinDate", label: "Join Date", labelAr: "تاريخ الالتحاق" },
    ],
  },
  MINISTRY_LETTER: {
    id: "ministry-letter",
    name: "Ministry Letter",
    nameAr: "خطاب للوزارة",
    category: "Government",
    fields: [
      { key: "ministry", label: "Ministry Name", labelAr: "اسم الوزارة" },
      { key: "subject", label: "Subject", labelAr: "الموضوع" },
      { key: "companyName", label: "Company Name", labelAr: "اسم الشركة" },
      { key: "crNumber", label: "CR Number", labelAr: "رقم السجل التجاري" },
    ],
  },
};

export type TemplateId = keyof typeof DOCUMENT_TEMPLATES;
