import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../_state-controller/state-controller';

const NoteTakingTimer: React.FC = () => {
  const { focusTimer, setFocusTimer, focusSessionMetadata, setCurrentRoute } = useAppState();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const getTruncatedTitle = () => {
    const bookName = focusSessionMetadata?.bookName || 'Unknown Book';
    if (bookName.length > 10) {
      return `${bookName.substring(0, 10)}... - Notes`;
    }
    return `${bookName} - Notes`;
  };

  const handleBackPress = () => {
    setCurrentRoute(4); // Navigate back to MonkMode
  };

  // Continue the countdown if session is running
  useEffect(() => {
    const isRunning = focusSessionMetadata?.isRunning ?? false;

    if (isRunning && focusTimer) {
      intervalRef.current = setInterval(() => {
        setFocusTimer((prevTimer) => {
          if (!prevTimer) return null;

          let { hours, minutes, seconds } = prevTimer;

          if (seconds > 0) {
            seconds -= 1;
          } else {
            if (minutes > 0) {
              minutes -= 1;
              seconds = 59;
            } else {
              if (hours > 0) {
                hours -= 1;
                minutes = 59;
                seconds = 59;
              } else {
                // Timer reached 0
                return { hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }

          return { hours, minutes, seconds };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [focusSessionMetadata, focusTimer, setFocusTimer]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Timer Display and Title */}
      <View style={styles.centerContainer}>
        <Text style={styles.timerText}>
          {focusTimer
            ? `${formatTime(focusTimer.hours)}:${formatTime(focusTimer.minutes)}:${formatTime(focusTimer.seconds)}`
            : '00:00:00'}
        </Text>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{getTruncatedTitle()}</Text>
        </View>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
    marginBottom: 8,
  },
  titleContainer: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
