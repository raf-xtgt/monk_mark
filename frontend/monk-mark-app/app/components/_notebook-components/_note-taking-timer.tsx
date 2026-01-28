import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../_state-controller/state-controller';

const NoteTakingTimer: React.FC = () => {
  const { focusTimer, setCurrentRoute } = useAppState();

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const handleBackPress = () => {
    setCurrentRoute(4); // Navigate back to MonkMode
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {focusTimer
            ? `${formatTime(focusTimer.hours)}:${formatTime(focusTimer.minutes)}:${formatTime(focusTimer.seconds)}`
            : '00:00:00'}
        </Text>
      </View>

      {/* Active Session Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={styles.activeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  indicatorContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
  },
});

export default NoteTakingTimer;
