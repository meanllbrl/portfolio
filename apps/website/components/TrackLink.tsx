"use client";

import { trackEvent } from "@/lib/mixpanel";
import { ReactNode } from "react";

interface TrackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  eventProperties?: Record<string, any>;
  children: ReactNode;
}

export function TrackLink({ eventName, eventProperties, onClick, children, ...props }: TrackLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventProperties);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}

