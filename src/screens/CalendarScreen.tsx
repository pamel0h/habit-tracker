import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Colors } from '../shared/tokens';
import { Calendar, DateData } from 'react-native-calendars';
import { HabitService, Habit } from '../services/habit.service';
import HabitItem from '../components/HabitItem';

type MarkedDates = {
  [date: string]: { marked: boolean; dotColor: string };
};

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      const dates: MarkedDates = {};
      const today = new Date().toISOString().split('T')[0];
      const habits = await HabitService.getHabitsForDate(today);
      if (habits.some(h => h.isDone)) {
        dates[today] = { marked: true, dotColor: Colors.blue };
      }
      setMarkedDates(dates);
    };

    loadProgress();
  }, []);

  // Загружаем привычки при выборе даты
  const handleDayPress = async (day: DateData) => {
    const date = day.dateString; // Формат: YYYY-MM-DD
    setSelectedDate(date);
    const habits = await HabitService.getHabitsForDate(date);
    setHabits(habits);
  };

  const toggleHabit = async (id: number) => {
    if (!selectedDate) return;
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
    );
    setHabits(updatedHabits);
    await HabitService.saveHabitsForDate(selectedDate, updatedHabits);

    const dates = { ...markedDates };
    if (updatedHabits.some(h => h.isDone)) {
      dates[selectedDate] = { marked: true, dotColor: Colors.blue };
    } else {
      delete dates[selectedDate];
    }
    setMarkedDates(dates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.relativeLayout}>
        <Text style={styles.title}>Календарь прогресса</Text>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: Colors.black,
            calendarBackground: Colors.white,
            textSectionTitleColor: Colors.blue,
            selectedDayBackgroundColor: Colors.blue,
            selectedDayTextColor: Colors.white,
            todayTextColor: Colors.blue,
            dayTextColor: Colors.black,
            textDisabledColor: Colors.gray,
            dotColor: Colors.blue,
            selectedDotColor: Colors.white,
            arrowColor: Colors.gray,
          }}
        />
        <Text style={styles.note}>Точки обозначают дни с выполненными привычками</Text>
        <View style={styles.containerHabits}>
            {selectedDate && (
            <ScrollView contentContainerStyle={styles.habitList}>
                <Text style={styles.dateTitle}>Привычки за {selectedDate}</Text>
                {habits.length > 0 ? (
                habits.map(habit => (
                    <HabitItem
                    key={habit.id}
                    name={habit.name}
                    isDone={habit.isDone}
                    onToggle={() => toggleHabit(habit.id)}
                    />
                ))
                ) : (
                <Text style={styles.noHabits}>Нет привычек за этот день</Text>
                )}
            </ScrollView>
            )}
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop:60,
  },
  relativeLayout: {
    flex: 1,
    position: 'relative',
    padding: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
    paddingBottom:20
  },
  note: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  containerHabits:{
    flex:1,
    paddingTop:5,
    paddingBottom: 20,
  },
  habitList: {
    flexDirection:'column',
    gap:10,
  },
  dateTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noHabits: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
});