import useTasks from "../store/useTasks";

const priorityColors = {
  high: "text-[#e85d4a]",
  medium: "text-[#f0a500]",
  low: "text-[#6a9e6a]",
};

const categoryColors = {
  work: "bg-[#f0a500]/10 text-[#f0a500]",
  study: "bg-[#4a8ae8]/10 text-[#4a8ae8]",
  personal: "bg-[#9e6ae8]/10 text-[#9e6ae8]",
  health: "bg-[#6a9e6a]/10 text-[#6a9e6a]",
};

export default function TaskCard({ task }) {
  const { toggleComplete, deleteTask } = useTasks();

  return (
    <div
      className={`bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4 transition-opacity ${task.completed ? "opacity-40" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleComplete(task.id)}
          className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors
            ${task.completed ? "bg-[#f0a500] border-[#f0a500]" : "border-[#444440] hover:border-[#f0a500]"}`}
        >
          {task.completed && <span className="text-[#141412] text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-mono ${task.completed ? "line-through text-[#555550]" : "text-[#e8e4dc]"}`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`text-xs font-mono font-bold uppercase ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
            <span className="text-[#333330] text-xs">·</span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${categoryColors[task.category] || categoryColors.work}`}
            >
              {task.category}
            </span>
            {task.deadline && (
              <>
                <span className="text-[#333330] text-xs">·</span>
                <span className="text-xs font-mono text-[#555550]">
                  📅 {task.deadline}
                </span>
              </>
            )}
            {task.scheduleTime && (
              <>
                <span className="text-[#333330] text-xs">·</span>
                <span className="text-xs font-mono text-[#555550]">
                  ⏰ {task.scheduleTime}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-[#555550] bg-[#141412] px-2 py-1 rounded">
            {task.priorityScore}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-[#333330] hover:text-[#e85d4a] text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
