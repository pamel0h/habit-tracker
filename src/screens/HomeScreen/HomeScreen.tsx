import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Colors } from '../../shared/tokens';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../shared/button';
import HabitItem from '../../components/HabitItem';
import { Habit } from '../../services/habit.service';
import * as Progress from 'react-native-progress';
import { HomePresenter, HomeView } from './HomePresenter';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<{ login: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editHabitName, setEditHabitName] = useState('');
  const navigation = useNavigation();

  const presenter = new HomePresenter({
    setHabits,
    setProgress,
    setUser,
    setNewHabitName,
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
    const unsubscribe = navigation.addListener('focus', () => presenter.onViewMounted());
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.linearLayout}>
        <Text style={styles.welcome}>Привет, {user?.login || 'Гость'}!</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Прогресс за сегодня</Text>
          <View style={styles.progressCircleContainer}>
            <Progress.Circle
              size={200}
              progress={progress / 100}
              thickness={10}
              color={Colors.blue}
              unfilledColor={Colors.white}
              borderWidth={0}
              showsText={false}
            />
            <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
          </View>
        </View>
        <View style={styles.addHabit}>
          <TextInput
            style={styles.input}
            placeholder="Новая привычка..."
            placeholderTextColor={Colors.gray}
            value={newHabitName}
            onChangeText={setNewHabitName}
          />
          <Button style={styles.buttonAdd} text="+" onPress={() => presenter.onAddHabit(newHabitName)} />
        </View>
        <Text style={styles.myHabitList}>Мои привычки</Text>
        <View style={styles.habitList}>
          {habits.map(habit => (
            <HabitItem
              key={habit.id}
              name={habit.name}
              isDone={habit.isDone}
              onToggle={() => presenter.onToggleHabit(habit.id)}
              onEdit={() => presenter.onEditHabit(habit)}
            />
          ))}
        </View>
      </ScrollView>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: 60,
  },
  linearLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcome: {
    width: '100%',
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressLabel: {
    color: Colors.black,
    fontSize: 24,
    marginBottom: 10,
  },
  progressCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    color: Colors.black,
    fontSize: 34,
    fontWeight: 'bold',
  },
  myHabitList: {
    color: Colors.white,
  },
  habitList: {
    width: '100%',
  },
  addHabit: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonAdd: {
    borderRadius: 40,
    width: 40,
  },
  input: {
    backgroundColor: Colors.white,
    color: Colors.black,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '85%',
    height: 40,
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