"use client";

import { useState } from "react";
import { useSafeSession } from "@/lib/use-auth";
import {
  FileEdit,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Target,
  FileText,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeHistory {
  id: string;
  title: string;
  createdAt: string;
  content: string;
}

export default function AIResumePage() {
  const { data: session } = useSafeSession();
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ResumeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleEnhance = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      alert("Please enter at least 50 characters of resume content.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetJob: targetJob || undefined,
          language,
          action: "enhance",
        }),
      });

      if (!response.ok) throw new Error("Failed to enhance resume");

      const data = await response.json();
      setEnhancedResume(data.enhancedResume);
    } catch (error) {
      console.error("Resume enhancement error:", error);
      alert("Failed to enhance resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([enhancedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enhanced-resume-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/ai/resume");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        setShowHistory(true);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileEdit className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Resume Builder
            </h1>
          </div>
          <p className="text-muted-foreground">
            Enhance your resume with AI-powered suggestions optimized for the
            Saudi job market
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Your Resume
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Paste your resume content
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your current resume here. Include your work experience, education, skills, and achievements..."
                    className="w-full h-64 bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {resumeText.length} characters (minimum 50 required)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Target Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    placeholder="e.g. Senior Software Engineer, HR Manager"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Output Language
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        language === "en"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage("ar")}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        language === "ar"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEnhance}
                  disabled={isLoading || resumeText.length < 50}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enhance Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* History Button */}
            <button
              onClick={loadHistory}
              className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Clock className="w-4 h-4" />
              View Enhancement History
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Enhanced Resume
                </h2>
                {enhancedResume && (
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
                    <button
                      onClick={handleEnhance}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
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
                    className="flex flex-col items-center justify-center h-64"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <p className="text-foreground font-medium">
                      Enhancing your resume...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This may take a moment
                    </p>
                  </motion.div>
                ) : enhancedResume ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="bg-background border border-border rounded-xl p-4 max-h-[500px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                        {enhancedResume}
                      </pre>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                      <FileEdit className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Your enhanced resume will appear here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste your resume and click Enhance to get started
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h3 className="font-medium text-foreground mb-2">
                Tips for best results:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Include all your work experience with dates</li>
                <li>• List your key achievements and responsibilities</li>
                <li>• Mention relevant skills and certifications</li>
                <li>• Specify a target job for tailored suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl glass-panel rounded-2xl shadow-2xl z-50 p-6 max-h-[80vh] overflow-y-auto"
              >
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Enhancement History
                </h2>
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No previous enhancements found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setEnhancedResume(item.content);
                          setShowHistory(false);
                        }}
                      >
                        <h3 className="font-medium text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-full mt-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
