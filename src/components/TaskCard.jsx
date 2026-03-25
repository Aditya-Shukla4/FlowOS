import useTasks from "../store/useTasks";

const priorityConfig = {
  high: {
    label: "HIGH",
    color: "text-[#e85d4a]",
    dot: "bg-[#e85d4a]",
    bar: "bg-[#e85d4a]",
  },
  medium: {
    label: "MED",
    color: "text-[#f0a500]",
    dot: "bg-[#f0a500]",
    bar: "bg-[#f0a500]",
  },
  low: {
    label: "LOW",
    color: "text-[#6a9e6a]",
    dot: "bg-[#6a9e6a]",
    bar: "bg-[#6a9e6a]",
  },
};

const categoryConfig = {
  work: "bg-[#f0a500]/10 text-[#f0a500]",
  study: "bg-[#4a8ae8]/10 text-[#4a8ae8]",
  personal: "bg-[#9e6ae8]/10 text-[#9e6ae8]",
  health: "bg-[#6a9e6a]/10 text-[#6a9e6a]",
};

function DeadlineBadge({ deadline }) {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  let label = deadline;
  let color = "text-[#555550]";

  if (diffDays < 0) {
    label = "Overdue";
    color = "text-[#e85d4a]";
  } else if (diffDays === 0) {
    label = "Today";
    color = "text-[#e85d4a]";
  } else if (diffDays === 1) {
    label = "Tomorrow";
    color = "text-[#f0a500]";
  } else if (diffDays <= 3) {
    label = `${diffDays}d left`;
    color = "text-[#f0a500]";
  } else {
    label = deadline;
  }

  return <span className={`text-xs font-mono ${color}`}>📅 {label}</span>;
}

export default function TaskCard({ task }) {
  const { toggleComplete, deleteTask } = useTasks();
  const id = task._id || task.id;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`group bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4 transition-all duration-200
        hover:border-[#3a3a36]
        ${task.completed ? "opacity-40" : ""}
      `}
    >
      {/* Priority bar — left edge */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(id)}
          className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all duration-150
            ${
              task.completed
                ? "bg-[#f0a500] border-[#f0a500]"
                : "border-[#444440] hover:border-[#f0a500]"
            }`}
        >
          {task.completed && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M1 4l2 2 4-4"
                stroke="#141412"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            className={`text-sm font-mono leading-snug
            ${task.completed ? "line-through text-[#555550]" : "text-[#e8e4dc]"}
          `}
          >
            {task.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Priority */}
            <span className={`text-xs font-mono font-bold ${priority.color}`}>
              {priority.label}
            </span>

            <span className="text-[#2a2a26]">|</span>

            {/* Category */}
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${categoryConfig[task.category] || categoryConfig.work}`}
            >
              {task.category}
            </span>

            {/* Deadline */}
            {task.deadline && (
              <>
                <span className="text-[#2a2a26]">|</span>
                <DeadlineBadge deadline={task.deadline} />
              </>
            )}

            {/* Schedule time */}
            {task.scheduleTime && (
              <>
                <span className="text-[#2a2a26]">|</span>
                <span className="text-xs font-mono text-[#555550]">
                  ⏰ {task.scheduleTime}
                </span>
              </>
            )}

            {/* Duration */}
            {task.duration && (
              <>
                <span className="text-[#2a2a26]">|</span>
                <span className="text-xs font-mono text-[#333330]">
                  {task.duration}m
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right side — score + delete */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Priority score */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-[#555550] bg-[#141412] px-2 py-1 rounded tabular-nums">
              {task.priorityScore ?? "—"}
            </span>
          </div>

          {/* Delete */}
          <button
            onClick={() => deleteTask(id)}
            className="text-[#2a2a26] hover:text-[#e85d4a] text-sm transition-colors opacity-0 group-hover:opacity-100"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Priority score bar — bottom */}
      {task.priorityScore && (
        <div className="mt-3 bg-[#141412] rounded-full h-0.5">
          <div
            className={`h-0.5 rounded-full transition-all duration-500 ${priority.bar}`}
            style={{ width: `${task.priorityScore}%` }}
          />
        </div>
      )}
    </div>
  );
}
