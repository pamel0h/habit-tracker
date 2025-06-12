import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, HabitService } from '../services/habit.service';

type HabitContextType = {
  habits: { [date: string]: Habit[] };
  loadHabits: (date: string) => Promise<void>;
  addHabit: (date: string, name: string) => Promise<void>;
  toggleHabit: (date: string, id: number) => Promise<void>;
  updateHabit: (date: string, id: number, name: string) => Promise<void>;
  deleteHabit: (date: string, id: number) => Promise<void>;
};

export const HabitContext = createContext<HabitContextType>({
  habits: {},
  loadHabits: async () => {},
  addHabit: async () => {},
  toggleHabit: async () => {},
  updateHabit: async () => {},
  deleteHabit: async () => {},
});

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<{ [date: string]: Habit[] }>({});

  const loadHabits = useCallback(async (date: string) => {
    try {
      const loadedHabits = await HabitService.getHabitsForDate(date);
      setHabits(prev => ({ ...prev, [date]: loadedHabits }));
    } catch (error) {
      console.error(`Error loading habits for ${date}:`, error);
    }
  }, []);

  const addHabit = useCallback(async (date: string, name: string) => {
    try {
      await HabitService.addHabit(date, name);
      await loadHabits(date);
    } catch (error) {
      console.error(`Error adding habit for ${date}:`, error);
    }
  }, [loadHabits]);

  const toggleHabit = useCallback(async (date: string, id: number) => {
    try {
      const currentHabits = habits[date] || [];
      const updatedHabits = currentHabits.map(habit =>
        habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
      );
      setHabits(prev => ({ ...prev, [date]: updatedHabits }));
      await HabitService.saveHabitsForDate(date, updatedHabits);
    } catch (error) {
      console.error(`Error toggling habit for ${date}:`, error);
    }
  }, [habits]);

  const updateHabit = useCallback(async (date: string, id: number, name: string) => {
    try {
      await HabitService.updateHabit(date, id, name);
      await loadHabits(date);
    } catch (error) {
      console.error(`Error updating habit for ${date}:`, error);
    }
  }, [loadHabits]);

  const deleteHabit = useCallback(async (date: string, id: number) => {
    try {
      await HabitService.deleteHabit(date, id);
      await loadHabits(date);
    } catch (error) {
      console.error(`Error deleting habit for ${date}:`, error);
    }
  }, [loadHabits]);

  const contextValue = useMemo(() => ({
    habits,
    loadHabits,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
  }), [habits, loadHabits, addHabit, toggleHabit, updateHabit, deleteHabit]);

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};