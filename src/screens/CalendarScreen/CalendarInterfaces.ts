import { Habit } from '../../services/habit.service';

export interface CalendarView {
  setMarkedDates(dates: { [date: string]: { marked: boolean; dotColor: string } }): void;
  setSelectedDate(date: string | null): void;
  setHabits(habits: Habit[]): void;
  openEditModal(habit: Habit): void;
  closeEditModal(): void;
  setEditHabitName(name: string): void;
  showError(error: string): void;
}

export interface CalendarPresenter {
  onViewMounted(): void;
  onDayPress(date: string): void;
  onToggleHabit(id: number): void;
  onEditHabit(habit: Habit): void;
  onSaveEditedHabit(id: number, newName: string): void;
  onDeleteHabit(id: number): void;
}