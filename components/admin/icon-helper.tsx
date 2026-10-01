"use client";

import React from "react";
import {
  Sparkles,
  FileText,
  Palette,
  Layers,
  Bot,
  Cpu,
  Compass,
  Wand2,
  Terminal,
  Code2,
  Workflow,
  Boxes,
  Zap,
  Layout,
  LucideIcon,
} from "lucide-react";

export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  FileText,
  Palette,
  Layers,
  Bot,
  Cpu,
  Compass,
  Wand2,
  Terminal,
  Code2,
  Workflow,
  Boxes,
  Zap,
  Layout,
};

interface IconRendererProps {
  icon: string;
  className?: string;
}

export function IconRenderer({ icon, className = "h-5 w-5" }: IconRendererProps) {
  // If it's a data URL or image URL
  if (icon.startsWith("data:") || icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt="Tool icon"
        className={`${className} object-cover rounded-md`}
      />
    );
  }

  // Lookup in available Lucide icons
  const Component = AVAILABLE_ICONS[icon] || Sparkles;
  return <Component className={className} />;
}
