import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteTakingView from '@/app/components/_notebook-components/_note-taking-view';
import NotebookBackground from '@/app/components/_notebook-components/_notebook-background';

const NoteTakerContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <NotebookBackground />
      <NoteTakingView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default NoteTakerContainer;
