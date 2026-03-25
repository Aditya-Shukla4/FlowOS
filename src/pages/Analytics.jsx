import useTasks from "../store/useTasks";

export default function Analytics() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const rate = total ? Math.round((completed / total) * 100) : 0;

  const byCategory = ["work", "study", "personal", "health"].map((cat) => ({
    label: cat,
    count: tasks.filter((t) => t.category === cat).length,
    done: tasks.filter((t) => t.category === cat && t.completed).length,
  }));

  const byPriority = [
    { label: "high", color: "#e85d4a" },
    { label: "medium", color: "#f0a500" },
    { label: "low", color: "#6a9e6a" },
  ].map((p) => ({
    ...p,
    count: tasks.filter((t) => t.priority === p.label).length,
  }));

  const upcoming = tasks
    .filter((t) => !t.completed && t.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-mono font-bold text-[#e8e4dc]">
          Analytics
        </h1>
        <p className="text-[#555550] text-xs font-mono mt-1">
          Your productivity breakdown
        </p>
      </div>

      {total === 0 ? (
        <div className="text-center py-20 text-[#333330] font-mono text-sm">
          No data yet — add tasks from Dashboard ↑
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Completion Rate */}
          <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5">
            <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-3">
              Overall Completion
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[#f0a500] text-5xl font-mono font-bold">
                {rate}%
              </span>
              <div className="flex-1">
                <div className="bg-[#141412] rounded-full h-2 mb-2">
                  <div
                    className="bg-[#f0a500] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <p className="text-[#555550] text-xs font-mono">
                  {completed} of {total} tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5">
            <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
              Priority Breakdown
            </p>
            <div className="grid grid-cols-3 gap-3">
              {byPriority.map((p) => (
                <div
                  key={p.label}
                  className="bg-[#141412] rounded-lg p-4 text-center"
                >
                  <p
                    className="text-3xl font-mono font-bold"
                    style={{ color: p.color }}
                  >
                    {p.count}
                  </p>
                  <p className="text-xs font-mono text-[#555550] capitalize mt-1">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5">
            <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
              By Category
            </p>
            <div className="flex flex-col gap-3">
              {byCategory
                .filter((c) => c.count > 0)
                .map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#888880] w-16 capitalize">
                      {c.label}
                    </span>
                    <div className="flex-1 bg-[#141412] rounded-full h-1.5">
                      <div
                        className="bg-[#f0a500] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(c.count / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[#555550] w-16 text-right">
                      {c.done}/{c.count} done
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          {upcoming.length > 0 && (
            <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-5">
              <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
                Upcoming Deadlines
              </p>
              <div className="flex flex-col gap-2">
                {upcoming.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center py-2 border-b border-[#2a2a26] last:border-0"
                  >
                    <span className="text-sm font-mono text-[#e8e4dc]">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono uppercase font-bold ${
                          task.priority === "high"
                            ? "text-[#e85d4a]"
                            : task.priority === "medium"
                              ? "text-[#f0a500]"
                              : "text-[#6a9e6a]"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs font-mono text-[#555550]">
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
