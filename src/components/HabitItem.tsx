import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../shared/tokens';

type HabitItemProps = {
  name: string;
  isDone: boolean;
  onToggle: () => void;
};

export default function HabitItem({ name, isDone, onToggle }: HabitItemProps) {
  return (
    <TouchableOpacity style={styles.container_habit} onPress={onToggle}>
        <Text style={styles.name}>{name}</Text>
      <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
        {isDone && <Text style={styles.checkmark}>✓</Text>}
      </View>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container_habit: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor:Colors.white,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxDone: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
  },
  name: {
    color: Colors.gray,
    fontSize: 16,
  },
});