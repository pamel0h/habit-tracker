import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../shared/tokens';
import { Button } from '../shared/button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AuthService } from '../services/auth.service';
import { HabitService, Habit } from '../services/habit.service';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HabitItem from '../components/HabitItem';

export default function HomeScreen() {
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const today = new Date().toISOString().split('T')[0]; 

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          setUserLogin(user.login);
        } else {
          setUserLogin('');
        }
        const habits = await HabitService.getHabitsForDate(today);
        setHabits(habits);
      } catch (error) {
        console.error('Error loading data:', error);
        setUserLogin('');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const toggleHabit = async (id: number) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, isDone: !habit.isDone } : habit
    );
    setHabits(updatedHabits);
    await HabitService.saveHabitsForDate(today, updatedHabits);
  };

  const addHabit = async () => {
    if (newHabitName.trim()) {
      await HabitService.addHabit(today, newHabitName);
      const updatedHabits = await HabitService.getHabitsForDate(today);
      setHabits(updatedHabits);
      setNewHabitName('');
    }
  };

  const progress = habits.length
    ? Math.round((habits.filter(h => h.isDone).length / habits.length) * 100)
    : 0;

  if (userLogin === null) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.linearLayout}>
        <Text style={styles.welcome}>Привет, {userLogin || 'Гость'}!</Text>
        <Text style={styles.progress}>Прогресс: {progress}%</Text>
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
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop:60,
    
  },
  linearLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal:20,
    paddingBottom: 20,
  },
  welcome: {
    width:'100%',
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  progress: {
    color: Colors.blue,
    fontSize: 20,
    height: 320,
    backgroundColor:Colors.white,
    width:'100%',
    textAlign:'center',
    padding:20,
    borderRadius:20
  },
  myHabitList:{
    color:Colors.white
  },
  habitList: {
    width: '100%',
  },
  addHabit:{
    flexDirection:'row',
    gap:10,
    justifyContent:'space-between',
    width:'100%'

  },
  buttonAdd:{
    borderRadius:40,
    width:40,
    
  },
  input: {
    backgroundColor: Colors.white,
    color: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width:'85%',
    height:40
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});