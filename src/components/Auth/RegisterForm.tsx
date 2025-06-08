import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../shared/input';
import { Colors } from '../../shared/tokens';
import { Button } from '../../shared/button';
import { AuthService } from '../../services/auth.service';

type RegisterFormProps = {
  onAuthSuccess: () => void;
};

export default function RegisterForm({ onAuthSuccess }: RegisterFormProps) {
  const [login, setLogin] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      
      if (!isChecked) {
        throw new Error('Необходимо принять условия');
      }

      setIsLoading(true);
      await AuthService.register({ 
        login, 
        email, 
        password 
      });
      onAuthSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      Alert.alert('Ошибка', message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = login.trim().length > 0 && 
                     email.trim().length > 0 && 
                     password.trim().length >= 6 && 
                     password === confirmPassword && 
                     isChecked;

  return (
    <View style={styles.form}>
      <Input 
        placeholder="Логин"
        value={login}
        onChangeText={setLogin}
      />
      <Input 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input 
        isPassword 
        placeholder="Пароль (мин. 6 символов)"
        value={password}
        onChangeText={setPassword}
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
    color:'#969393'
  },
  link: {
    color: Colors.blue,
  }
});

