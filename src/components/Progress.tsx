import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../shared/tokens';

export default function ProgressProgress({ progress }: { progress: number }) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View 
          style={[styles.progressFill, { width: `${progress * 100}%` }]} 
        />
      </View>
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    height: 8,
    width: 100,
    backgroundColor: Colors.gray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.lightBlue,
  },
  progressText: {
    color: Colors.white,
    fontSize: 16,
  },
});