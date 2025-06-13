import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../../services/auth.service';

export interface ProfileView {
  setUser(user: { login: string; email: string } | null): void;
  showError(error: string): void;
  navigateToAuth(): void;
}

export interface ProfilePresenter {
  onViewMounted(): void;
  onLogout(): void;
}

export class ProfilePresenter {
  private view: ProfileView;

  constructor(view: ProfileView) {
    this.view = view;
  }

  async onViewMounted(): Promise<void> {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        this.view.setUser({ login: parsedUser.login, email: parsedUser.email });
      } else {
        this.view.setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.view.showError('Ошибка загрузки данных пользователя');
    }
  }

  async onLogout(): Promise<void> {
    try {
      await AuthService.logout();
      this.view.navigateToAuth();
    } catch (error) {
      console.error('Error during logout:', error);
      this.view.showError('Ошибка при выходе из системы');
    }
  }
}