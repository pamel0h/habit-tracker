import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input } from '../../shared/input';
import { Button } from '../../shared/button';
import { AuthService } from '../../services/auth.service';


// Тип для пропсов компонента
type LoginFormProps = {
  onAuthSuccess: () => void;
};

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [loginOrEmail, setLoginOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.login(loginOrEmail, password);
      console.log('Успешный вход:', user);
      onAuthSuccess(); // Вызываем после успешной авторизации
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      Alert.alert('Ошибка', message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = loginOrEmail.trim() !== '' && password.trim() !== '';

  return (
    <View style={styles.form}>

      <Input 
        placeholder="Логин/Email"
        value={loginOrEmail}
        onChangeText={setLoginOrEmail}
      />
      <Input 
        isPassword 
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
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