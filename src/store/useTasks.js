import { create } from "zustand";
import { persist } from "zustand/middleware";
import { extractTasksAPI } from "../services/api"; // Ye zaroori hai!

const useTasks = create(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      filter: "all",

      setLoading: (val) => set({ isLoading: val }),

      // 🔥 YE HAI TERA MERN EDGE!
      // Ab ye frontend pe extraction nahi karega, backend se mangwayega
      addTasksFromAI: async (rawInput) => {
        set({ isLoading: true });
        try {
          const savedTasks = await extractTasksAPI(rawInput); // Backend API Call
          set((state) => {
            const existingIds = new Set(state.tasks.map((t) => t.id || t._id));
            const filtered = savedTasks.filter(
              (t) => !existingIds.has(t.id || t._id),
            );
            return { tasks: [...state.tasks, ...filtered] };
          });
        } catch (err) {
          console.error("MERN Integration Error:", err);
          alert("Backend se connect nahi ho paya bhai!");
        } finally {
          set({ isLoading: false });
        }
      },

      // Normal manual add ke liye purana function rehne de
      addTasks: (newTasks) =>
        set((state) => {
          const existingIds = new Set(state.tasks.map((t) => t.id || t._id));
          const filtered = newTasks.filter(
            (t) => !existingIds.has(t.id || t._id),
          );
          return { tasks: [...state.tasks, ...filtered] };
        }),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id || t._id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id && t._id !== id),
        })),

      setFilter: (filter) => set({ filter }),
      clearAllTasks: () => set({ tasks: [] }),

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        const today = new Date().toDateString();
        if (filter === "today")
          return tasks.filter(
            (t) => t.deadline && new Date(t.deadline).toDateString() === today,
          );
        if (filter === "completed") return tasks.filter((t) => t.completed);
        return tasks;
      },
    }),
    {
      name: "flowos-storage",
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
);

export default useTasks;
