import useTasks from "../store/useTasks";

const priorityColor = {
  high: "text-[#e85d4a]",
  medium: "text-[#f0a500]",
  low: "text-[#6a9e6a]",
};

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function Schedule() {
  const { tasks } = useTasks();

  const todayStr = new Date().toDateString();
  const nowMinutes = getNowMinutes();

  const todayTasks = tasks
    .filter((t) => {
      if (!t.scheduleTime || t.completed) return false;
      // Show if deadline is today OR no deadline (just has a time slot)
      if (t.deadline) {
        return new Date(t.deadline).toDateString() === todayStr;
      }
      return true;
    })
    .sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));

  const upcoming = todayTasks.filter(
    (t) => timeToMinutes(t.scheduleTime) >= nowMinutes,
  );
  const past = todayTasks.filter(
    (t) => timeToMinutes(t.scheduleTime) < nowMinutes,
  );

  const id = (t) => t._id || t.id;

  return (
    <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest">
          Today's Schedule
        </p>
        <span className="text-[#333330] text-xs font-mono">
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {todayTasks.length === 0 ? (
        <p className="text-[#333330] text-xs font-mono leading-relaxed">
          No scheduled tasks today.{" "}
          <span className="text-[#444440]">
            Add tasks with a time like "call client at 3pm".
          </span>
        </p>
      ) : (
        <div className="flex flex-col">
          {/* Upcoming */}
          {upcoming.map((task, i) => (
            <div
              key={id(task)}
              className="flex gap-3 items-start py-2 border-b border-[#2a2a26] last:border-0"
            >
              <div className="flex flex-col items-center shrink-0 w-12">
                <span className="text-[#f0a500] text-xs font-mono">
                  {task.scheduleTime}
                </span>
                {i < upcoming.length - 1 && (
                  <div className="w-px h-4 bg-[#2a2a26] mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-[#e8e4dc] leading-snug">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-mono ${priorityColor[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                  {task.duration && (
                    <span className="text-[#333330] text-xs font-mono">
                      · {task.duration}m
                    </span>
                  )}
                </div>
              </div>
              {/* "Next" indicator for the first upcoming task */}
              {i === 0 && (
                <span className="text-[10px] font-mono bg-[#f0a500]/10 text-[#f0a500] px-1.5 py-0.5 rounded shrink-0">
                  NEXT
                </span>
              )}
            </div>
          ))}

          {/* Past tasks — dimmed */}
          {past.length > 0 && (
            <>
              <p className="text-[#2a2a26] text-xs font-mono uppercase tracking-widest mt-3 mb-1">
                Earlier
              </p>
              {past.map((task) => (
                <div
                  key={id(task)}
                  className="flex gap-3 items-start py-2 opacity-30"
                >
                  <span className="text-[#555550] text-xs font-mono w-12 shrink-0">
                    {task.scheduleTime}
                  </span>
                  <p className="text-xs font-mono text-[#555550] line-through">
                    {task.title}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
