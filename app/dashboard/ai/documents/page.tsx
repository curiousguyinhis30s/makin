"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Bot,
  FileText,
  Download,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Building2,
  User,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Template {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  fields: Array<{
    key: string;
    label: string;
    labelAr: string;
  }>;
}

interface CompanyInfo {
  companyName: string;
  crNumber: string;
  address: string;
  phone: string;
  email: string;
}

export default function AIDocumentsPage() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [copied, setCopied] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: "",
    crNumber: "",
    address: "",
    phone: "",
    email: "",
  });
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [language]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/ai/documents?language=${language}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.fields.filter(
      (f) => !formData[f.key]?.trim()
    );
    if (missingFields.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id.toUpperCase().replace(/-/g, "_"),
          data: formData,
          language,
          companyInfo: companyInfo.companyName ? companyInfo : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate document");

      const data = await response.json();
      setGeneratedDoc(data.content);
    } catch (error) {
      console.error("Document generation error:", error);
      alert("Failed to generate document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedDoc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate?.id || "document"}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "HR":
        return <User className="w-5 h-5" />;
      case "Government":
        return <Shield className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "HR":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Government":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Document Generator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Generate professional business documents with AI assistance
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setLanguage("en")}
            className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              language === "en"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("ar")}
            className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              language === "ar"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            العربية
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Templates & Form Section */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Select Template
              </h2>

              {isLoadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setFormData({});
                        setGeneratedDoc("");
                      }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(
                          template.category
                        )}`}
                      >
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {language === "ar" ? template.nameAr : template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {template.category} Document
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          selectedTemplate?.id === template.id
                            ? "text-primary rotate-90"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <AnimatePresence mode="wait">
              {selectedTemplate && (
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-panel rounded-2xl p-6"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Document Details
                  </h2>

                  <div className="space-y-4">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {language === "ar" ? field.labelAr : field.label}
                        </label>
                        <input
                          type="text"
                          value={formData[field.key] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                          placeholder={
                            language === "ar" ? field.labelAr : field.label
                          }
                        />
                      </div>
                    ))}

                    {/* Company Info Toggle */}
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => setShowCompanyForm(!showCompanyForm)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Building2 className="w-4 h-4" />
                        {showCompanyForm
                          ? "Hide Company Details"
                          : "Add Company Details (Optional)"}
                      </button>

                      <AnimatePresence>
                        {showCompanyForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3"
                          >
                            <input
                              type="text"
                              value={companyInfo.companyName}
                              onChange={(e) =>
                                setCompanyInfo({
                                  ...companyInfo,
                                  companyName: e.target.value,
                                })
                              }
                              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
                              placeholder="Company Name"
                            />
                            <input
                              type="text"
                              value={companyInfo.crNumber}
                              onChange={(e) =>
                                setCompanyInfo({
                                  ...companyInfo,
                                  crNumber: e.target.value,
                                })
                              }
                              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
                              placeholder="CR Number"
                            />
                            <input
                              type="text"
                              value={companyInfo.address}
                              onChange={(e) =>
                                setCompanyInfo({
                                  ...companyInfo,
                                  address: e.target.value,
                                })
                              }
                              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
                              placeholder="Address"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={companyInfo.phone}
                                onChange={(e) =>
                                  setCompanyInfo({
                                    ...companyInfo,
                                    phone: e.target.value,
                                  })
                                }
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
                                placeholder="Phone"
                              />
                              <input
                                type="email"
                                value={companyInfo.email}
                                onChange={(e) =>
                                  setCompanyInfo({
                                    ...companyInfo,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
                                placeholder="Email"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Bot className="w-5 h-5" />
                          Generate Document
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Output Section */}
          <div className="glass-panel rounded-2xl p-6 min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Generated Document
              </h2>
              {generatedDoc && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-80"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-foreground font-medium">
                    Generating document...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a moment
                  </p>
                </motion.div>
              ) : generatedDoc ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <div
                    className="bg-background border border-border rounded-xl p-4 max-h-[500px] overflow-y-auto"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                      {generatedDoc}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-80 text-center"
                >
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Select a template and fill in the details
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your generated document will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
