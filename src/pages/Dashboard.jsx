import InputBox from "../components/InputBox";
import TaskCard from "../components/TaskCard";
import Schedule from "../components/Schedule";
import useTasks from "../store/useTasks";

export default function Dashboard() {
  const { getFilteredTasks, filter, setFilter, tasks, isLoading } = useTasks();
  const filteredTasks = getFilteredTasks();

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const high = tasks.filter(
    (t) => t.priority === "high" && !t.completed,
  ).length;
  const today = new Date().toDateString();
  const todayCount = tasks.filter(
    (t) => t.deadline && new Date(t.deadline).toDateString() === today,
  ).length;

  const stats = [
    { label: "Total", value: total, sub: "tasks", accent: "#e8e4dc" },
    {
      label: "Done",
      value: completed,
      sub: `${completionRate}%`,
      accent: "#6a9e6a",
    },
    { label: "Critical", value: high, sub: "urgent", accent: "#e85d4a" },
    { label: "Today", value: todayCount, sub: "due", accent: "#f0a500" },
  ];

  return (
    <div className="min-h-screen bg-[#111110]">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#2e2e2a] text-xs font-mono uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 className="text-xl font-mono font-bold text-[#e8e4dc] mt-0.5">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 17
                  ? "afternoon"
                  : "evening"}{" "}
              —<span className="text-[#f0a500]"> what needs doing?</span>
            </h1>
          </div>

          {total > 0 && (
            <div className="flex items-center gap-3 bg-[#1a1a17] border border-[#2a2a26] rounded-lg px-4 py-2.5">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#2a2a26"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#f0a500"
                    strokeWidth="3.5"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionRate / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-[#f0a500]">
                  {completionRate}%
                </span>
              </div>
              <div>
                <p className="text-xs font-mono text-[#e8e4dc] font-bold">
                  {completed} done
                </p>
                <p className="text-xs font-mono text-[#444440]">
                  {total - completed} left
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#161614] border border-[#222220] rounded-lg p-4 hover:border-[#2e2e2a] transition-colors relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{ backgroundColor: stat.accent, opacity: 0.6 }}
              />
              <p className="text-[#333330] text-xs font-mono uppercase tracking-widest">
                {stat.label}
              </p>
              <p
                className="font-mono font-bold mt-1 text-3xl leading-none"
                style={{ color: stat.accent }}
              >
                {stat.value}
              </p>
              <p className="text-[#2a2a26] text-xs font-mono mt-1">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left */}
          <div className="col-span-2 flex flex-col gap-3">
            <InputBox />

            {/* Filters */}
            <div className="flex items-center gap-1.5">
              {["all", "today", "high", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-mono px-3 py-1.5 rounded transition-all uppercase tracking-wider
                    ${
                      filter === f
                        ? "bg-[#f0a500] text-[#0e0e0d] font-bold"
                        : "text-[#444440] hover:text-[#e8e4dc] border border-[#222220] hover:border-[#333330]"
                    }`}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto text-xs font-mono text-[#2a2a26]">
                {filteredTasks.length} tasks
              </span>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#f0a500] animate-bounce"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-[#333330] text-xs font-mono tracking-widest uppercase">
                    AI extracting tasks
                  </p>
                </div>
              )}

              {!isLoading && filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 gap-3 border border-dashed border-[#1e1e1a] rounded-lg">
                  <span className="text-3xl opacity-10">⊞</span>
                  <p className="text-[#333330] text-xs font-mono">
                    Paste your goals above and hit Extract
                  </p>
                </div>
              )}

              {[...filteredTasks]
                .sort((a, b) => b.priorityScore - a.priorityScore)
                .map((task) => (
                  <TaskCard key={task._id || task.id} task={task} />
                ))}
            </div>
          </div>

          {/* Right */}
          <div className="col-span-1 flex flex-col gap-3">
            <Schedule />

            {total > 0 && (
              <div className="bg-[#161614] border border-[#222220] rounded-lg p-4">
                <p className="text-[#2e2e2a] text-xs font-mono uppercase tracking-widest mb-3">
                  Priority Mix
                </p>
                {[
                  { p: "high", color: "#e85d4a" },
                  { p: "medium", color: "#f0a500" },
                  { p: "low", color: "#6a9e6a" },
                ].map(({ p, color }) => {
                  const count = tasks.filter((t) => t.priority === p).length;
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={p} className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs font-mono text-[#333330] w-12 capitalize">
                        {p}
                      </span>
                      <div className="flex-1 bg-[#0e0e0d] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#2a2a26] w-5 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
