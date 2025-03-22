"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  X,
  Calendar,
  ChevronRight,
  Clock,
  Tag,
  Download,
} from "lucide-react";
import ShimmerButton from "@/components/ShimmerButton";

interface Outline {
  id: string;
  title: string;
  created_at: string;
  content: {
    thesis?: string;
    points?: string[];
  };
}

export default function OutlinesList({ outlines }: { outlines: Outline[] }) {
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOutlines = outlines.filter((outline) =>
    outline.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
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

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-black">
      <div className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold">Outlines</h1>

              <Link href="/outlines/new">
                <ShimmerButton icon={<Plus className="w-4 h-4" />}>
                  New Outline
                </ShimmerButton>
              </Link>
            </div>

            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search outlines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-background border text-foreground placeholder-gray-400 focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
                />
              </div>
            </div>
          </div>

          {filteredOutlines.length === 0 ? (
            <div className="text-center py-16 border rounded-md border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                {searchQuery ? "No matching outlines" : "No outlines found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first outline to get started"}
              </p>

              {!searchQuery && (
                <Link href="/outlines/new">
                  <ShimmerButton icon={<Plus className="w-4 h-4" />}>
                    New Outline
                  </ShimmerButton>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="divide-y divide-border">
                {filteredOutlines.map((outline) => (
                  <div key={outline.id} className="py-4 first:pt-0 last:pb-0">
                    <div
                      onClick={() => setSelectedOutline(outline)}
                      className="flex items-center justify-between group cursor-pointer"
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedOutline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedOutline.title || "Untitled Outline"}
                </h2>
                <button
                  onClick={() => setSelectedOutline(null)}
                  className="text-gray-500 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Thesis Statement
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                    {selectedOutline.content?.thesis || "No thesis provided"}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Key Points
                  </h3>
                  {selectedOutline.content?.points?.length ? (
                    <ul className="space-y-2">
                      {selectedOutline.content.points.map((point, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 dark:bg-gray-900 rounded-md p-3"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 text-muted-foreground">
                      No points added yet
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Created {formatDate(selectedOutline.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
