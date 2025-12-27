import mixpanel from "mixpanel-browser";

export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
export const MIXPANEL_HOST = process.env.NEXT_PUBLIC_MIXPANEL_HOST || 'https://api-eu.mixpanel.com';

export const initMixpanel = () => {
  if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === "development",
      track_pageview: false, // We will handle this manually in MixpanelProvider
      persistence: "localStorage",
      autocapture: true,
      record_sessions_percent: 100,
      api_host: MIXPANEL_HOST,
    });
  }
};

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
    mixpanel.track(name, properties);
  }
};

export default mixpanel;
