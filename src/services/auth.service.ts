import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  login: string;
  email: string;
  password: string;
};

export const AuthService = {
  // Основные методы (public)
  async register(userData: User): Promise<void> {
    const users = await this.getAllUsers();
    
    if (users.some(u => u.login === userData.login || u.email === userData.email)) {
      throw new Error('Пользователь уже существует');
    }

    if (!this.validateEmail(userData.email)) {
      throw new Error('Некорректный email');
    }

    await AsyncStorage.setItem('users', JSON.stringify([...users, userData]));
    await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
  },

  async login(loginOrEmail: string, password: string): Promise<User> {
    const users = await this.getAllUsers();
    const user = users.find(u => 
      (u.login === loginOrEmail || u.email === loginOrEmail) && 
      u.password === password
    );
    
    if (!user) throw new Error('Неверные данные');
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  async checkAuth(): Promise<User | null> {
    const user = await AsyncStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('currentUser'); // Удаляем пользователя
  },

  // Вспомогательные методы (условно "private")
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  async getAllUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
};