import useTasks from "../store/useTasks";

export default function Schedule() {
  const { tasks } = useTasks();

  const todayTasks = tasks
    .filter((t) => t.scheduleTime && !t.completed)
    .sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));

  return (
    <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4">
      <p className="text-[#555550] text-xs font-mono uppercase tracking-widest mb-4">
        Today's Schedule
      </p>

      {todayTasks.length === 0 ? (
        <p className="text-[#333330] text-xs font-mono">No scheduled tasks</p>
      ) : (
        <div className="flex flex-col gap-3">
          {todayTasks.map((task, i) => (
            <div key={task.id} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <span className="text-[#f0a500] text-xs font-mono w-12 shrink-0">
                  {task.scheduleTime}
                </span>
                {i < todayTasks.length - 1 && (
                  <div className="w-px h-6 bg-[#2a2a26] mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-[#e8e4dc] truncate">
                  {task.title}
                </p>
                <p
                  className={`text-xs font-mono mt-0.5 ${
                    task.priority === "high"
                      ? "text-[#e85d4a]"
                      : task.priority === "medium"
                        ? "text-[#f0a500]"
                        : "text-[#6a9e6a]"
                  }`}
                >
                  {task.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
