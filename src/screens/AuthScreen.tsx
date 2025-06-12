import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AuthToggle from '../components/Auth/AuthToggle';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { Colors } from '../shared/tokens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import AnimatedRobot from '../../assets/animated-robot';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const handleAuthSuccess = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.linearLayout}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
        <AuthToggle activeTab={activeTab} onTabChange={setActiveTab} />
        <AnimatedRobot />
        {activeTab === 'login' ? (
          <LoginForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onAuthSuccess={handleAuthSuccess} />
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
    marginVertical:'auto'
  },
  logo: {
    width: 196,
    height: 80,
    alignSelf: 'center', 
  },
});