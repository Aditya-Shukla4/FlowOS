import { useLocation } from "react-router-dom";
import useTasks from "../store/useTasks";

const pageMeta = {
  "/": { title: "Dashboard", sub: "Your tasks, prioritized by AI" },
  "/analytics": { title: "Analytics", sub: "Productivity breakdown" },
  "/settings": { title: "Settings", sub: "Configure your workflow" },
};

export default function Topbar() {
  const location = useLocation();
  const { tasks, isLoading } = useTasks();
  const meta = pageMeta[location.pathname] || { title: "FlowOS", sub: "" };

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const rate = total ? Math.round((completed / total) * 100) : 0;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-12 bg-[#141412] border-b border-[#2a2a26] flex items-center px-6 gap-4 shrink-0">
      {/* Page title */}
      <div className="flex items-baseline gap-2 mr-auto">
        <h1 className="text-sm font-mono font-bold text-[#e8e4dc]">
          {meta.title}
        </h1>
        <span className="text-xs font-mono text-[#333330] hidden sm:block">
          {meta.sub}
        </span>
      </div>

      {/* Completion rate pill */}
      {total > 0 && (
        <div className="flex items-center gap-2 bg-[#1f1f1c] border border-[#2a2a26] rounded px-3 py-1">
          <div className="w-16 bg-[#141412] rounded-full h-1">
            <div
              className="bg-[#f0a500] h-1 rounded-full transition-all duration-500"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#f0a500] tabular-nums">
            {rate}%
          </span>
        </div>
      )}

      {/* AI status */}
      <div className="flex items-center gap-1.5">
        {isLoading ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] animate-ping" />
            <span className="text-xs font-mono text-[#f0a500]">
              Processing...
            </span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6a9e6a] animate-pulse" />
            <span className="text-xs font-mono text-[#555550]">AI ready</span>
          </>
        )}
      </div>

      {/* Date + time */}
      <div className="text-xs font-mono text-[#333330] hidden md:block tabular-nums">
        {dateStr} · {timeStr}
      </div>
    </header>
  );
}
