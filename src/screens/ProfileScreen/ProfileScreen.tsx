import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import AnimatedRobot from '../../../assets/animated-robot';
import { Colors } from '../../shared/tokens';
import { Button } from '../../shared/button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { ProfilePresenter, ProfileView } from './ProfilePresenter';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ login: string; email: string } | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const presenter = new ProfilePresenter({
    setUser,
    showError: (error: string) => Alert.alert('Ошибка', error),
    navigateToAuth: () => navigation.navigate('Auth'),
  });

  useEffect(() => {
    presenter.onViewMounted();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.constraintLayout}>
        <AnimatedRobot />
        <Text style={styles.login}>{user?.login || 'Гость'}</Text>
        <Text style={styles.email}>{user?.email || 'Нет email'}</Text>
        <Button
          style={styles.logout}
          text="Выйти"
          onPress={() => presenter.onLogout()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  constraintLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  email: {
    color: Colors.gray,
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  logout: {
    width: '40%',
  },
});