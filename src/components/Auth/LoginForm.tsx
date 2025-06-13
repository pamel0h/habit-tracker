import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../shared/input';
import { Button } from '../../shared/button';

type LoginFormProps = {
  onAuthSuccess: (loginOrEmail: string, password: string) => void; // Изменяем сигнатуру
  setLoginOrEmail: (value: string) => void;
  setPassword: (value: string) => void;
};

export default function LoginForm({ onAuthSuccess, setLoginOrEmail, setPassword }: LoginFormProps) {
  const [loginOrEmailLocal, setLoginOrEmailLocal] = useState<string>('');
  const [passwordLocal, setPasswordLocal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoading(true);
    setLoginOrEmail(loginOrEmailLocal);
    setPassword(passwordLocal);
    onAuthSuccess(loginOrEmailLocal, passwordLocal); // Передаем данные в родительский компонент
    setIsLoading(false);
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