import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../shared/tokens';

export default function AuthToggle({ activeTab, onTabChange }: {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}) {
  return (
    
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'login' && styles.activeTab,
          { borderRightWidth: 0.5 }
        ]}
        onPress={() => onTabChange('login')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'login' && styles.activeText
        ]}>
          Вход
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'register' && styles.activeTab,
          { borderLeftWidth: 0.5 }
        ]}
        onPress={() => onTabChange('register')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'register' && styles.activeText
        ]}>
          Регистрация
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '70%',
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderColor: Colors.white,
  },
  activeTab: {
    backgroundColor: Colors.lightBlue,
  },
  tabText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'FiraSans-Regular',
  },
  activeText: {
    color: Colors.black,
    fontFamily: 'FiraSans-Bold',
  },
});