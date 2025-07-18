import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '../../shared/tokens';
import { Calendar, DateData } from 'react-native-calendars';
import { Habit } from '../../services/habit.service';
import HabitItem from '../../components/HabitItem';
import { Button } from '../../shared/button';
import { CalendarPresenter, CalendarView } from './CalendarPresenter';

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

  const presenter = new CalendarPresenter({
    setMarkedDates,
    setSelectedDate,
    setHabits,
    openEditModal: (habit: Habit) => {
      setSelectedHabit(habit);
      setModalVisible(true);
    },
    closeEditModal: () => setModalVisible(false),
    setEditHabitName,
    showError: (error: string) => Alert.alert('Ошибка', error),
  });

  useEffect(() => {
    presenter.onViewMounted();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.relativeLayout}>
        <Text style={styles.title}>Календарь прогресса</Text>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          onDayPress={(day: DateData) => presenter.onDayPress(day.dateString)}
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
                    onToggle={() => presenter.onToggleHabit(habit.id)}
                    onEdit={() => presenter.onEditHabit(habit)}
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
          onRequestClose={() => presenter.closeEditModal()}
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
                <Button text="Сохранить" onPress={() => selectedHabit && presenter.onSaveEditedHabit(selectedHabit.id, editHabitName)} />
                <Button text="Удалить" onPress={() => selectedHabit && presenter.onDeleteHabit(selectedHabit.id)} style={styles.deleteButton} />
                <Button text="Отмена" onPress={() => presenter.closeEditModal()} />
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