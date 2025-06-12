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
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  }

  static async saveHabitsForDate(date: string, habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`habits_${date}`, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }

  static async addHabit(date: string, name: string): Promise<void> {
    const habits = await this.getHabitsForDate(date);
    const newHabit: Habit = {
      id: habits.length + 1,
      name,
      isDone: false,
      date,
    };
    habits.push(newHabit);
    await this.saveHabitsForDate(date, habits);
  }
}