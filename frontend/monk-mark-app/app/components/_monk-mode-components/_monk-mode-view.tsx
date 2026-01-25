import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookResult {
  guid: string;
  book_name: string;
  author_name: string;
  description: string;
  cover_image_url: string;
}

interface MonkModeViewProps {
  selectedBook: BookResult | null;
}

const MonkModeView: React.FC<MonkModeViewProps> = ({ selectedBook }) => {
  if (!selectedBook) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Book</Text>
      <Text style={styles.bookName}>{selectedBook.book_name}</Text>
      <Text style={styles.author}>by {selectedBook.author_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookName: {
    fontSize: 20,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
});

export default MonkModeView;
