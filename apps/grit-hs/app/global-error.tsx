"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: replaces the root layout, so it deliberately uses
 * inline styles rather than app CSS — whatever broke may be the stylesheet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#f5f1e8",
          color: "#2e211b",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Grit hit an unexpected error</h1>
        <p style={{ maxWidth: "28rem", fontSize: "0.875rem", opacity: 0.75, margin: 0 }}>
          The app failed to load. Your saved data isn&apos;t affected. Reloading usually fixes it.
        </p>
        {error.digest && (
          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", opacity: 0.6, margin: 0 }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "9999px",
            border: "none",
            backgroundColor: "#2f5d47",
            color: "#ffffff",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
