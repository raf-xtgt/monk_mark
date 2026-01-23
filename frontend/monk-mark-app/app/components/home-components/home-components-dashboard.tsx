import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeDashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Monk Mark</Text>
      <Text style={styles.subtitle}>Your reading companion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
});

export default HomeDashboard;
