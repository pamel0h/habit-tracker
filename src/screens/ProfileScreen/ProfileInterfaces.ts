export interface ProfileView {
  setUser(user: { login: string; email: string } | null): void;
  showError(error: string): void;
  navigateToAuth(): void;
};

export interface ProfilePresenter {
  onViewMounted(): void;
  onLogout(): void;
}