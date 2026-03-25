import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTasks = create(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      filter: "all", // all | today | completed

      setLoading: (val) => set({ isLoading: val }),

      addTasks: (newTasks) =>
        set((state) => {
          const existingIds = new Set(state.tasks.map((t) => t.id));
          const filtered = newTasks.filter((t) => !existingIds.has(t.id));
          return { tasks: [...state.tasks, ...filtered] };
        }),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
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
      name: "flowos-storage", // Ye tere data ko local storage mein save rakhega
      partialize: (state) => ({ tasks: state.tasks }), // Sirf tasks save karenge, loading state nahi
    },
  ),
);

export default useTasks;
