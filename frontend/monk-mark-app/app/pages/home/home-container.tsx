import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeDashboard from '../../components/_home-components/home-components-dashboard';

const HomeContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <HomeDashboard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeContainer;
