import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NotebookListing from '@/app/components/_notebook-components/_notebook-listing';
import NotebookView from '@/app/components/_notebook-components/_notebook-view';

const NotebookContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notebook Page</Text>
      <NotebookListing />
      <NotebookView />
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

export default NotebookContainer;
