import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteTakingTimer from './_note-taking-timer';

const NoteTakingView: React.FC = () => {
  return (
    <View style={styles.container}>
      <NoteTakingTimer />
      {/* Note taking content will go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NoteTakingView;
