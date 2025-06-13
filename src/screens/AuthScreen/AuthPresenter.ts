import { AuthService } from '../../services/auth.service';

export interface AuthView {
  setActiveTab(tab: 'login' | 'register'): void;
  showError(error: string): void;
  navigateToMain(): void;
}

export interface AuthPresenter {
  onTabChange(tab: 'login' | 'register'): void;
  onLogin(loginOrEmail: string, password: string): void;
  onRegister(userData: { login: string; email: string; password: string }): void;
}

export class AuthPresenter {
  private view: AuthView;

  constructor(view: AuthView) {
    this.view = view;
  }

  onTabChange(tab: 'login' | 'register'): void {
    this.view.setActiveTab(tab);
  }

  async onLogin(loginOrEmail: string, password: string): Promise<void> {
    try {
      await AuthService.login(loginOrEmail, password);
      this.view.navigateToMain();
    } catch (error: any) {
      console.error('Error during login:', error);
      this.view.showError(error.message || 'Ошибка входа');
    }
  }

  async onRegister(userData: { login: string; email: string; password: string }): Promise<void> {
    try {
      await AuthService.register(userData);
      this.view.navigateToMain();
    } catch (error: any) {
      console.error('Error during registration:', error);
      this.view.showError(error.message || 'Ошибка регистрации');
    }
  }
}