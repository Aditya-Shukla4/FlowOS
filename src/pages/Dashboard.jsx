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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-mono font-bold text-[#e8e4dc]">
          Dashboard
        </h1>
        <p className="text-[#555550] text-xs font-mono mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Tasks", value: total },
          { label: "Completed", value: completed },
          { label: "High Priority", value: high },
          { label: "Completion", value: `${completionRate}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-3"
          >
            <p className="text-[#555550] text-xs font-mono uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="text-[#f0a500] text-2xl font-mono font-bold mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Layout — 2 columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left — Input + Tasks */}
        <div className="col-span-2 flex flex-col gap-4">
          <InputBox />

          {/* Filter */}
          <div className="flex gap-2">
            {["all", "today", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-mono px-3 py-1.5 rounded transition-colors uppercase
                  ${
                    filter === f
                      ? "bg-[#f0a500] text-[#141412] font-bold"
                      : "text-[#555550] hover:text-[#e8e4dc] border border-[#2a2a26]"
                  }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs font-mono text-[#333330] self-center">
              {filteredTasks.length} tasks
            </span>
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-2">
            {isLoading && (
              <div className="text-center py-8 text-[#555550] font-mono text-sm">
                ⟳ Processing your input...
              </div>
            )}
            {!isLoading && filteredTasks.length === 0 && (
              <div className="text-center py-12 text-[#333330] font-mono text-sm">
                No tasks yet — paste something above ↑
              </div>
            )}
            {[...filteredTasks]
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>

        {/* Right — Schedule */}
        <div className="col-span-1">
          <Schedule />
        </div>
      </div>
    </div>
  );
}
