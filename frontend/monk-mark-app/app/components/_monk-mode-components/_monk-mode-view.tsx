import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FocusTimer from './_focus-timer';

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
      <FocusTimer />
      <View style={styles.bookInfo}>
        <Text style={styles.title}>Reading</Text>
        <Text style={styles.bookName}>{selectedBook.book_name}</Text>
        <Text style={styles.author}>by {selectedBook.author_name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a4a5e',
  },
  bookInfo: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  bookName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
});

export default MonkModeView;
