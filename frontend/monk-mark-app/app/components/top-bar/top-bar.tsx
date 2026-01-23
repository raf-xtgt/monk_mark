import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monk Mark</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TopBar;
