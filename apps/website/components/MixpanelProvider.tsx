"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackEvent } from "@/lib/mixpanel";

export function MixpanelProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Mixpanel
    initMixpanel();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Track page views
    // Only track if initialized to avoid race conditions (though mixpanel queues events usually)
    if (isInitialized && pathname) {
      // Construct full URL or just track path
      // Using window.location.href ensures we capture everything
      const url = window.location.href;
      
      trackEvent("Page View", {
        current_url: url,
        path: pathname,
        search: searchParams.toString(),
      });
    }
  }, [pathname, searchParams, isInitialized]);

  return null;
}

