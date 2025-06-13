import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input } from '../../shared/input';
import { Button } from '../../shared/button';
import { AuthService } from '../../services/auth.service';

type LoginFormProps = {
  onAuthSuccess: () => void;
  setLoginOrEmail: (value: string) => void;
  setPassword: (value: string) => void;
};

export default function LoginForm({ onAuthSuccess, setLoginOrEmail, setPassword }: LoginFormProps) {
  const [loginOrEmailLocal, setLoginOrEmailLocal] = useState<string>('');
  const [passwordLocal, setPasswordLocal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.login(loginOrEmailLocal, passwordLocal);
      console.log('Успешный вход:', user);
      setLoginOrEmail(loginOrEmailLocal); // Обновляем родительское состояние
      setPassword(passwordLocal); // Обновляем родительское состояние
      onAuthSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      Alert.alert('Ошибка', message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = loginOrEmailLocal.trim() !== '' && passwordLocal.trim() !== '';

  return (
    <View style={styles.form}>
      <Input
        placeholder="Логин/Email"
        value={loginOrEmailLocal}
        onChangeText={setLoginOrEmailLocal}
      />
      <Input
        isPassword
        placeholder="Пароль"
        value={passwordLocal}
        onChangeText={setPasswordLocal}
      />
      <Button
        text={isLoading ? 'Вход...' : 'Войти'}
        onPress={handleLogin}
        disabled={!isFormValid || isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 26,
    width: '100%'
  },
});