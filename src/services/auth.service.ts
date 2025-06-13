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
    console.log('Registered user:', userData); // Отладочный лог
  },

  async login(loginOrEmail: string, password: string): Promise<User> {
    const users = await this.getAllUsers();
    console.log('All users:', users); // Отладочный лог
    const user = users.find(u => 
      (u.login === loginOrEmail || u.email === loginOrEmail) && 
      u.password === password
    );
    
    if (!user) {
      console.log('Login attempt failed - no user found for:', loginOrEmail, 'with password:', password); // Отладочный лог
      throw new Error('Неверные данные');
    }
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Logged in user:', user); // Отладочный лог
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
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email.toLowerCase());
  },

  async getAllUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
};