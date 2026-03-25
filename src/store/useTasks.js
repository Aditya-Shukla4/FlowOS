import { create } from "zustand";
import { persist } from "zustand/middleware";
import { extractTasksAPI } from "../services/api";

const getId = (t) => t._id || t.id;

const useTasks = create(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      filter: "all",

      setLoading: (val) => set({ isLoading: val }),
      setError: (msg) => set({ error: msg }),

      addTasksFromAI: async (rawInput) => {
        set({ isLoading: true, error: null });
        try {
          const savedTasks = await extractTasksAPI(rawInput);
          set((state) => {
            const existingIds = new Set(state.tasks.map(getId));
            const fresh = savedTasks.filter((t) => !existingIds.has(getId(t)));
            return { tasks: [...state.tasks, ...fresh] };
          });
          return { success: true, count: savedTasks.length };
        } catch (err) {
          console.error("API Error:", err);
          set({
            error:
              err.message || "Failed to extract tasks. Check your connection.",
          });
          return { success: false };
        } finally {
          set({ isLoading: false });
        }
      },

      addTasks: (newTasks) =>
        set((state) => {
          const existingIds = new Set(state.tasks.map(getId));
          const fresh = newTasks.filter((t) => !existingIds.has(getId(t)));
          return { tasks: [...state.tasks, ...fresh] };
        }),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            getId(t) === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => getId(t) !== id),
        })),

      setFilter: (filter) => set({ filter }),
      clearAllTasks: () => set({ tasks: [], error: null }),

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        const today = new Date().toDateString();
        if (filter === "today")
          return tasks.filter(
            (t) => t.deadline && new Date(t.deadline).toDateString() === today,
          );
        if (filter === "completed") return tasks.filter((t) => t.completed);
        if (filter === "high")
          return tasks.filter((t) => t.priority === "high");
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
