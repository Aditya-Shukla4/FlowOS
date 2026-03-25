import { NavLink } from "react-router-dom";
import useTasks from "../store/useTasks";

export default function Sidebar() {
  const { tasks } = useTasks();

  const pending = tasks.filter((t) => !t.completed).length;
  const high = tasks.filter(
    (t) => t.priority === "high" && !t.completed,
  ).length;
  const today = new Date().toDateString();
  const dueToday = tasks.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline).toDateString() === today &&
      !t.completed,
  ).length;

  const links = [
    { to: "/", label: "Dashboard", icon: "⊞", badge: pending || null },
    { to: "/analytics", label: "Analytics", icon: "◎", badge: null },
    { to: "/settings", label: "Settings", icon: "⚙", badge: null },
  ];

  return (
    <aside className="w-52 h-screen bg-[#141412] border-r border-[#2a2a26] flex flex-col py-6 px-4 shrink-0">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-[#f0a500] font-mono font-bold text-lg tracking-tight">
          FlowOS
        </span>
        <p className="text-[#555550] text-xs mt-1 font-mono">
          Smart Workflow OS
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition-colors
              ${
                isActive
                  ? "bg-[#f0a500]/10 text-[#f0a500]"
                  : "text-[#888880] hover:text-[#e8e4dc] hover:bg-[#1f1f1c]"
              }`
            }
          >
            <span>{link.icon}</span>
            <span className="flex-1">{link.label}</span>
            {link.badge > 0 && (
              <span className="bg-[#f0a500] text-[#141412] text-xs font-mono font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick stats */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#2a2a26] flex flex-col gap-2">
          <p className="text-[#333330] text-xs font-mono uppercase tracking-widest mb-1">
            Quick Stats
          </p>
          {[
            { label: "Pending", value: pending, color: "text-[#e8e4dc]" },
            { label: "High", value: high, color: "text-[#e85d4a]" },
            { label: "Due today", value: dueToday, color: "text-[#f0a500]" },
          ].map((s) => (
            <div key={s.label} className="flex justify-between items-center">
              <span className="text-[#555550] text-xs font-mono">
                {s.label}
              </span>
              <span className={`text-xs font-mono font-bold ${s.color}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[#2a2a26]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6a9e6a] animate-pulse" />
          <span className="text-[#333330] text-xs font-mono">
            Groq · Llama 3.3
          </span>
        </div>
        <p className="text-[#2a2a26] text-xs font-mono mt-1">v1.0.0</p>
      </div>
    </aside>
  );
}
