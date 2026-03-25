import { useState } from "react";
import { extractTasks } from "../services/claude";
import useTasks from "../store/useTasks";

export default function InputBox() {
  const [input, setInput] = useState("");
  const { addTasks, setLoading, isLoading } = useTasks();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const tasks = await extractTasks(input);
      addTasks(tasks);
      setInput("");
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4">
      <p className="text-[#555550] text-xs font-mono mb-2 uppercase tracking-widest">
        Raw Input
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='e.g. "Submit project by Friday, revise DSA, call client tomorrow"'
        className="w-full bg-transparent text-[#e8e4dc] text-sm font-mono resize-none outline-none placeholder-[#333330] min-h-[80px]"
      />
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2a2a26]">
        <span className="text-[#333330] text-xs font-mono">
          {input.length} chars
        </span>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="bg-[#f0a500] text-[#141412] text-xs font-mono font-bold px-4 py-2 rounded hover:bg-[#f0a500]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "PROCESSING..." : "EXTRACT TASKS →"}
        </button>
      </div>
    </div>
  );
}
