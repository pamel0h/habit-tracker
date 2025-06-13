import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitService, Habit } from '../../services/habit.service';

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
  closeEditModal(): void; // Добавлен метод
}

export class HomePresenter {
  private view: HomeView;

  constructor(view: HomeView) {
    this.view = view;
  }

  private getToday = () => new Date().toISOString().split('T')[0];

  async onViewMounted(): Promise<void> {
    try {
      await this.loadUser();
      await this.checkDayChange();
    } catch (error) {
      console.error('Error in onViewMounted:', error);
      this.view.showError('Ошибка загрузки данных');
    }
  }

  private async loadUser(): Promise<void> {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        this.view.setUser({ login: parsedUser.login });
      } else {
        this.view.setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.view.setUser(null);
    }
  }

  private async loadHabits(): Promise<void> {
    const today = this.getToday();
    const habits = await HabitService.getHabitsForDate(today);
    this.view.setHabits(habits);
    const doneCount = habits.filter(h => h.isDone).length;
    const progress = habits.length > 0 ? (doneCount / habits.length) * 100 : 0;
    this.view.setProgress(progress);
    console.log(`Loaded habits for ${today}:`, habits);
  }

  private async checkDayChange(): Promise<void> {
    try {
      const today = this.getToday();
      console.log('Checking day change. Today:', today);
      const storedDate = await AsyncStorage.getItem('lastCheckedDate');
      console.log('Stored last checked date:', storedDate);

      if (storedDate !== today) {
        console.log('New day detected, copying habits to:', today);
        await HabitService.copyHabitsToNewDay(today);
        await AsyncStorage.setItem('lastCheckedDate', today);
        console.log('Habits copied and lastCheckedDate updated to:', today);
      } else {
        console.log('No day change, loading existing habits for:', today);
      }
      await this.loadHabits();
      await HabitService.debugAsyncStorage();
    } catch (error) {
      console.error('Error in checkDayChange:', error);
      this.view.showError('Ошибка при проверке смены дня');
    }
  }

  async onAddHabit(name: string): Promise<void> {
    if (!name.trim()) return;
    try {
      const today = this.getToday();
      await HabitService.addHabit(today, name);
      this.view.setNewHabitName('');
      await this.loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      this.view.showError('Ошибка при добавлении привычки');
    }
  }

  async onToggleHabit(id: number): Promise<void> {
    try {
      const habits = await HabitService.getHabitsForDate(this.getToday());
      const updatedHabits = habits.map(habit =>
        habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
      );
      this.view.setHabits(updatedHabits);
      await HabitService.saveHabitsForDate(this.getToday(), updatedHabits);
      const doneCount = updatedHabits.filter(h => h.isDone).length;
      const progress = updatedHabits.length > 0 ? (doneCount / updatedHabits.length) * 100 : 0;
      this.view.setProgress(progress);
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
    if (!newName.trim()) return;
    try {
      const today = this.getToday();
      await HabitService.updateHabit(today, id, newName);
      await this.loadHabits();
      this.view.closeEditModal();
    } catch (error) {
      console.error('Error updating habit:', error);
      this.view.showError('Ошибка при редактировании привычки');
    }
  }

  async onDeleteHabit(id: number): Promise<void> {
    try {
      const today = this.getToday();
      await HabitService.deleteHabit(today, id);
      await this.loadHabits();
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