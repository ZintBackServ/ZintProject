import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0318 0%, #1a0529 50%, #0a0a1a 100%)",
            fontFamily: "Inter, sans-serif",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1.5rem",
              padding: "3rem",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
            <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              An unexpected error occurred. Please refresh the page or go back home.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.6rem 1.5rem",
                  background: "linear-gradient(135deg, #8E1387, #B11FA8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => { window.location.href = "/"; }}
                style={{
                  padding: "0.6rem 1.5rem",
                  background: "rgba(255,255,255,0.08)",
                  color: "#d1d5db",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
