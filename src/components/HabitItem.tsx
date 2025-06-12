import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../shared/tokens';

type HabitItemProps = {
  name: string;
  isDone: boolean;
  onToggle: () => void;
  onEdit: () => void;
};

function HabitItem({ name, isDone, onToggle, onEdit }: HabitItemProps) {
  return (
    <View style={styles.container_habit}>
      <TouchableOpacity style={styles.nameContainer} onPress={onEdit}>
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.checkbox, isDone && styles.checkboxDone]} onPress={onToggle}>
        {isDone && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default memo(HabitItem);

const styles = StyleSheet.create({
  container_habit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 10,
  },
  nameContainer: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    color: Colors.gray,
    fontSize: 16,
  },
  checkbox: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
  },
});