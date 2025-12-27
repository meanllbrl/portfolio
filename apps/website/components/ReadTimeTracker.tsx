"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/mixpanel";
import { usePathname } from "next/navigation";

interface ReadTimeTrackerProps {
  type: "project" | "blog_post";
  slug: string;
  title?: string;
}

export function ReadTimeTracker({ type, slug, title }: ReadTimeTrackerProps) {
  const startTime = useRef<number>(Date.now());
  const pathname = usePathname();

  useEffect(() => {
    // Reset start time on mount
    startTime.current = Date.now();

    // Function to track time
    const trackTime = () => {
      const duration = (Date.now() - startTime.current) / 1000; // in seconds
      
      // Only track if meaningful time spent (e.g., > 2 seconds)
      if (duration > 2) {
        trackEvent("Read Content", {
          content_type: type,
          content_slug: slug,
          content_title: title,
          duration_seconds: Math.round(duration),
          path: pathname
        });
      }
    };

    // Track when component unmounts
    return () => {
      trackTime();
    };
  }, [type, slug, title, pathname]);

  return null;
}

