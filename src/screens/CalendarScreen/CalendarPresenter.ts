import { HabitService, Habit } from '../../services/habit.service';
import { Colors } from '../../shared/tokens';

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
  closeEditModal(): void; // Добавлен метод
}

export class CalendarPresenter {
  private view: CalendarView;

  constructor(view: CalendarView) {
    this.view = view;
  }

  async onViewMounted(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      this.view.setSelectedDate(today);
      await this.loadHabits(today);
      await this.loadProgress();
      await HabitService.debugAsyncStorage();
    } catch (error) {
      console.error('Error in onViewMounted:', error);
      this.view.showError('Ошибка загрузки данных');
    }
  }

  private async loadHabits(date: string): Promise<void> {
    try {
      const habits = await HabitService.getHabitsForDate(date);
      this.view.setHabits(habits);
      console.log(`Loaded habits for ${date}:`, habits);
    } catch (error) {
      console.error('Error loading habits:', error);
      this.view.showError('Ошибка загрузки привычек');
    }
  }

  private async loadProgress(): Promise<void> {
    try {
      const dates: { [date: string]: { marked: boolean; dotColor: string } } = {};
      const allDates = await HabitService.getAllHabitDates();
      for (const date of allDates) {
        const habits = await HabitService.getHabitsForDate(date);
        if (habits.length > 0) {
          dates[date] = {
            marked: habits.some(h => h.isDone),
            dotColor: habits.some(h => h.isDone) ? Colors.blue : Colors.gray,
          };
        }
      }
      console.log('Updated markedDates:', dates);
      this.view.setMarkedDates(dates);
    } catch (error) {
      console.error('Error loading progress:', error);
      this.view.showError('Ошибка загрузки прогресса');
    }
  }

  async onDayPress(date: string): Promise<void> {
    try {
      this.view.setSelectedDate(date);
      const habits = await HabitService.getHabitsForDate(date);
      if (habits.length === 0) {
        console.log(`No habits for ${date}, attempting to copy from last day`);
        await HabitService.copyHabitsToNewDay(date);
      }
      await this.loadHabits(date);
      await this.loadProgress();
    } catch (error) {
      console.error('Error handling day press:', error);
      this.view.showError('Ошибка при выборе даты');
    }
  }

  async onToggleHabit(id: number): Promise<void> {
    try {
      const selectedDate = await HabitService.getLastHabitDate();
      if (!selectedDate) return;
      const habits = await HabitService.getHabitsForDate(selectedDate);
      const updatedHabits = habits.map(habit =>
        habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
      );
      this.view.setHabits(updatedHabits);
      await HabitService.saveHabitsForDate(selectedDate, updatedHabits);
      await this.loadProgress();
      await HabitService.debugAsyncStorage();
    } catch (error) {
      console.error('Error toggling habit:', error);
      this.view.showError('Ошибка при обновлении привычки');
    }
  }

  onEditHabit(habit: Habit): void {
    this.view.openEditModal(habit);
    this.view.setEditHabitName(habit.name);
  }

  async onSaveEditedHabit(id: number, newName: string): Promise<void> {
    try {
      const selectedDate = await HabitService.getLastHabitDate();
      if (!selectedDate || !newName.trim()) return;
      await HabitService.updateHabit(selectedDate, id, newName);
      await this.loadHabits(selectedDate);
      await this.loadProgress();
      this.view.closeEditModal();
    } catch (error) {
      console.error('Error updating habit:', error);
      this.view.showError('Ошибка при редактировании привычки');
    }
  }

  async onDeleteHabit(id: number): Promise<void> {
    try {
      const selectedDate = await HabitService.getLastHabitDate();
      if (!selectedDate) return;
      await HabitService.deleteHabit(selectedDate, id);
      await this.loadHabits(selectedDate);
      await this.loadProgress();
      this.view.closeEditModal();
    } catch (error) {
      console.error('Error deleting habit:', error);
      this.view.showError('Ошибка при удалении привычки');
    }
  }

  closeEditModal(): void {
    this.view.closeEditModal();
  }
}