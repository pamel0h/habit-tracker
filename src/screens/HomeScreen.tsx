import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { Colors } from '../shared/tokens';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../shared/button';
import HabitItem from '../components/HabitItem';
import { HabitService, Habit } from '../services/habit.service';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<{ login: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editHabitName, setEditHabitName] = useState('');
  const [pendingSave, setPendingSave] = useState<Habit[] | null>(null);
  const navigation = useNavigation();

  const getToday = () => new Date().toISOString().split('T')[0];

  const loadHabits = useCallback(async () => {
    const today = getToday();
    const loadedHabits = await HabitService.getHabitsForDate(today);
    setHabits(loadedHabits);
    const doneCount = loadedHabits.filter(h => h.isDone).length;
    setProgress(loadedHabits.length > 0 ? (doneCount / loadedHabits.length) * 100 : 0);
    console.log(`Loaded habits for ${today}:`, loadedHabits);
  }, []);

  const checkDayChange = useCallback(async () => {
  try {
    const today = getToday();
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
    await loadHabits();
    await HabitService.debugAsyncStorage();
  } catch (error) {
    console.error('Error in checkDayChange:', error);
  }
}, [loadHabits]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ login: parsedUser.login });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
    checkDayChange();
  }, [checkDayChange]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', checkDayChange);
    return unsubscribe;
  }, [navigation, checkDayChange]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (pendingSave) {
      timeout = setTimeout(async () => {
        try {
          const today = getToday();
          await HabitService.saveHabitsForDate(today, pendingSave);
          setPendingSave(null);
          await HabitService.debugAsyncStorage();
        } catch (error) {
          console.error('Error saving habits:', error);
        }
      }, 300);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pendingSave]);

  const addHabit = useCallback(async () => {
    if (!newHabitName.trim()) return;
    try {
      const today = getToday();
      await HabitService.addHabit(today, newHabitName);
      setNewHabitName('');
      await loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  }, [newHabitName, loadHabits]);

  const toggleHabit = useCallback(async (id: number) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
    );
    setHabits(updatedHabits);
    setPendingSave(updatedHabits);
    const doneCount = updatedHabits.filter(h => h.isDone).length;
    setProgress(updatedHabits.length > 0 ? (doneCount / updatedHabits.length) * 100 : 0);
  }, [habits]);

  const openEditModal = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitName(habit.name);
    setModalVisible(true);
  }, []);

  const saveEditedHabit = useCallback(async () => {
    if (!selectedHabit || !editHabitName.trim()) return;
    try {
      const today = getToday();
      await HabitService.updateHabit(today, selectedHabit.id, editHabitName);
      await loadHabits();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  }, [selectedHabit, editHabitName, loadHabits]);

  const deleteHabit = useCallback(async () => {
    if (!selectedHabit) return;
    try {
      const today = getToday();
      await HabitService.deleteHabit(today, selectedHabit.id);
      await loadHabits();
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }, [selectedHabit, loadHabits]);

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
          <Button style={styles.buttonAdd} text="+" onPress={addHabit} />
        </View>
        <Text style={styles.myHabitList}>Мои привычки</Text>
        <View style={styles.habitList}>
          {habits.map(habit => (
            <HabitItem
              key={habit.id}
              name={habit.name}
              isDone={habit.isDone}
              onToggle={() => toggleHabit(habit.id)}
              onEdit={() => openEditModal(habit)}
            />
          ))}
        </View>
      </ScrollView>
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