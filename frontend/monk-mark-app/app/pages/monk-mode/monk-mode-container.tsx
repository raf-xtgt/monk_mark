import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MonkModeContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Monk Mode Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default MonkModeContainer;
