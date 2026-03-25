import useTasks from "../store/useTasks";

export default function Calendar() {
  const { tasks, setFilter } = useTasks();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Map deadline dates to task counts
  const deadlineMap = {};
  tasks.forEach((t) => {
    if (!t.deadline) return;
    const d = new Date(t.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!deadlineMap[day]) deadlineMap[day] = { total: 0, high: false };
      deadlineMap[day].total += 1;
      if (t.priority === "high") deadlineMap[day].high = true;
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#555550] text-xs font-mono uppercase tracking-widest">
          Calendar
        </p>
        <span className="text-[#888880] text-xs font-mono">{monthName}</span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayHeaders.map((d) => (
          <div
            key={d}
            className="text-center text-[#333330] text-xs font-mono py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const isToday = day === today;
          const info = deadlineMap[day];
          return (
            <div
              key={day}
              onClick={() => info && setFilter("today")}
              className={`relative aspect-square flex flex-col items-center justify-center rounded text-xs font-mono transition-colors
                ${isToday ? "bg-[#f0a500] text-[#141412] font-bold" : "text-[#888880] hover:bg-[#2a2a26]"}
                ${info && !isToday ? "text-[#e8e4dc]" : ""}
                ${info ? "cursor-pointer" : ""}
              `}
            >
              {day}
              {info && (
                <span
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full
                    ${info.high ? "bg-[#e85d4a]" : "bg-[#f0a500]"}
                    ${isToday ? "bg-[#141412]" : ""}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-[#2a2a26]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e85d4a] inline-block" />
          <span className="text-[#333330] text-xs font-mono">
            High priority
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] inline-block" />
          <span className="text-[#333330] text-xs font-mono">Has tasks</span>
        </div>
      </div>
    </div>
  );
}
