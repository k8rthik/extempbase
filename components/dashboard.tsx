"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Clock, Tag, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface OutlineFormData {
  question: string;
  generating: boolean;
}

interface Outline {
  id: string;
  title: string;
  created_at: string;
  content: {
    thesis?: string;
    points?: string[];
    subpoints?: Record<string, string[]>;
  };
}

export default function Dashboard() {
  const [formData, setFormData] = useState<OutlineFormData>({
    question: "",
    generating: false,
  });
  const [recentOutlines, setRecentOutlines] = useState<Outline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch recent outlines from Supabase
  useEffect(() => {
    async function fetchRecentOutlines() {
      try {
        const { data, error } = await supabase
          .from("outlines")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching outlines:", error);
          return;
        }

        setRecentOutlines(data || []);
      } catch (error) {
        console.error("Error in fetchRecentOutlines:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentOutlines();
  }, []);

  // Function to generate outline content using Gemini Flash 2.0 API
  const generateOutlineContent = async (question: string) => {
    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate outline");
      }

      const data = await response.json();
      return data.data[0];
    } catch (error) {
      console.error("Error generating outline:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate outline",
      );
      throw error;
    }
  };

  const handleGenerate = async () => {
    setFormData((prev) => ({ ...prev, generating: true }));
    setError(null);

    try {
      // Step 1: Generate outline content using Gemini API
      const outlineContent = await generateOutlineContent(formData.question);

      // Step 2: Create a new outline in Supabase with the generated content
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from("outlines")
        .insert({
          user_id: session.user.id,
          title: formData.question,
          content: outlineContent,
        })
        .select();

      if (error) {
        console.error("Error creating outline:", error);
        setError("Failed to save outline");
        return;
      }

      // Step 3: Refresh the outlines list
      const { data: updatedOutlines, error: fetchError } = await supabase
        .from("outlines")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!fetchError) {
        setRecentOutlines(updatedOutlines || []);
      }

      // Redirect to the newly created outline
      if (data && data.length > 0) {
        window.location.href = `/outlines/${data[0].id}`;
      }

      // Clear the form
      setFormData({ question: "", generating: false });
    } catch (error) {
      console.error("Error in handleGenerate:", error);
    } finally {
      setFormData((prev) => ({ ...prev, generating: false }));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours === 1) {
        return "1 hour ago";
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        return formatDate(dateString);
      }
    } catch {
      return "Unknown time";
    }
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
          {error && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
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
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-900 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentOutlines.length === 0 ? (
          <div className="text-center py-8 border rounded-md border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-muted-foreground">No outlines created yet</p>
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  question:
                    "How has artificial intelligence impacted global economics in 2024?",
                }))
              }
              className="mt-2 text-primary hover:underline text-sm"
            >
              Create your first outline
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOutlines.map((outline) => (
              <div key={outline.id} className="py-4 first:pt-0 last:pb-0">
                <Link
                  href={`/outlines/${outline.id}`}
                  className="flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                      {outline.title || "Untitled Outline"}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {formatTimeAgo(outline.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Tag className="mr-1.5 h-3.5 w-3.5" />
                        {outline.content?.points?.length
                          ? `${outline.content.points.length} points`
                          : "No points"}
                      </span>
                    </div>
                  </div>
                  <button className="inline-flex h-8 items-center justify-center rounded-md px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Export
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-right">
          <Link
            href="/outlines"
            className="text-sm text-primary hover:underline"
          >
            View all outlines
          </Link>
        </div>
      </div>
    </div>
  );
}
