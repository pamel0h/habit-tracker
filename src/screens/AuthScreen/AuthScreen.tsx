import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import AuthToggle from '../../components/Auth/AuthToggle';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import { Colors } from '../../shared/tokens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import AnimatedRobot from '../../../assets/animated-robot';
import { AuthPresenter, AuthView } from './AuthPresenter';
import { AuthService } from '../../services/auth.service';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginOrEmail, setLoginOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const presenter = new AuthPresenter({
    setActiveTab,
    showError: (error: string) => Alert.alert('Ошибка', error),
    navigateToMain: () => navigation.navigate('Main'),
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = await AuthService.checkAuth();
      if (user) {
        navigation.navigate('Main');
      }
    };
    checkAuthStatus();
  }, [navigation]);

  const handleAuthSuccess = (data: { loginOrEmail?: string; password?: string; login?: string; email?: string }) => {
    if (activeTab === 'login' && data.loginOrEmail && data.password) {
      presenter.onLogin(data.loginOrEmail, data.password);
    } else if (activeTab === 'register' && data.login && data.email && data.password) {
      presenter.onRegister({ login: data.login, email: data.email, password: data.password });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.linearLayout}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')} />
        <AuthToggle activeTab={activeTab} onTabChange={(tab) => presenter.onTabChange(tab)} />
        <AnimatedRobot />
        {activeTab === 'login' ? (
          <LoginForm
            onAuthSuccess={(loginOrEmail, password) => handleAuthSuccess({ loginOrEmail, password })}
            setLoginOrEmail={setLoginOrEmail}
            setPassword={setPassword}
          />
        ) : (
          <RegisterForm
            onAuthSuccess={(userData) => handleAuthSuccess(userData)}
            setLogin={setLogin}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    padding: 36,
    flex: 1,
  },
  linearLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 30,
    marginVertical: 'auto',
  },
  logo: {
    width: 196,
    height: 80,
    alignSelf: 'center',
  },
});