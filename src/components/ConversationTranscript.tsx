"use client";

import React from "react";
import { parseTranscript } from "@/lib/transcript-parser";

interface ConversationTranscriptProps {
  transcript: string;
  className?: string;
}

export default function ConversationTranscript({ transcript, className = "" }: ConversationTranscriptProps) {
  const turns = parseTranscript(transcript);

  const renderContentWithLinks = (text: string) => {
    // Regex to capture markdown links: [Link Text](URL)
    const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = LINK_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary underline hover:text-brand-primary-hover font-semibold transition-colors duration-150"
        >
          {linkText}
        </a>
      );
      lastIndex = LINK_REGEX.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {turns.map((turn, i) => {
        if (turn.sender === "unknown") {
          return (
            <div 
              key={i} 
              className="text-xs font-mono text-text-muted italic bg-bg-surface-hover/50 border border-border-subtle rounded-lg p-2.5 text-center"
            >
              {turn.content}
            </div>
          );
        }

        const isAgent = turn.sender === "agent";
        return (
          <div 
            key={i} 
            className={`flex flex-col ${isAgent ? "items-start" : "items-end"} space-y-1`}
          >
            <span className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase">
              {turn.senderLabel}
            </span>
            <div
              className={`rounded-2xl p-3.5 text-xs leading-relaxed border max-w-[85%] ${
                isAgent
                  ? "bg-bg-surface-hover border-border-subtle text-text-primary"
                  : "bg-bg-surface border-border-subtle text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {renderContentWithLinks(turn.content)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
