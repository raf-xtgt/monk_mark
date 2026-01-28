import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoteTakingTimer from './_note-taking-timer';

const NoteTakingView: React.FC = () => {
  const handleCameraPress = () => {
    console.log('Camera button pressed');
    // TODO: Implement camera functionality
  };

  return (
    <View style={styles.container}>
      <NoteTakingTimer />
      {/* Note taking content will go here */}

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleCameraPress}>
        <Ionicons name="camera" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default NoteTakingView;
