import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../shared/input';
import { Colors } from '../../shared/tokens';
import { Button } from '../../shared/button';

type RegisterFormProps = {
  onAuthSuccess: (userData: { login: string; email: string; password: string }) => void; // Изменяем сигнатуру
  setLogin: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
};

export default function RegisterForm({ onAuthSuccess, setLogin, setEmail, setPassword }: RegisterFormProps) {
  const [loginLocal, setLoginLocal] = useState<string>('');
  const [emailLocal, setEmailLocal] = useState<string>('');
  const [passwordLocal, setPasswordLocal] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = () => {
    try {
      if (passwordLocal !== confirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      if (!isChecked) {
        throw new Error('Необходимо принять условия');
      }
      setIsLoading(true);
      setLogin(loginLocal);
      setEmail(emailLocal);
      setPassword(passwordLocal);
      onAuthSuccess({ login: loginLocal, email: emailLocal, password: passwordLocal });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      Alert.alert('Ошибка', message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = loginLocal.trim().length > 0 && 
                     emailLocal.trim().length > 0 && 
                     passwordLocal.trim().length >= 6 && 
                     passwordLocal === confirmPassword && 
                     isChecked;

  return (
    <View style={styles.form}>
      <Input 
        placeholder="Логин"
        value={loginLocal}
        onChangeText={setLoginLocal}
      />
      <Input 
        placeholder="Email"
        value={emailLocal}
        onChangeText={setEmailLocal}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input 
        isPassword 
        placeholder="Пароль (мин. 6 символов)"
        value={passwordLocal}
        onChangeText={setPasswordLocal}
      />
      <Input 
        isPassword 
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.terms}>
          Согласен с  
          <Text style={styles.link}> правилами пользования</Text>
        </Text>
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <View style={styles.innerCheck}/>}
        </TouchableOpacity> 
      </View>
      <Button 
        text={isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        onPress={handleRegister}
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerCheck: {
    width: 16,
    height: 16,
    backgroundColor: Colors.blue,
    borderRadius: 2
  },
  terms: {
    fontSize: 12,
    color: '#969393'
  },
  link: {
    color: Colors.blue,
  }
});