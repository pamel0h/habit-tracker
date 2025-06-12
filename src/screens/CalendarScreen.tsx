import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Modal, TextInput } from 'react-native';
import { Colors } from '../shared/tokens';
import { Calendar, DateData } from 'react-native-calendars';
import { HabitService, Habit } from '../services/habit.service';
import HabitItem from '../components/HabitItem';
import { Button } from '../shared/button';

type MarkedDates = {
  [date: string]: { marked: boolean; dotColor: string };
};

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editHabitName, setEditHabitName] = useState('');

  const loadProgress = useCallback(async () => {
  try {
    const dates: MarkedDates = {};
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
    setMarkedDates(dates);
  } catch (error) {
    console.error('Error loading progress:', error);
  }
}, []);



  const loadHabits = useCallback(async (date: string) => {
    const habits = await HabitService.getHabitsForDate(date);
    setHabits(habits);
    console.log(`Loaded habits for ${date}:`, habits);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    loadHabits(today);
    loadProgress();
    HabitService.debugAsyncStorage();
  }, [loadHabits, loadProgress]);

  const handleDayPress = useCallback(async (day: DateData) => {
  try {
    const date = day.dateString;
    setSelectedDate(date);
    // Проверяем, есть ли привычки для выбранной даты, если нет — копируем из последнего дня
    const habits = await HabitService.getHabitsForDate(date);
    if (habits.length === 0) {
      console.log(`No habits for ${date}, attempting to copy from last day`);
      await HabitService.copyHabitsToNewDay(date);
    }
    await loadHabits(date);
    await loadProgress();
  } catch (error) {
    console.error('Error handling day press:', error);
  }
}, [loadHabits, loadProgress]);

  const toggleHabit = useCallback(async (id: number) => {
    if (!selectedDate) return;
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
    );
    setHabits(updatedHabits);
    await HabitService.saveHabitsForDate(selectedDate, updatedHabits);
    await loadProgress();
    await HabitService.debugAsyncStorage();
  }, [habits, selectedDate, loadProgress]);

  const openEditModal = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitName(habit.name);
    setModalVisible(true);
  }, []);

  const saveEditedHabit = useCallback(async () => {
    if (!selectedHabit || !editHabitName.trim() || !selectedDate) return;
    try {
      await HabitService.updateHabit(selectedDate, selectedHabit.id, editHabitName);
      await loadHabits(selectedDate);
      await loadProgress();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  }, [selectedHabit, editHabitName, selectedDate, loadHabits, loadProgress]);

  const deleteHabit = useCallback(async () => {
    if (!selectedHabit || !selectedDate) return;
    try {
      await HabitService.deleteHabit(selectedDate, selectedHabit.id);
      await loadHabits(selectedDate);
      await loadProgress();
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }, [selectedHabit, selectedDate, loadHabits, loadProgress]);

  return (
    <View style={styles.container}>
      <View style={styles.relativeLayout}>
        <Text style={styles.title}>Календарь прогресса</Text>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          initialDate={new Date().toISOString().split('T')[0]}
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
                    onEdit={() => openEditModal(habit)}
                  />
                ))
              ) : (
                <Text style={styles.noHabits}>Нет привычек за этот день</Text>
              )}
            </ScrollView>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Редактировать привычку</Text>
              <TextInput
                style={styles.modalInput}
                value={editHabitName}
                onChangeText={setEditHabitName}
                placeholder="Название привычки"
                placeholderTextColor={Colors.gray}
              />
              <View style={styles.modalButtons}>
                <Button text="Сохранить" onPress={saveEditedHabit} />
                <Button text="Удалить" onPress={deleteHabit} style={styles.deleteButton} />
                <Button text="Отмена" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: 60,
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
    paddingBottom: 20,
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
  containerHabits: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 20,
  },
  habitList: {
    flexDirection: 'column',
    gap: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    gap: 20,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: Colors.white,
    color: Colors.black,
    padding: 10,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  deleteButton: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
  },
});