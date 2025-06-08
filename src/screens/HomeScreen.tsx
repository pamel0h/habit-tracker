import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../shared/tokens';
import { Button } from '../shared/button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AuthService } from '../services/auth.service'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen(){
    const [userLogin, setUserLogin] = useState<string | null>(null); // null - значит еще загружается
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    
    useEffect(() => {
        const loadUserLogin = async () => {
          try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) {
              const user = JSON.parse(userData);
              setUserLogin(user.login);
            } else {
              setUserLogin(''); // Пустая строка - значит гость
            }
          } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
            setUserLogin(''); // В случае ошибки тоже считаем гостем
          }
        };
    
        loadUserLogin();
      }, []);
    
      // Показываем индикатор загрузки, если данные еще не загружены
      if (userLogin === null) {
        return (
          <View style={[styles.container, styles.loadingContainer]}>
            <ActivityIndicator size="large" color={Colors.blue} />
          </View>
        );
      }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.welcome}>Привет,  {userLogin || 'Гость'}!</Text>
                <Image
                    style = {styles.bot}
                    source={require('../../assets/bot.png')}
                    resizeMode='contain'
                />
                <Button text='Выйти' onPress={async () => {
                    await AuthService.logout(); // Очищаем данные
                    navigation.navigate('Auth'); // Переходим на экран входа
                }}></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
       flex:1,
       justifyContent:'center',
       alignItems:'center',
       backgroundColor:Colors.black,
       padding:36,
    },
    content:{
        
        gap:30,

    },
    bot:{
        marginLeft:80,
        width:150,
        height:162
    },
    welcome:{
        color:Colors.white,
        fontSize:36,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
})

