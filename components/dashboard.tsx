"use client";

import React, { useState } from "react";
import { PlusCircle, Clock, Tag, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutlineFormData {
  question: string;
  generating: boolean;
}

export default function Dashboard() {
  const [formData, setFormData] = useState<OutlineFormData>({
    question: "",
    generating: false,
  });

  const handleGenerate = async () => {
    setFormData((prev) => ({ ...prev, generating: true }));
    // TODO: Implement outline generation
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, generating: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Create New Outline
        </h2>
        <p className="text-muted-foreground mb-6">
          Enter your extemp question and let AI help you create a structured
          outline.
        </p>
        <div className="space-y-4">
          <textarea
            rows={3}
            value={formData.question}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, question: e.target.value }))
            }
            className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="How has artificial intelligence impacted global economics in 2024?"
          />
          <button
            onClick={handleGenerate}
            disabled={formData.generating || !formData.question}
            className="inline-flex h-10 items-center justify-center rounded-md px-4 bg-primary font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            {formData.generating ? (
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {formData.generating ? "Generating..." : "Generate Outline"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          Recent Outlines
        </h2>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between group">
                <div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                    How has artificial intelligence impacted global economics in
                    2024?
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />2 hours ago
                    </span>
                    <span className="flex items-center">
                      <Tag className="mr-1.5 h-3.5 w-3.5" />
                      Economics, Technology
                    </span>
                  </div>
                </div>
                <button className="inline-flex h-8 items-center justify-center rounded-md px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
