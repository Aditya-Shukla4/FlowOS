import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", icon: "⊞" },
    { to: "/analytics", label: "Analytics", icon: "◎" },
    { to: "/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <aside className="w-52 h-screen bg-[#141412] border-r border-[#2a2a26] flex flex-col py-6 px-4 shrink-0">
      <div className="mb-8">
        <span className="text-[#f0a500] font-mono font-bold text-lg tracking-tight">
          FlowOS
        </span>
        <p className="text-[#555550] text-xs mt-1 font-mono">Smart Workflow</p>
      </div>

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
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-[#333330] text-xs font-mono">v1.0.0</div>
    </aside>
  );
}
