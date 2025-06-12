import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
  id: number;
  name: string;
  isDone: boolean;
  date: string;
};

export class HabitService {
  static async getHabitsForDate(date: string): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(`habits_${date}`);
      console.log(`Fetching habits for ${date}:`, habitsJson);
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error(`Error fetching habits for ${date}:`, error);
      return [];
    }
  }

  static async saveHabitsForDate(date: string, habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`habits_${date}`, JSON.stringify(habits));
      console.log(`Saved habits for ${date}:`, habits);
    } catch (error) {
      console.error(`Error saving habits for ${date}:`, error);
      throw error;
    }
  }

  static async addHabit(date: string, name: string): Promise<void> {
    try {
      const habits = await this.getHabitsForDate(date);
      const newHabit: Habit = {
        id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
        name,
        isDone: false,
        date,
      };
      habits.push(newHabit);
      await this.saveHabitsForDate(date, habits);
      console.log(`Added habit: ${name} for ${date}`);
    } catch (error) {
      console.error(`Error adding habit ${name} for ${date}:`, error);
      throw error;
    }
  }

  static async deleteHabit(date: string, id: number): Promise<void> {
    try {
      const habits = await this.getHabitsForDate(date);
      const updatedHabits = habits.filter(habit => habit.id !== id);
      await this.saveHabitsForDate(date, updatedHabits);
      console.log(`Deleted habit with id ${id} for ${date}`);
    } catch (error) {
      console.error(`Error deleting habit with id ${id} for ${date}:`, error);
      throw error;
    }
  }

  static async updateHabit(date: string, id: number, newName: string): Promise<void> {
    try {
      const habits = await this.getHabitsForDate(date);
      const updatedHabits = habits.map(habit =>
        habit.id === id ? { ...habit, name: newName } : habit
      );
      await this.saveHabitsForDate(date, updatedHabits);
      console.log(`Updated habit with id ${id} to ${newName} for ${date}`);
    } catch (error) {
      console.error(`Error updating habit with id ${id} for ${date}:`, error);
      throw error;
    }
  }

  static async getAllHabitDates(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const habitDates = keys
        .filter(key => key.startsWith('habits_'))
        .map(key => key.replace('habits_', ''))
        .sort();
      console.log('All habit dates:', habitDates);
      return habitDates;
    } catch (error) {
      console.error('Error fetching habit dates:', error);
      return [];
    }
  }

  static async getLastHabitDate(): Promise<string | null> {
    try {
      const dates = await this.getAllHabitDates();
      return dates.length > 0 ? dates[dates.length - 1] : null;
    } catch (error) {
      console.error('Error fetching last habit date:', error);
      return null;
    }
  }

  static async copyHabitsToNewDay(newDate: string): Promise<void> {
  try {
    // Проверяем, есть ли уже привычки для новой даты
    const existingHabits = await this.getHabitsForDate(newDate);
    if (existingHabits.length > 0) {
      console.log(`Habits already exist for ${newDate}, skipping copy`);
      return;
    }

    const lastDate = await this.getLastHabitDate();
    if (!lastDate) {
      console.log('No previous habits to copy');
      return;
    }
    const prevHabits = await this.getHabitsForDate(lastDate);
    if (prevHabits.length === 0) {
      console.log(`No habits found for ${lastDate}`);
      return;
    }
    const newHabits = prevHabits.map(habit => ({
      ...habit,
      isDone: false,
      date: newDate,
    }));
    await this.saveHabitsForDate(newDate, newHabits);
    console.log(`Copied ${newHabits.length} habits from ${lastDate} to ${newDate}`);
  } catch (error) {
    console.error(`Error copying habits to ${newDate}:`, error);
    throw error;
  }
}

  static async debugAsyncStorage(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage keys:', keys);
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`Key: ${key}, Value:`, value);
      }
    } catch (error) {
      console.error('Error debugging AsyncStorage:', error);
    }
  }
}