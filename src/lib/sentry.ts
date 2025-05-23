import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions, adjust in production
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample rate for session replays
      replaysOnErrorSampleRate: 1.0, // Sample rate for error replays
    });
  }
}; 