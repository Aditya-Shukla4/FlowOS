import useTasks from "../store/useTasks";

export default function Settings() {
  const { clearAllTasks, tasks } = useTasks();

  const handleReset = () => {
    if (
      window.confirm("Are you sure? This will delete all your tasks forever!")
    ) {
      clearAllTasks();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-mono font-bold text-[#e8e4dc]">Settings</h1>
        <p className="text-[#555550] text-xs font-mono mt-1">
          Configure your workflow & data
        </p>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5 mb-6">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
          Preferences
        </p>
        <div className="flex flex-col gap-4">
          {[
            { label: "AI Model", value: "Llama 3.3 70B (Groq)" },
            { label: "Auto-Schedule", value: "Enabled" },
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

      {/* Danger Zone */}
      <div className="bg-[#1f1f1c] border border-[#e85d4a]/30 rounded-lg p-5">
        <p className="text-[#e85d4a] text-xs font-mono uppercase tracking-widest mb-4">
          Danger Zone
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-mono text-[#e8e4dc]">
              Reset Application Data
            </p>
            <p className="text-xs font-mono text-[#555550] mt-1">
              Permanently delete all {tasks.length} tasks and analytics. Good
              for fresh demos.
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
