import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ── NCERT 2026 Curriculum Data ──────────────────────────────────────────────
const curriculum = {
  Mathematics: {
    icon: "∑",
    color: "#1a56db",
    chapters: [
      "Ch 1: Integers",
      "Ch 2: Fractions and Decimals",
      "Ch 3: Data Handling",
      "Ch 4: Simple Equations",
      "Ch 5: Lines and Angles",
      "Ch 6: The Triangle and Its Properties",
      "Ch 7: Congruence of Triangles",
      "Ch 8: Comparing Quantities",
      "Ch 9: Rational Numbers",
      "Ch 10: Practical Geometry",
      "Ch 11: Perimeter and Area",
      "Ch 12: Algebraic Expressions",
      "Ch 13: Exponents and Powers",
      "Ch 14: Symmetry",
      "Ch 15: Visualising Solid Shapes",
    ],
  },
  Science: {
    icon: "⚗",
    color: "#0e9f6e",
    chapters: [
      "Ch 1: Nutrition in Plants",
      "Ch 2: Nutrition in Animals",
      "Ch 3: Fibre to Fabric",
      "Ch 4: Heat",
      "Ch 5: Acids, Bases and Salts",
      "Ch 6: Physical and Chemical Changes",
      "Ch 7: Weather, Climate & Adaptations",
      "Ch 8: Winds, Storms and Cyclones",
      "Ch 9: Soil",
      "Ch 10: Respiration in Organisms",
      "Ch 11: Transportation in Animals and Plants",
      "Ch 12: Reproduction in Plants",
      "Ch 13: Motion and Time",
      "Ch 14: Electric Current and Its Effects",
      "Ch 15: Light",
      "Ch 16: Water: A Precious Resource",
      "Ch 17: Forests: Our Lifeline",
      "Ch 18: Wastewater Story",
    ],
  },
};

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert, friendly, and encouraging tutor for Grade 7 students following the NCERT 2026 curriculum (India). Your role is strictly limited to helping students understand Mathematics and Science topics from the Grade 7 NCERT textbooks.

RULES (follow strictly):
1. ONLY answer questions related to Grade 7 NCERT Mathematics and Science. If asked about anything outside this scope (other subjects, grades, unrelated topics, harmful content, etc.), politely decline and redirect the student back to their studies.
2. Use age-appropriate, simple, and clear language suitable for a 12-13 year old student.
3. Always explain concepts step-by-step. Break down complex problems into smaller parts.
4. Use real-life examples and analogies to make concepts memorable.
5. When solving math problems, show every step clearly.
6. Render all mathematical expressions and formulas using LaTeX syntax (wrap inline math in $...$ and block math in $$...$$).
7. Be encouraging and positive. Celebrate correct attempts and gently correct mistakes.
8. If a student seems confused, ask a guiding question rather than giving the answer directly.
9. Always relate answers back to the NCERT textbook concepts when possible.
10. Do not provide answers to exam papers or homework assignments directly — instead, guide the student through the problem-solving process.

You are a bouncer: if a question is not about Grade 7 NCERT Math or Science, respond with exactly: "I'm your Grade 7 Math & Science tutor! I can only help with NCERT Grade 7 topics. What chapter are you studying? 😊"`;

// ── API Call ──────────────────────────────────────────────────────────────────
async function callGroq(messages: Message[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is not set in .env");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Groq API error");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-scholar-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-scholar-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-scholar-600 text-white rounded-br-sm"
            : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-scholar-700">{children}</strong>,
              code: ({ children }) => (
                <code className="bg-slate-100 text-scholar-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto my-2 text-xs">{children}</pre>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold ml-2 mt-1 shrink-0">
          You
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your **Grade 7 NCERT Tutor**. I can help you with **Mathematics** and **Science** from your NCERT textbooks.\n\nPick a chapter from the sidebar or ask me anything! I'm here to help you understand — not just give answers. 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [openSubject, setOpenSubject] = useState<string | null>("Mathematics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await callGroq([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Error**: ${errMsg}\n\nPlease check your \`VITE_GROQ_API_KEY\` in the \`.env\` file.`,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleChapterClick = (subject: string, chapter: string) => {
    setActiveChapter(chapter);
    const prompt = `I want to learn about "${chapter}" from ${subject}. Can you give me a quick overview of what this chapter covers?`;
    handleSend(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-body overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-scholar-600 flex items-center justify-center shadow">
              <span className="text-white text-lg font-bold">7</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">Grade 7 Tutor</h1>
              <p className="text-xs text-slate-400">NCERT 2026 Edition</p>
            </div>
          </div>
        </div>

        {/* Curriculum Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {Object.entries(curriculum).map(([subject, { icon, chapters }]) => (
            <div key={subject}>
              <button
                onClick={() => setOpenSubject(openSubject === subject ? null : subject)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-scholar-50 hover:text-scholar-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  {subject}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform text-slate-400 ${openSubject === subject ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSubject === subject && (
                <div className="mt-1 ml-2 space-y-0.5">
                  {chapters.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => handleChapterClick(subject, ch)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                        activeChapter === ch
                          ? "bg-scholar-600 text-white font-medium shadow-sm"
                          : "text-slate-600 hover:bg-scholar-50 hover:text-scholar-700"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
            Powered by Groq · NCERT Grade 7
          </p>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">
              {activeChapter ?? "Grade 7 NCERT Tutor"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-scholar-50 text-scholar-700 border border-scholar-200 px-2 py-1 rounded-full font-medium">
              Math & Science
            </span>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Chat cleared! 🌟 What would you like to learn today?",
                  },
                ]);
                setActiveChapter(null);
              }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              title="Clear chat"
            >
              Clear
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-scholar-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                AI
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {[
            "Explain with an example 📚",
            "Solve step by step 🔢",
            "Give me a practice question ✏️",
            "Summarise this chapter 📝",
          ].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-scholar-400 hover:text-scholar-700 hover:bg-scholar-50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-1">
          <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-3 focus-within:border-scholar-400 focus-within:ring-2 focus-within:ring-scholar-100 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Grade 7 Math or Science…"
              className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none leading-relaxed min-h-[24px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="shrink-0 w-9 h-9 rounded-xl bg-scholar-600 hover:bg-scholar-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Press <kbd className="bg-slate-100 px-1 rounded text-slate-500">Enter</kbd> to send · <kbd className="bg-slate-100 px-1 rounded text-slate-500">Shift+Enter</kbd> for new line
          </p>
        </div>
      </main>
    </div>
  );
}
