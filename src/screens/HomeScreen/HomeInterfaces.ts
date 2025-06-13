import { Habit } from '../../services/habit.service';

export interface HomeView {
  setHabits(habits: Habit[]): void;
  setProgress(progress: number): void;
  setUser(user: { login: string } | null): void;
  setNewHabitName(name: string): void;
  openEditModal(habit: Habit): void;
  closeEditModal(): void;
  setEditHabitName(name: string): void;
  showError(error: string): void;
}

export interface HomePresenter {
  onViewMounted(): void;
  onAddHabit(name: string): void;
  onToggleHabit(id: number): void;
  onEditHabit(habit: Habit): void;
  onSaveEditedHabit(id: number, newName: string): void;
  onDeleteHabit(id: number): void;
}