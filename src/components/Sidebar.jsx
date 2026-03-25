import { useState } from "react";
import { NavLink } from "react-router-dom";
import useTasks from "../store/useTasks";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
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
    { to: "/analytics", label: "Analytics", icon: "◎" },
    { to: "/settings", label: "Settings", icon: "⚙" },
  ];

  const sidebarContent = (
    <aside className="w-48 h-full bg-[#0e0e0d] border-r border-[#1e1e1a] flex flex-col py-5 px-3">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#f0a500] rounded flex items-center justify-center">
            <span className="text-[#0e0e0d] text-xs font-black">F</span>
          </div>
          <span className="text-[#e8e4dc] font-mono font-bold text-base tracking-tight">
            FlowOS
          </span>
        </div>
        <p className="text-[#2e2e2a] text-xs mt-2 font-mono pl-8">
          Smart Workflow OS
        </p>
      </div>

      <nav className="flex flex-col gap-0.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-mono transition-all
              ${
                isActive
                  ? "bg-[#f0a500] text-[#0e0e0d] font-bold"
                  : "text-[#555550] hover:text-[#e8e4dc] hover:bg-[#1a1a17]"
              }`
            }
          >
            <span className="text-sm">{link.icon}</span>
            <span className="flex-1">{link.label}</span>
            {link.badge > 0 && (
              <span className="bg-[#e85d4a] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="my-4 border-t border-[#1e1e1a]" />

      <div className="flex flex-col gap-1 px-1">
        <p className="text-[#2e2e2a] text-xs font-mono uppercase tracking-widest mb-2">
          Overview
        </p>
        {[
          {
            label: "Pending",
            value: pending,
            color: "text-[#e8e4dc]",
            bg: "bg-[#1a1a17]",
          },
          {
            label: "Critical",
            value: high,
            color: "text-[#e85d4a]",
            bg: "bg-[#e85d4a]/5",
          },
          {
            label: "Due today",
            value: dueToday,
            color: "text-[#f0a500]",
            bg: "bg-[#f0a500]/5",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex justify-between items-center px-2 py-1.5 rounded ${s.bg}`}
          >
            <span className="text-[#444440] text-xs font-mono">{s.label}</span>
            <span className={`text-xs font-mono font-bold ${s.color}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-[#1e1e1a] px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6a9e6a] animate-pulse shrink-0" />
          <span className="text-[#2e2e2a] text-xs font-mono truncate">
            Groq · Llama 3.3
          </span>
        </div>
        <p className="text-[#1e1e1a] text-xs font-mono mt-1">v1.0.0</p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen shrink-0">{sidebarContent}</div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1a1a17] border border-[#2a2a26] rounded-md p-2 text-[#e8e4dc]"
      >
        ☰
      </button>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="md:hidden fixed left-0 top-0 h-full z-50 w-48">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
