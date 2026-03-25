import { useState } from "react";
import useTasks from "../store/useTasks";

export default function InputBox() {
  const [input, setInput] = useState("");
  const { addTasksFromAI, isLoading, error } = useTasks();

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const result = await addTasksFromAI(input);
    if (result?.success) setInput("");
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <div className="bg-[#1f1f1c] border border-[#2a2a26] rounded-lg p-4">
      <p className="text-[#555550] text-xs font-mono mb-2 uppercase tracking-widest">
        Raw Input
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='e.g. "Submit project by Friday, revise DSA, call client tomorrow"'
        className="w-full bg-transparent text-[#e8e4dc] text-sm font-mono resize-none outline-none placeholder-[#333330] min-h-[80px]"
      />

      {error && (
        <p className="text-[#e85a5a] text-xs font-mono mt-2 bg-[#2a1010] border border-[#5a2020] rounded px-3 py-2">
          ⚠ {error}
        </p>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2a2a26]">
        <span className="text-[#333330] text-xs font-mono">
          {input.length} chars · Ctrl+Enter to submit
        </span>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="bg-[#f0a500] text-[#141412] text-xs font-mono font-bold px-4 py-2 rounded hover:bg-[#f0a500]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-3 h-3 border border-[#141412] border-t-transparent rounded-full" />
              PROCESSING...
            </span>
          ) : (
            "EXTRACT TASKS →"
          )}
        </button>
      </div>
    </div>
  );
}
