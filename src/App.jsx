import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: input }],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Request failed");
      }

      setResponse(data.choices[0].message.content);
    } catch (err) {
      setError(err.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🤖 AI Assistant</h2>
        <p style={styles.subtitle}>
          Ask anything and get instant AI-powered responses
        </p>

        <div style={styles.chatBox}>
          {response ? (
            <div style={styles.aiMessage}>{response}</div>
          ) : (
            <div style={styles.placeholder}>
              Your AI response will appear here...
            </div>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
          />
          <button
            onClick={handleAskAI}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  title: {
    margin: 0,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
  chatBox: {
    minHeight: 180,
    background: "#f7f7f9",
    borderRadius: 8,
    padding: 16,
    overflowY: "auto",
    marginBottom: 12,
  },
  aiMessage: {
    background: "#e9ecff",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.6,
  },
  placeholder: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 60,
  },
  error: {
    background: "#ffe5e5",
    color: "#c00",
    padding: 10,
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 10,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    outline: "none",
  },
  button: {
    padding: "0 18px",
    borderRadius: 8,
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
};
