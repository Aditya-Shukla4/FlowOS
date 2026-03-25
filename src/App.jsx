import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function AppShell() {
  const location = useLocation();
  const titles = {
    "/": "Dashboard",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  const pageTitle = titles[location.pathname] || "FlowOS";

  return (
    <div className="flex h-screen bg-[#141412] text-[#e8e4dc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={pageTitle} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
