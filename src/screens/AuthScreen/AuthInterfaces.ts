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