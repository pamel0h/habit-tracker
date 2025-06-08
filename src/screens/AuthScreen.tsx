import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AuthToggle from '../components/Auth/AuthToggle';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { Colors } from '../shared/tokens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation'; 
// import Robot from '../../assets/bot';
import AnimatedRobot from '../../assets/animated-robot';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const handleAuthSuccess = () => {
    navigation.navigate('Home'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.top}>
         
          <Image
            style = {styles.logo}
            source={require('../../assets/logo.png')}
            resizeMode='contain'
            />
          </View>
      <AuthToggle activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatedRobot/>
      {/* <Image
            style = {styles.bot}
            source={require('../../assets/bot.png')}
            resizeMode='contain'
            /> */}
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
      justifyContent:'center',
      padding:36,
      flex:1,  
    },
    content:{
      alignItems:'center',
      gap:30
  
    },
    top:{
      alignItems:'center',
      width:'100%',
      gap:24
    },
    logo:{
      marginLeft:16,
      width:196,
      height:80
    },
    bot:{
      marginLeft:48,
      width:150,
      height:162
    },
});