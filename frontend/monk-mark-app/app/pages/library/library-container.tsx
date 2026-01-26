import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LibraryListing from '@/app/components/_library-components/_library-listing';

const LibraryContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Library Page</Text>
      <LibraryListing />
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

export default LibraryContainer;
