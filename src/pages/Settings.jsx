import { useState, useEffect } from "react";
import useTasks from "../store/useTasks";

function StatusDot({ ok }) {
  return (
    <span
      className={`w-1.5 h-1.5 rounded-full inline-block mr-2 ${ok ? "bg-[#6a9e6a]" : "bg-[#e85d4a]"}`}
    />
  );
}

export default function Settings() {
  const { clearAllTasks, tasks } = useTasks();
  const [backendStatus, setBackendStatus] = useState(null); // null=checking, true=ok, false=down
  const [copied, setCopied] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    fetch(`${API}/health`)
      .then((r) => setBackendStatus(r.ok))
      .catch(() => setBackendStatus(false));
  }, []);

  const handleReset = () => {
    if (
      window.confirm(`Delete all ${tasks.length} tasks? This cannot be undone.`)
    ) {
      clearAllTasks();
    }
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(
      "VITE_GROQ_API_KEY=\nVITE_API_BASE=http://localhost:5000\nMONGO_URI=",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completed = tasks.filter((t) => t.completed).length;
  const rate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-mono font-bold text-[#e8e4dc]">Settings</h1>
        <p className="text-[#555550] text-xs font-mono mt-1">
          Configure your workflow and data
        </p>
      </div>

      {/* System Status */}
      <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5 mb-4">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
          System Status
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Groq API",
              status: !!import.meta.env.VITE_GROQ_API_KEY,
              value: import.meta.env.VITE_GROQ_API_KEY
                ? "Connected"
                : "Missing API key",
            },
            {
              label: "Backend (Node.js)",
              status: backendStatus,
              value:
                backendStatus === null
                  ? "Checking..."
                  : backendStatus
                    ? "Online"
                    : "Offline",
            },
            {
              label: "Local Storage",
              status: true,
              value: `${tasks.length} tasks cached`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-2 border-b border-[#2a2a26] last:border-0"
            >
              <span className="text-sm font-mono text-[#888880]">
                {item.label}
              </span>
              <span
                className={`text-xs font-mono px-2 py-1 rounded flex items-center
                ${item.status ? "bg-[#6a9e6a]/10 text-[#6a9e6a]" : "bg-[#e85d4a]/10 text-[#e85d4a]"}`}
              >
                <StatusDot ok={item.status} />
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Config */}
      <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5 mb-4">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
          Configuration
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "AI Model", value: "Llama 3.3 70B (Groq)" },
            { label: "Auto-Schedule", value: "Enabled" },
            { label: "Persistence", value: "Zustand + MongoDB" },
            { label: "Theme", value: "Dark Flow" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-2 border-b border-[#2a2a26] last:border-0"
            >
              <span className="text-sm font-mono text-[#888880]">
                {item.label}
              </span>
              <span className="text-sm font-mono text-[#f0a500] bg-[#f0a500]/10 px-2 py-1 rounded">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data summary */}
      <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5 mb-4">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
          Data Summary
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total tasks", value: tasks.length },
            { label: "Completed", value: completed },
            { label: "Success rate", value: `${rate}%` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#141412] rounded-lg p-3 text-center"
            >
              <p className="text-[#f0a500] text-2xl font-mono font-bold">
                {s.value}
              </p>
              <p className="text-[#555550] text-xs font-mono mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1f1f1c] border border-[#e85d4a]/30 rounded-lg p-5">
        <p className="text-[#e85d4a] text-xs font-mono uppercase tracking-widest mb-4">
          Danger Zone
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-mono text-[#e8e4dc]">Reset All Data</p>
            <p className="text-xs font-mono text-[#555550] mt-1">
              Permanently delete all {tasks.length} tasks. Use between judge
              rotations.
            </p>
          </div>
          <button
            onClick={handleReset}
            disabled={tasks.length === 0}
            className="bg-[#e85d4a]/10 border border-[#e85d4a] text-[#e85d4a] hover:bg-[#e85d4a] hover:text-[#141412] text-xs font-mono font-bold px-4 py-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            CLEAR ALL DATA
          </button>
        </div>
      </div>
    </div>
  );
}
