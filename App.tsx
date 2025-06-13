import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AuthScreen from './src/screens/AuthScreen/AuthScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import { AuthService } from './src/services/auth.service';
import { Colors } from './src/shared/tokens';
import ApiScreen from './src/screens/ApiScreen/ApiScreen';
import { HabitService } from './src/services/habit.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitProvider } from './src/context/HabitContext';

type User = {
  login: string;
  email: string;
  password: string;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type IconName = 'home' | 'home-outline' | 'calendar' | 'calendar-outline' | 'person' | 'person-outline' | 'cloud' | 'cloud-outline';

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Api') {
            iconName = focused ? 'cloud' : 'cloud-outline';
          } else {
            iconName = 'home';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: { backgroundColor: Colors.black },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: 'Главная' }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false, title: 'Календарь' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: 'Профиль' }}
      />
      <Tab.Screen
        name="Api"
        component={ApiScreen}
        options={{ headerShown: false, title: 'API' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthenticationAndDay = async () => {
      try {
        const currentUser = await AuthService.checkAuth();
        setUser(currentUser);

        // Проверяем смену дня при запуске приложения
        const today = new Date().toISOString().split('T')[0];
        const storedDate = await AsyncStorage.getItem('lastCheckedDate');
        if (storedDate !== today) {
          console.log('App: New day detected, copying habits to:', today);
          await HabitService.copyHabitsToNewDay(today);
          await AsyncStorage.setItem('lastCheckedDate', today);
          console.log('App: Habits copied and lastCheckedDate updated to:', today);
        }
      } catch (error) {
        console.error('App: Error in checkAuthenticationAndDay:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthenticationAndDay();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <HabitProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? 'Main' : 'Auth'}>
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </HabitProvider>
  );
}